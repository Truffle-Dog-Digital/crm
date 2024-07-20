import { db } from "../helpers/firebaseConfig";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";

export const addHumans = async (userId, humans) => {
  let insertedCount = 0;
  let notInsertedCount = 0;

  try {
    const humansCollection = collection(db, `users/${userId}/humans`);

    for (const human of humans) {
      let q;
      if (human.profile) {
        // Check if a document with the same name and profile already exists
        q = query(
          humansCollection,
          where("name", "==", human.name),
          where("profile", "==", human.profile)
        );
      } else {
        // Check if a document with the same name already exists
        q = query(humansCollection, where("name", "==", human.name));
      }

      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        // Add the document if no match is found
        await addDoc(humansCollection, human);
        insertedCount++;
      } else {
        // Log the record that is not inserted
        notInsertedCount++;
        console.log(
          `Not inserted - Name: ${human.name}, Profile: ${
            human.profile || "N/A"
          }`
        );
      }
    }

    // Log summary
    console.log(`Number of documents inserted: ${insertedCount}`);
    console.log(`Number of documents not inserted: ${notInsertedCount}`);
  } catch (e) {
    console.error("Error adding documents: ", e);
  }
};
