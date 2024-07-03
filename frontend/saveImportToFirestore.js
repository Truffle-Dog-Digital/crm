import { collection, addDoc } from "firebase/firestore";
import { db } from "./firebaseConfig";

export const saveImportToFirestore = async (
  objects,
  user,
  setLoading,
  setSummary,
  handleCloseMenu
) => {
  if (!objects || objects.length === 0) {
    console.log("No objects detected");
    return;
  }

  setLoading(true);
  console.log("Loading humans ...");

  const humansCollection = collection(db, "users", user.uid, "humans");
  let successfulImports = 0;
  let failedImports = 0;

  try {
    for (const obj of objects) {
      try {
        await addDoc(humansCollection, obj);
        successfulImports++;
      } catch (error) {
        console.error("Error adding document: ", error);
        failedImports++;
      }
    }

    setSummary({
      successful: successfulImports,
      failed: failedImports,
    });
  } catch (error) {
    console.error("Error processing objects: ", error);
  } finally {
    console.log("Setting loading to false and closing menu");
    setLoading(false);
    handleCloseMenu();
  }
};
