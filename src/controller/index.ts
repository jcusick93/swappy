import { getSelectedInstances } from "../app/utils/getSelectedInstances"; // Adjust the path as necessary
import { getImageURL } from "../app/utils/getImageURL";
import { componentMap } from "../app/data"; // Adjust the path as necessary

// Clear console on reload
console.clear();

// Default plugin size
const pluginFrameSize = {
  width: 320,
  height: 500,
};

// Show plugin UI
figma.showUI(__html__, pluginFrameSize);

// Declare a global variable to store scanned components
let scannedComponents: {
  id: number; // Added id to the scanned component structure
  node: InstanceNode; // Change to InstanceNode
  newComponentKey: string;
  checked: boolean;
  oldImage?: string; // Optional: to hold old image URL if needed
  newImage?: string; // Optional: to hold new image URL if needed
  groupName: string; // Added groupName to the scanned component structure
}[] = [];

// Variable to hold the resetOverrides state
let resetOverrides = true; // Default value

// Initialize a counter for generating unique IDs
let componentIdCounter = 0;

// Function to initialize the plugin
async function initializePlugin() {
  console.clear();
  figma.showUI(__html__, pluginFrameSize);

  // Retrieve the resetOverrides value from clientStorage
  const storedResetOverrides = await figma.clientStorage.getAsync(
    "resetOverrides"
  );
  resetOverrides =
    storedResetOverrides !== undefined ? storedResetOverrides : true; // Default to true if not set
  console.log("Retrieved resetOverrides from storage:", resetOverrides);
}

// Function to post messages to the UI
function postMessageToUI(type: string, payload: any) {
  figma.ui.postMessage({ type, ...payload });
}

// Function to process variants for a component
async function processVariants(
  variant: any,
  nodes: InstanceNode[], // Change to InstanceNode[]
  groupName: string
) {
  const { newComponentKey, keywords } = variant; // Adjusted to pull from variant

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
            id: componentIdCounter++, // Increment and assign a unique id
            oldImage: oldImageSrc,
            newImage: newImageSrc,
            node,
            newComponentKey,
            checked: true, // Default checked state
            groupName, // Store the groupName in each scanned component
          });
        }
      }
    }
  }
}

// Function to scan components
async function scanComponents(state: string) {
  console.log("Scan state received:", state);
  scannedComponents = [];
  componentIdCounter = 0;

  const allNodes =
    state === "bySelection"
      ? getSelectedInstances(figma.currentPage.selection, componentMap)
      : figma.currentPage.findAll((n) => n.type === "INSTANCE");

  // Process each component in the componentMap
  for (const component of componentMap) {
    const { oldParentKey, variants } = component;

    // Create an array of oldParentKeys from componentMap
    const oldParentKeys = componentMap.map(
      (component) => component.oldParentKey
    );
    // Filter nodes that belong to the current component and are not children (i.e., have no parent)
    const nodes = allNodes.filter(
      (node): node is InstanceNode =>
        node.type === "INSTANCE" &&
        // Check if the main component key matches the old parent key
        (node.mainComponent?.key === oldParentKey ||
          node.mainComponent?.parent?.key === oldParentKey) &&
        // Ensure the parent is not an instance
        node.parent &&
        // Ensure the parent's keys do not match any keys in the parent array
        !oldParentKeys.includes(node.parent?.mainComponent?.key)
    );

    for (const variant of variants) {
      await processVariants(variant, nodes, component.groupName); // Pass groupName here
    }
  }

  // Sends message to update state in App
  postMessageToUI("COMPONENT_IMAGES", {
    componentImages: scannedComponents.map(
      ({ id, oldImage, newImage, checked, groupName }) => ({
        id, // Include the id
        oldImage,
        newImage,
        checked, // Include the checked state
        groupName, // Include groupName in the payload
      })
    ),
  });
  postMessageToUI("SCAN_COMPLETE", {});
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
      if (resetOverrides) {
        instanceNode.resetOverrides(); // Reset overrides if the flag is true
      }
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
      id: component.id, // Include the id in the update
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
  } else if (msg.type === "RESET_OVERRIDES") {
    resetOverrides = msg.value; // Capture the value correctly
    await figma.clientStorage.setAsync("resetOverrides", resetOverrides); // Store the value in client storage
    console.log("Reset overrides set to:", resetOverrides); // Log the new value
  } else if (msg.type === "GET_RESET_OVERRIDES") {
    // New message type
    figma.ui.postMessage({
      type: "RESET_OVERRIDES_STATUS",
      value: resetOverrides,
    }); // Send the current value back to the UI
  }
};

// Initialize the plugin
initializePlugin();
