import { initializeApp } from "firebase/app";
import { getAuth, signInWithCustomToken } from "firebase/auth";
import firebaseConfig from "./firebaseConfig.js";

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize Firebase auth
const auth = getAuth(app);

const getCookie = (domain, name) => {
  return new Promise((resolve, reject) => {
    chrome.cookies.get({ url: domain, name: name }, (cookie) => {
      if (cookie) {
        resolve(cookie.value);
      } else {
        reject(`No cookie found with name ${name}`);
      }
    });
  });
};

const validateToken = async () => {
  try {
    const idToken = await getCookie(
      `https://${firebaseConfig.authDomain}`,
      "idToken"
    );

    if (idToken) {
      // Sign in with custom token
      await signInWithCustomToken(auth, idToken);
      console.log("Token validated and user signed in");
    } else {
      console.error("No ID token found in cookies");
    }
  } catch (error) {
    console.error("Token validation failed", error);
  }
};

export { validateToken };
