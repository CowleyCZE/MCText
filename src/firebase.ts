import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDw0_pE3UOhkBAyFVEolRoImwY5BtkmUuo",
  authDomain: "suno2-ca407.firebaseapp.com",
  projectId: "suno2-ca407",
  storageBucket: "suno2-ca407.firebasestorage.app",
  messagingSenderId: "752902349450",
  appId: "1:752902349450:web:360b1c36a986109ea50373",
  measurementId: "G-KKZSQ0NZRR"
};

export const firebaseApp = initializeApp(firebaseConfig);
export const auth = getAuth(firebaseApp);
// Export appId, aby ho mohl použít dbService.ts
export const appId = firebaseConfig.appId;

// Import the functions you need from the SDKs you need
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries



// Initialize Firebase
// const analytics = getAnalytics(firebaseApp);