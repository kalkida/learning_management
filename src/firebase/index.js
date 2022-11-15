// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// const firebaseConfig = {
//   apiKey: "AIzaSyDdVnPLMVV80t7eo6ov3CbcHy9ZLMsQ16Q",
//   authDomain: "laba-web-321c7.firebaseapp.com",
//   projectId: "laba-web-321c7",
//   storageBucket: "laba-web-321c7.appspot.com",
//   // messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGE_SENDER_ID,
//   // appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
//   // measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
// };
const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
  measurementId: process.env.REACT_APP_MESSUREMETNT_ID,
};

const app = getApps.length > 0 ? getApp() : initializeApp(firebaseConfig);
const firebaseAuth = getAuth(app);
const firestoreDb = getFirestore(app);
const storage = getStorage(app);

// const analytics = getAnalytics(app);

export { app, firebaseAuth, firestoreDb, storage };
