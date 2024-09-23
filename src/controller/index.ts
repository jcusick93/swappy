// Clear console on reload
console.clear();

// Default plugin size
const pluginFrameSize = {
  width: 340,
  height: 370,
};

// Show plugin UI
// Show plugin UI
figma.showUI(__html__, pluginFrameSize);

// Import the component map
import { componentMap } from "../app/data"; // Adjust the path as necessary

// Function to swap button components
async function swapButtons() {
  // Iterate over each component in the map
  for (const component of componentMap) {
    const { oldParentKey, newVariantKey } = component;

    // Get all nodes on the current page that have the old button's main component key
    const nodes = figma.currentPage.findAll(
      (n) =>
        n.type === "INSTANCE" &&
        (n.mainComponent?.parent as any)?.key === oldParentKey
    );

    let componentCount = 0;

    // Import the new component once
    const newComponent = await figma.importComponentByKeyAsync(newVariantKey);

    // Ensure the new component is imported before proceeding
    if (newComponent) {
      // Iterate through all nodes and swap them with the new component
      for (const node of nodes) {
        if (node.type === "INSTANCE") {
          node.swapComponent(newComponent);
          componentCount++;
        }
      }

      // Notify how many buttons were swapped
      if (componentCount > 0) {
        figma.notify(
          `✨ ${componentCount} ${
            componentCount === 1 ? "component" : "components"
          } swapped`
        );
      } else {
        figma.notify(`No components swapped`);
      }
    } else {
      figma.notify("Failed to import the new component.");
    }
  }
}

// Listen for messages from the UI
figma.ui.onmessage = async (msg) => {
  if (msg.type === "SWAP_BUTTONS") {
    await swapButtons();
  }
};
