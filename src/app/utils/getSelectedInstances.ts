// Function to get all instances from selected nodes
export function getSelectedInstances(selection) {
  const instances = [];

  const findInstancesInChildren = (node) => {
    // Check if the current node is an instance
    if (node.type === "INSTANCE") {
      instances.push(node); // Add the instance itself
      console.log("Found instance:", node); // Log the found instance
    }

    // Recursively check for instances in the node's children
    if (node.children) {
      node.children.forEach((child) => {
        findInstancesInChildren(child); // Recursively call for each child
      });
    }
  };

  // Iterate over each selected node and find instances
  selection.forEach((node) => {
    console.log("Checking node:", node); // Log the current node being checked
    findInstancesInChildren(node); // Start the recursive search
  });

  console.log("All found instances:", instances); // Log all found instances
  return instances;
}
