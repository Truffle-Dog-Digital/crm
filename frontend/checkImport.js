export const checkImport = async (objects) => {
  if (!objects || objects.length === 0) {
    console.log("No objects detected");
    return { error: "No objects detected" };
  }

  try {
    return {
      totalObjects: objects.length,
    };
  } catch (error) {
    console.error("Error processing objects: ", error);
    return { error: "Error processing objects" };
  }
};
