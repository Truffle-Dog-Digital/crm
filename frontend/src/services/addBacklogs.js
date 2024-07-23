import { db } from "../helpers/firebaseConfig";
import { collection, addDoc, getDocs } from "firebase/firestore";

export const addBacklogs = async (userId, backlogs) => {
  let insertedCount = 0;
  let notInsertedCount = 0;

  try {
    const backlogsCollection = collection(db, `users/${userId}/backlogs`);

    // Query all backlogs at the start
    const allBacklogsSnapshot = await getDocs(backlogsCollection);
    const profileSet = new Set();

    // Populate set with existing profiles
    allBacklogsSnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.profile) {
        profileSet.add(data.profile);
      }
    });

    for (const backlog of backlogs) {
      if (profileSet.has(backlog.profile)) {
        notInsertedCount++;
        console.log(`Not inserted - Profile: ${backlog.profile}`);
      } else {
        // Add the document if no match is found
        await addDoc(backlogsCollection, backlog);
        insertedCount++;
        // Update set with the new value
        profileSet.add(backlog.profile);
      }
    }

    // Log summary
    console.log(`Number of documents inserted: ${insertedCount}`);
    console.log(`Number of documents not inserted: ${notInsertedCount}`);
  } catch (e) {
    console.error("Error adding documents: ", e);
  }
};
