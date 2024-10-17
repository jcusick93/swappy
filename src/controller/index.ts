import { getSelectedInstances } from "../app/utils/getSelectedInstances"; // Adjust the path as necessary
import { getImageURL } from "../app/utils/getImageURL";
import { componentMap } from "../app/data"; // Adjust the path as necessary

// Clear console on reload
console.clear();

// Default plugin size
const pluginFrameSize = {
  width: 320,
  height: 400,
};

// Show plugin UI
figma.showUI(__html__, pluginFrameSize);

// Declare a global variable to store scanned components
let scannedComponents: {
  node: SceneNode;
  newComponentKey: string;
  checked: boolean;
  oldImage?: string; // Optional: to hold old image URL if needed
  newImage?: string; // Optional: to hold new image URL if needed
}[] = [];

// Function to initialize the plugin
function initializePlugin() {
  console.clear();
  figma.showUI(__html__, pluginFrameSize);
}

// Function to post messages to the UI
function postMessageToUI(type: string, payload: any) {
  figma.ui.postMessage({ type, ...payload });
}

// Function to process variants for a component
async function processVariants(component: any, nodes: SceneNode[]) {
  const { newComponentKey, keywords } = component;
  const newComponent = await figma.importComponentByKeyAsync(newComponentKey);

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

// Function to scan components (byPage or bySelection)
async function scanComponents(state: string) {
  console.log("Scan state received:", state);
  scannedComponents = []; // Reset scannedComponents array before scanning

  for (const component of componentMap) {
    const { oldParentKey, variants } = component;

    const nodes =
      state === "bySelection"
        ? getSelectedInstances(figma.currentPage.selection, componentMap)
        : figma.currentPage.findAll(
            (n) =>
              n.type === "INSTANCE" &&
              (n.mainComponent?.parent as any)?.key === oldParentKey
          );

    if (state === "bySelection" && nodes.length === 0) {
      postMessageToUI("SCAN_COMPLETE", {});
      figma.notify("No instances selected for scanning.");
      return;
    }

    for (const variant of variants) {
      await processVariants(variant, nodes);
    }

    // Sends message to update state in App
    postMessageToUI("COMPONENT_IMAGES", {
      componentImages: scannedComponents.map(
        ({ oldImage, newImage, checked }) => ({
          oldImage,
          newImage,
          checked, // Include the checked state
        })
      ),
    });
    postMessageToUI("SCAN_COMPLETE", {});
  }
}

// Function to swap components
async function swapComponents(checkedStates: boolean[]) {
  console.log("Swapping components...");

  const toSwapComponents = scannedComponents.filter(
    (_, index) => checkedStates[index]
  );

  for (const component of toSwapComponents) {
    const { node, newComponentKey } = component;
    const newComponent = await figma.importComponentByKeyAsync(newComponentKey);

    if (newComponent && node.type === "INSTANCE") {
      const instanceNode = node as InstanceNode;
      instanceNode.swapComponent(newComponent);
    } else {
      console.warn(`Node is not an instance: ${node.name}`);
    }
  }

  scannedComponents = scannedComponents.filter(
    (_, index) => !checkedStates[index]
  );

  postMessageToUI("UPDATE_SCANNED_COMPONENTS", {
    updatedComponents: scannedComponents.map((component) => ({
      oldImage: component.oldImage,
      newImage: component.newImage,
      checked: false,
    })),
  });

  const swappedIndexes = scannedComponents
    .map((_, index) => index)
    .filter((index) => checkedStates[index]);

  postMessageToUI("COMPONENTS_SWAPPED", { swappedIndexes });

  const swappedCount = toSwapComponents.length;
  figma.notify(
    swappedCount > 0
      ? `✨ ${swappedCount} component${swappedCount === 1 ? "" : "s"} swapped`
      : "No components swapped"
  );

  postMessageToUI("SWAP_COMPLETE", {});
}

// Function to update scanned components based on the new checked states
function updateScannedComponents(updatedComponents: any) {
  console.log("Updating scanned components with new checked states...");
  scannedComponents = updatedComponents.map(
    (component: any, index: number) => ({
      ...scannedComponents[index],
      checked: component.checked, // Update checked state
    })
  );
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

// Initialize the plugin
initializePlugin();
