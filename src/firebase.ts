// Import the functions you need from the SDKs you need
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
               appId: "1:752902349450:web:4919c7b022a91288a50373",
                 measurementId: "G-3T8VFDNGTG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Pokud potřebujete Analytics, odkomentujte následující řádek:
// const analytics = getAnalytics(app);
export const auth = getAuth(app);
// Export appId, aby ho mohl použít dbService.ts
export const appId = firebaseConfig.appId;

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries