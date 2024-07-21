import { db } from "../helpers/firebaseConfig";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";

export const addHumans = async (userId, humans) => {
  let insertedCount = 0;
  let notInsertedCount = 0;

  try {
    const humansCollection = collection(db, `users/${userId}/humans`);

    // Query all humans at the start
    const allHumansSnapshot = await getDocs(humansCollection);
    const nameSet = new Set();
    const profileSet = new Set();

    // Populate sets with existing names and profiles
    allHumansSnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.name) {
        nameSet.add(data.name);
      }
      if (data.profile) {
        profileSet.add(data.profile);
      }
    });

    for (const human of humans) {
      if (human.profile) {
        // Check existence based on profile only
        if (profileSet.has(human.profile)) {
          notInsertedCount++;
          console.log(
            `Not inserted (profile) - Name: ${human.name}, Profile: ${human.profile}`
          );
        } else {
          // Add the document if no match is found
          await addDoc(humansCollection, human);
          insertedCount++;
          // Update sets with the new values
          if (human.profile) {
            profileSet.add(human.profile);
          }
        }
      } else {
        // Check existence based on name only
        if (nameSet.has(human.name)) {
          notInsertedCount++;
          console.log(
            `Not inserted (name) - Name: ${human.name}, Profile: ${
              human.profile || "N/A"
            }`
          );
        } else {
          // Add the document if no match is found
          await addDoc(humansCollection, human);
          insertedCount++;
          // Update sets with the new values
          if (human.name) {
            nameSet.add(human.name);
          }
        }
      }
    }

    // Log summary
    console.log(`Number of documents inserted: ${insertedCount}`);
    console.log(`Number of documents not inserted: ${notInsertedCount}`);
  } catch (e) {
    console.error("Error adding documents: ", e);
  }
};
