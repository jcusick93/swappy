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
let componentCount = 0;

// Function to get the image URL for a node
async function getImageURL(node: SceneNode): Promise<string> {
  try {
    // Export node as PNG with 2x resolution
    const image = await node.exportAsync({
      format: "PNG",
      constraint: { type: "SCALE", value: 2 },
    });
    const base64 = figma.base64Encode(image);
    return `data:image/png;base64,${base64}`;
  } catch (error) {
    console.error("Error exporting image:", error);
    return ""; // Return empty string if export fails
  }
}

// Function to swap button components
async function swapButtons(state) {
  console.log("Swap state received:", state); // Debugging log

  // Store an array to hold the swapped component data
  const swappedComponents = [];

  // Iterate over each component in the map
  for (const component of componentMap) {
    const { oldParentKey, variants } = component;

    // Get nodes based on the state
    const nodes =
      state === "bySelection"
        ? getSelectedInstances(figma.currentPage.selection) // Use the current selection
        : figma.currentPage.findAll(
            (n) =>
              n.type === "INSTANCE" &&
              (n.mainComponent?.parent as any)?.key === oldParentKey
          ); // Use findAll for "byPage"

    // Log the nodes found
    console.log("Nodes to swap:", nodes);

    // If no nodes are found in selection, notify the user
    if (state === "bySelection" && nodes.length === 0) {
      figma.notify("No instances selected for swapping.");
      return; // Exit the function early
    }

    // Iterate through each variant
    for (const variant of variants) {
      const { newComponentKey, keywords } = variant;

      // Import the new component once
      const newComponent = await figma.importComponentByKeyAsync(
        newComponentKey
      );

      // Ensure the new component is imported before proceeding
      if (newComponent) {
        // Iterate through all nodes and check their names
        for (const node of nodes) {
          if (node.type === "INSTANCE" && node.mainComponent) {
            const name = node.mainComponent.name;

            // Check if all keywords are present in the name
            const allKeywordsPresent = keywords.every((keyword) =>
              name.includes(keyword)
            );

            if (allKeywordsPresent) {
              // Save old and new component info before swapping
              const oldImageSrc = await getImageURL(node);
              const newImageSrc = await getImageURL(newComponent);

              swappedComponents.push({
                oldImage: oldImageSrc, // Get image of old component
                newImage: newImageSrc, // Get image of new component
              });

              node.resetOverrides();
              node.swapComponent(newComponent);
              componentCount++;
            }
          }
        }
      }
    }
  }

  // Notify the user about the swap results
  if (componentCount > 0) {
    figma.notify(
      `✨ ${componentCount} ${
        componentCount === 1 ? "component" : "components"
      } swapped`
    );

    // Send back the swapped components data to the UI
    figma.ui.postMessage({
      type: "COMPONENT_IMAGES",
      componentImages: swappedComponents, // Send all swapped components with image data
    });
  } else {
    figma.notify(`No components swapped`);
  }

  componentCount = 0;
}

// Listen for messages from the UI
figma.ui.onmessage = async (msg) => {
  if (msg.type === "SWAP_BUTTONS") {
    const state = msg.state; // Assuming the state is sent in the message
    console.log("Message received from UI:", msg); // Debugging log
    await swapButtons(state);
  }
};

console.log(componentCount);
