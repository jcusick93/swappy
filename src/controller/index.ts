// Clear console on reload
console.clear();

// Default plugin size
const pluginFrameSize = {
  width: 340,
  height: 370,
};

// Show plugin UI
figma.showUI(__html__, pluginFrameSize);

// Import the component map
import { componentMap } from "../app/data"; // Adjust the path as necessary
let componentCount = 0;

// Function to swap button components
async function swapButtons() {
  // Iterate over each component in the map
  for (const component of componentMap) {
    const { oldParentKey, variants } = component;

    // Get all nodes on the current page that have the old button's main component key
    const nodes = figma.currentPage.findAll(
      (n) =>
        n.type === "INSTANCE" &&
        (n.mainComponent?.parent as any)?.key === oldParentKey
    );

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
    await swapButtons();
  }
};

console.log(componentCount);
