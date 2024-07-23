import { useState, useEffect } from "react";
import { getFirestore, collection, onSnapshot } from "firebase/firestore";
import { useAuth } from "./AuthContext";

const useBacklogs = () => {
  const { user } = useAuth();
  const [backlogs, setBacklogs] = useState([]);
  const db = getFirestore();

  useEffect(() => {
    if (user) {
      const backlogsCollection = collection(db, `users/${user.uid}/backlogs`);
      const unsubscribe = onSnapshot(backlogsCollection, (snapshot) => {
        const backlogsList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setBacklogs(backlogsList);
      });

      return () => unsubscribe();
    }
  }, [user, db]);

  return backlogs;
};

export default useBacklogs;
