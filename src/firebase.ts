import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Zde vložte svůj skutečný Firebase config
const firebaseConfig = {
  // apiKey: "...",
  // authDomain: "...",
  // projectId: "...",
  // storageBucket: "...",
  // messagingSenderId: "...",
  // appId: "...",
  // measurementId: "..."
};

export const firebaseApp = initializeApp(firebaseConfig);
export const auth = getAuth(firebaseApp);