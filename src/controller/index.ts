import { getSelectedInstances } from "../app/utils/getSelectedInstances"; // Adjust the path as necessary

// Clear console on reload
console.clear();

// Default plugin size
const pluginFrameSize = {
  width: 320,
  height: 380,
};

// Show plugin UI
figma.showUI(__html__, pluginFrameSize);

// Import the component map
import { componentMap } from "../app/data"; // Adjust the path as necessary

// Declare a global variable to store scanned components
let scannedComponents: {
  node: SceneNode;
  newComponentKey: string;
  checked: boolean;
  oldImage?: string; // Optional: to hold old image URL if needed
  newImage?: string; // Optional: to hold new image URL if needed
}[] = [];

// Function to get the image URL for a node
async function getImageURL(node: SceneNode): Promise<string> {
  try {
    const image = await node.exportAsync({
      format: "PNG",
      constraint: { type: "SCALE", value: 2 },
    });
    const base64 = figma.base64Encode(image);
    return `data:image/png;base64,${base64}`;
  } catch (error) {
    console.error("Error exporting image:", error);
    return "";
  }
}

// Function to scan components (byPage or bySelection)
async function scanComponents(state: string) {
  console.log("Scan state received:", state);

  // Reset scannedComponents array before scanning
  scannedComponents = [];

  for (const component of componentMap) {
    const { oldParentKey, variants } = component;

    const nodes =
      state === "bySelection"
        ? getSelectedInstances(figma.currentPage.selection)
        : figma.currentPage.findAll(
            (n) =>
              n.type === "INSTANCE" &&
              (n.mainComponent?.parent as any)?.key === oldParentKey
          );

    if (state === "bySelection" && nodes.length === 0) {
      figma.ui.postMessage({ type: "SCAN_COMPLETE" });
      figma.notify("No instances selected for scanning.");
      return;
    }

    for (const variant of variants) {
      const { newComponentKey, keywords } = variant;
      const newComponent = await figma.importComponentByKeyAsync(
        newComponentKey
      );

      if (newComponent) {
        for (const node of nodes) {
          if (node.type === "INSTANCE" && node.mainComponent) {
            const name = node.mainComponent.name;
            const allKeywordsPresent = keywords.every((keyword) =>
              name.includes(keyword)
            );

            if (allKeywordsPresent) {
              const oldImageSrc = await getImageURL(node);
              const newImageSrc = await getImageURL(newComponent);

              // Add component with old/new images and checked state to scannedComponents
              scannedComponents.push({
                oldImage: oldImageSrc,
                newImage: newImageSrc,
                node,
                newComponentKey,
                checked: true, // Default checked state
              });
            }
          }
        }
      }
    }

    // Sends message to update state in App
    figma.ui.postMessage({
      type: "COMPONENT_IMAGES",
      componentImages: scannedComponents.map(
        ({ oldImage, newImage, checked }) => ({
          oldImage,
          newImage,
          checked, // Include the checked state
        })
      ),
    });
    figma.ui.postMessage({ type: "SCAN_COMPLETE" });
  }
}

async function swapComponents(checkedStates: boolean[]) {
  console.log("Swapping components...");

  // Filter out components that are checked
  const toSwapComponents = scannedComponents.filter((_, index) => {
    return checkedStates[index];
  });

  // Loop through the components to swap
  for (const component of toSwapComponents) {
    const { node, newComponentKey } = component;

    const newComponent = await figma.importComponentByKeyAsync(newComponentKey);
    if (newComponent) {
      if (node.type === "INSTANCE") {
        const instanceNode = node as InstanceNode;
        instanceNode.resetOverrides();
        instanceNode.swapComponent(newComponent);
      } else {
        console.warn(`Node is not an instance: ${node.name}`);
      }
    }
  }

  // Update scannedComponents to only include unchecked items
  scannedComponents = scannedComponents.filter(
    (_, index) => !checkedStates[index]
  );

  // Post the updated scannedComponents back to the UI
  figma.ui.postMessage({
    type: "UPDATE_SCANNED_COMPONENTS",
    updatedComponents: scannedComponents.map((component) => ({
      oldImage: component.oldImage,
      newImage: component.newImage,
      checked: false, // or keep it as is, based on your logic
    })),
  });

  // Post the indexes of swapped components back to the UI
  const swappedIndexes = scannedComponents
    .map((_, index) => index)
    .filter((index) => checkedStates[index]);

  // Sends a message to the UI indicating which components were swapped
  figma.ui.postMessage({
    type: "COMPONENTS_SWAPPED",
    swappedIndexes,
  });

  const swappedCount = toSwapComponents.length;
  figma.notify(
    swappedCount > 0
      ? `✨ ${swappedCount} component${swappedCount === 1 ? "" : "s"} swapped`
      : "No components swapped"
  );

  // Sends a message to the UI that the swap was completed
  figma.ui.postMessage({ type: "SWAP_COMPLETE" });
}

// Function to update scanned components based on the new checked states
function updateScannedComponents(updatedComponents: any) {
  console.log("Updating scanned components with new checked states...");

  // Update the global scannedComponents with the new checked states
  scannedComponents = updatedComponents.map((component: any, index: number) => {
    return {
      ...scannedComponents[index],
      checked: component.checked, // Update checked state
    };
  });

  console.log("Updated scanned components:", scannedComponents);
}

// Listen for messages from the UI
figma.ui.onmessage = async (msg) => {
  if (msg.type === "SCAN_COMPONENTS") {
    const state = msg.scanType;
    console.log("Message received from UI:", msg);
    await scanComponents(state);
  } else if (msg.type === "SWAP_COMPONENTS") {
    console.log("Swapping components...");
    await swapComponents(msg.checkedStates);
  } else if (msg.type === "UPDATE_SCANNED_COMPONENTS") {
    console.log("Received updated scanned components from UI...");
    updateScannedComponents(msg.updatedComponents);
  }
};

console.log(scannedComponents);
