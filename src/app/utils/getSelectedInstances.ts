// Function to get all instances from selected nodes that are old components
export async function getSelectedInstances(selection, componentMap) {
  const instances = [];

  const findInstancesInChildren = async (node) => {
    if (node.type === "INSTANCE") {
      const mainComponent = await node.getMainComponentAsync();
      if (!mainComponent) return;

      // Check if the component or its parent matches any oldParentKey
      const isOld = componentMap.some(component => 
        mainComponent.key === component.oldParentKey ||
        (mainComponent.parent?.type === "COMPONENT" && mainComponent.parent.key === component.oldParentKey) ||
        (mainComponent.parent?.type === "COMPONENT_SET" && mainComponent.parent.key === component.oldParentKey)
      );

      if (isOld) {
        instances.push(node);
        console.log("Found old instance:", node);
      }
    }

    // Recursively check for instances in the node's children
    if (node.children) {
      for (const child of node.children) {
        await findInstancesInChildren(child);
      }
    }
  };

  // Iterate over each selected node and find instances
  for (const node of selection) {
    console.log("Checking node:", node);
    await findInstancesInChildren(node);
  }

  console.log("All found instances:", instances);
  return instances;
}
