// main.ts
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

// Function to swap button components
async function swapButtons(state) {
  console.log("Swap state received:", state); // Debugging log

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
              // Resets all changes made to old component e.g. fill or spacing changes
              node.resetOverrides();
              // Calls the swapComponent method
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
