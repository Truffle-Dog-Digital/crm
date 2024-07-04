import { useEffect, useState } from "react";
import { auth, onAuthStateChanged } from "./firebaseConfig";

const useAuthState = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      console.log("Auth state changed, user:", user);
    });

    return () => unsubscribe();
  }, []);

  return user;
};

export default useAuthState;
