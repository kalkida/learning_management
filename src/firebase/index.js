// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDdVnPLMVV80t7eo6ov3CbcHy9ZLMsQ16Q",
  authDomain: "laba-web-321c7.firebaseapp.com",
  projectId: "laba-web-321c7",
  storageBucket: "laba-web-321c7.appspot.com",
  // messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGE_SENDER_ID,
  // appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  // measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};
// const firebaseConfig = {
//   apiKey: "AIzaSyBZt7vD-g1DbhgNQBfzYavUEBlrsUPlMA8",
//   authDomain: "laba-school.firebaseapp.com",
//   databaseURL:
//     "https://laba-school-default-rtdb.europe-west1.firebasedatabase.app",
//   projectId: "laba-school",
//   storageBucket: "laba-school.appspot.com",
//   messagingSenderId: "1054893224990",
//   appId: "1:1054893224990:web:149021e93d016106636a0f",
//   measurementId: "G-EYFSX5NK2V",
// };

const app = getApps.length > 0 ? getApp() : initializeApp(firebaseConfig);
const firebaseAuth = getAuth(app);
const firestoreDb = getFirestore(app);
const storage = getStorage(app);

// const analytics = getAnalytics(app);

export { app, firebaseAuth, firestoreDb, storage };
