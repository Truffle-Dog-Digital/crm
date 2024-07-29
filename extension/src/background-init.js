import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import firebaseConfig from "./firebaseConfig.js";

const initializeFirebaseApp = () => {
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  console.log("REABILITY: Firebase initialized");
  return { app, auth };
};

export { initializeFirebaseApp };
