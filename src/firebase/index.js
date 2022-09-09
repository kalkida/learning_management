// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBZt7vD-g1DbhgNQBfzYavUEBlrsUPlMA8",
  authDomain: "laba-school.firebaseapp.com",
  databaseURL:
    "https://laba-school-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "laba-school",
  storageBucket: "laba-school.appspot.com",
  messagingSenderId: "1054893224990",
  appId: "1:1054893224990:web:149021e93d016106636a0f",
  measurementId: "G-EYFSX5NK2V",
};

console.log(firebaseConfig);
// Initialize Firebase
const app = getApps.length > 0 ? getApp() : initializeApp(firebaseConfig);

const firebaseAuth = getAuth(app);
const firestoreDb = getFirestore(app);
const storage = getStorage(app);

// const analytics = getAnalytics(app);

export { app, firebaseAuth, firestoreDb, storage };
