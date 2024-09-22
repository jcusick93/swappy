// Clear console on reload
console.clear();

// Default plugin size
const pluginFrameSize = {
  width: 340,
  height: 370,
};

// Show plugin UI
figma.showUI(__html__, pluginFrameSize);

// Define button keys
const oldButtonKey = "b784c17874968125c12e69e55d88af8ac6041eab";
const newButtonKey = "53b2474ef9618f2f5632964b276d160d81c70b4a";

// Function to swap button components
async function swapButtons() {
  // Get all nodes on the current page that have the old button's main component key
  const nodes = figma.currentPage.findAll(
    (n) => n.type === "INSTANCE" && n.mainComponent?.key === oldButtonKey
  );

  let buttonCount = 0;

  // Import the new component once
  const newComponent = await figma.importComponentByKeyAsync(newButtonKey);

  // Ensure the new component is imported before proceeding
  if (newComponent) {
    // Iterate through all nodes and swap them with the new component
    for (const node of nodes) {
      if (node.type === "INSTANCE") {
        node.swapComponent(newComponent);
        buttonCount++;
      }
    }

    // Notify how many buttons were swapped
    figma.notify(`Total buttons swapped: ${buttonCount}`);
  } else {
    figma.notify("Failed to import the new component.");
  }
}

// Listen for messages from the UI
figma.ui.onmessage = async (msg) => {
  if (msg.type === "SWAP_BUTTONS") {
    await swapButtons();
  }
};
