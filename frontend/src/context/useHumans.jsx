import { useState, useEffect } from "react";
import { getFirestore, collection, onSnapshot } from "firebase/firestore";
import { useAuth } from "./AuthContext";

const useHumans = () => {
  const { user } = useAuth();
  const [humans, setHumans] = useState([]);
  const db = getFirestore();

  useEffect(() => {
    if (user) {
      const humansCollection = collection(db, `users/${user.uid}/humans`);
      const unsubscribe = onSnapshot(humansCollection, (snapshot) => {
        const humansList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setHumans(humansList);
      });

      return () => unsubscribe();
    }
  }, [user, db]);

  return humans;
};

export default useHumans;
