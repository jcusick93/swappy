// Function to get the image URL for a node
export async function getImageURL(node: SceneNode): Promise<string> {
  try {
    const image = await node.exportAsync({
      format: "PNG",
      constraint: { type: "SCALE", value: 2 },
    });
    const base64 = figma.base64Encode(image);
    return `data:image/png;base64,${base64}`;
  } catch (error) {
    console.error("Error exporting image:", error);
    return "";
  }
}
