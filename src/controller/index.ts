import { getSelectedInstances } from "../app/utils/getSelectedInstances";
import { getImageURL } from "../app/utils/getImageURL";
import { componentMap } from "../app/data";

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
  originalProperties?: any; // Optional: to hold original properties for later use
  appliedImage?: string; // Optional: to hold applied image URL if needed
}[] = [];

// Cache for resetOverrides
let resetOverrides: boolean | undefined;

// Initialize a counter for generating unique IDs
let componentIdCounter = 0;

// Function to initialize the plugin
async function initializePlugin() {
  if (resetOverrides === undefined) {
    const storedResetOverrides = await figma.clientStorage.getAsync(
      "resetOverrides"
    );
    resetOverrides =
      storedResetOverrides !== undefined ? storedResetOverrides : true; // Default to true if not set
    console.log("Retrieved resetOverrides from storage:", resetOverrides);
  }

  figma.showUI(__html__, pluginFrameSize);
}

// Function to post messages to the UI
function postMessageToUI(type: string, payload: any) {
  figma.ui.postMessage({ type, ...payload });
}

// Function to scan components
async function scanComponents(state: string) {
  console.log("Scan state received:", state);
  scannedComponents = [];
  componentIdCounter = 0;

  // Load the current page explicitly
  await figma.currentPage.loadAsync();

  // Get and load all nodes
  let allNodes: SceneNode[] = [];

  if (state === "bySelection") {
    allNodes = await getSelectedInstances(
      figma.currentPage.selection,
      componentMap
    );
  } else {
    allNodes = figma.currentPage.findAll((n) => n.type === "INSTANCE");
  }

  // Create an array of all component old keys
  const oldKeys = componentMap.map((component) => component.oldParentKey);

  // Function to recursively check all ancestors
  async function hasAncestorWithOldKey(node: InstanceNode): Promise<boolean> {
    let currentNode: BaseNode | null = node.parent;
    while (currentNode) {
      if (currentNode.type === "INSTANCE") {
        const mainComponent = await (
          currentNode as InstanceNode
        ).getMainComponentAsync();
        if (
          mainComponent &&
          oldKeys.includes(
            mainComponent.parent
              ? (mainComponent.parent as ComponentNode).key
              : mainComponent.key
          )
        ) {
          return true;
        }
      }
      currentNode = currentNode.parent;
    }
    return false;
  }

  // Process each component in the componentMap
  for (const component of componentMap) {
    const { oldParentKey } = component;

    // Filter nodes
    const filteredNodes: InstanceNode[] = [];
    const nodeIds = new Set<string>(); // Set to track unique node IDs

    for (const node of allNodes) {
      if (node.type === "INSTANCE") {
        const mainComponent = await node.getMainComponentAsync();
        if (!mainComponent) continue;

        // Check ancestors
        const shouldInclude = !(await hasAncestorWithOldKey(node));

        // Only proceed if we should include this node
        if (shouldInclude) {
          const isMatch =
            mainComponent.key === oldParentKey ||
            (mainComponent.parent?.type === "COMPONENT" &&
              mainComponent.parent.key === oldParentKey) ||
            (mainComponent.parent?.type === "COMPONENT_SET" &&
              mainComponent.parent.key === oldParentKey);

          if (isMatch && !nodeIds.has(node.id)) {
            filteredNodes.push(node);
            nodeIds.add(node.id); // Add node ID to the Set
          }
        }
      }
    }

    // Process the component
    await processComponent(component, filteredNodes);
  }

  // Send messages to UI
  postMessageToUI("COMPONENT_IMAGES", {
    componentImages: scannedComponents.map(
      ({ id, oldImage, newImage, checked, groupName }) => ({
        id,
        oldImage,
        newImage,
        checked,
        groupName,
      })
    ),
  });
  postMessageToUI("SCAN_COMPLETE", {});
}

// Function to process components
async function processComponent(
  component: any,
  nodes: InstanceNode[] // Change to InstanceNode[]
) {
  const { newComponentKey } = component; // Pull newComponentKey from the component

  const newComponent = await figma.importComponentByKeyAsync(newComponentKey);

  if (newComponent) {
    for (const node of nodes) {
      if (node.type === "INSTANCE") {
        const mainComponent = await node.getMainComponentAsync(); // Use async method to get main component
        if (mainComponent) {
          const oldImageSrc = await getImageURL(node);
          const newImageSrc = await getImageURL(newComponent);

          // Add component with old/new images and checked state to scannedComponents
          scannedComponents.push({
            id: componentIdCounter++, // Increment and assign a unique id
            oldImage: oldImageSrc,
            newImage: newImageSrc, // Use the default image of the new component
            node,
            newComponentKey,
            checked: true, // Default checked state
            groupName: component.groupName, // Use groupName from the component
            appliedImage: newImageSrc, // Store the applied image URL
          });
        }
      }
    }
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

    // Check if the node still exists
    const existingNode = await figma.getNodeByIdAsync(node.id);
    if (!existingNode) {
      console.warn(`Node with id ${node.id} does not exist.`);
      continue;
    }

    // Ensure the node is of type INSTANCE
    if (existingNode.type !== "INSTANCE") {
      console.warn(`Node with id ${node.id} is not an instance.`);
      continue;
    }

    const instanceNode = existingNode as InstanceNode;
    const originalProperties = instanceNode.componentProperties; // Get properties from the original instance
    console.log("Original Instance Properties:", originalProperties); // Log the properties of the original

    const newComponent = await figma.importComponentByKeyAsync(newComponentKey);

    if (newComponent) {
      if (resetOverrides) {
        instanceNode.resetOverrides(); // Reset overrides if the flag is true
      }
      instanceNode.swapComponent(newComponent);

      // Retrieve the new instance node after the swap
      const newInstanceNode = instanceNode; // Ensure this is the new instance node
      console.log("New Instance Node:", newInstanceNode); // Log the new instance node

      // Set the original properties on the new instance node dynamically
      const formattedProperties: any = {}; // Create an empty object to hold properties

      // Iterate over originalProperties to set dynamic properties
      for (const key in originalProperties) {
        if (originalProperties.hasOwnProperty(key)) {
          const propValue = originalProperties[key];

          // Log the key and value to check their types
          console.log(`Key: ${key}, Value:`, propValue);

          // Check if the value is an object and extract the 'value' property if it exists
          if (
            typeof propValue === "object" &&
            propValue !== null &&
            "value" in propValue
          ) {
            formattedProperties[key] = propValue.value; // Use the 'value' property
          } else if (
            typeof propValue === "string" ||
            typeof propValue === "boolean"
          ) {
            formattedProperties[key] = propValue; // Directly assign if it's a valid type
          } else {
            console.warn(
              `Invalid type for key "${key}": expected string or boolean, received ${typeof propValue}`
            );
          }
        }
      }

      try {
        await newInstanceNode.setProperties(formattedProperties); // Use setProperties method
        console.log(
          "Applied Original Instance Properties:",
          formattedProperties
        ); // Log the applied properties
      } catch (error) {
        console.error("Error setting properties on new instance node:", error);
      }
    } else {
      console.warn(
        `New component with key ${newComponentKey} could not be imported.`
      );
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
