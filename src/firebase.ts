import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore, enableMultiTabIndexedDbPersistence } from "firebase/firestore";

// Zbytek tvého konfiguračního kódu...
// např. const firebaseConfig = { ... };

// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
// const auth = getAuth(app);
// const firestore = getFirestore(app);

// enableMultiTabIndexedDbPersistence(firestore).catch((err) => {
//   if (err.code == 'failed-precondition') {
//     // ...
//   } else if (err.code == 'unimplemented') {
//     // ...
//   }
// });

// export { auth, firestore, analytics };