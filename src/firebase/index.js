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

console.log(firebaseConfig);
// Initialize Firebase
const app = getApps.length > 0 ? getApp() : initializeApp(firebaseConfig);

const firebaseAuth = getAuth(app);
const firestoreDb = getFirestore(app);
const storage = getStorage(app);

// const analytics = getAnalytics(app);

export { app, firebaseAuth, firestoreDb, storage };
