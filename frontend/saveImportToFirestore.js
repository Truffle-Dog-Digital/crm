import { collection, addDoc } from "firebase/firestore";
import { db } from "./firebaseConfig";

export const saveImportToFirestore = async (
  file,
  user,
  setLoading,
  setSummary,
  handleCloseMenu
) => {
  if (!file) {
    console.log("No file detected");
    return;
  }

  setLoading(true);
  console.log("Loading humans ..");

  const humansCollection = collection(db, "users", user.uid, "humans");
  let successfulImports = 0;
  let failedImports = 0;

  try {
    const text = await file.text();
    const rows = text.split("\n").filter((row) => row.trim() !== "");

    for (const row of rows) {
      try {
        const jsonData = JSON.parse(row);
        await addDoc(humansCollection, jsonData);
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
    console.error("Error reading file: ", error);
  } finally {
    console.log("Setting loading to false and closing menu");
    setLoading(false);
    handleCloseMenu();
  }
};
