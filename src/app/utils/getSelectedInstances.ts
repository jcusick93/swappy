// Function to get all instances from selected nodes that are old components
export function getSelectedInstances(selection, componentMap) {
  const instances = [];

  const findInstancesInChildren = (node) => {
    // Check if the current node is an instance and is an old component
    if (node.type === "INSTANCE" && isOldComponent(node, componentMap)) {
      instances.push(node); // Add the instance itself
      console.log("Found old instance:", node); // Log the found instance
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

// Helper function to determine if a component is old
function isOldComponent(instance, componentMap) {
  // Check if the instance's main component is in the componentMap
  return componentMap.some((component) => {
    return (
      instance.mainComponent &&
      (instance.mainComponent.parent?.key === component.oldParentKey ||
        instance.mainComponent.key === component.oldParentKey) // Check both conditions
    );
  });
}
