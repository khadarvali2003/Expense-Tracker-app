import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  projectId: "expense-tracker-app-e4a97",
  appId: "1:945708918818:web:9da1504cbe1d87632e027b",
  storageBucket: "expense-tracker-app-e4a97.firebasestorage.app",
  apiKey: "AIzaSyDwyGXj1c4pxMOn6mThFBp-6VsjkRev5po",
  authDomain: "expense-tracker-app-e4a97.firebaseapp.com",
  messagingSenderId: "945708918818",
  measurementId: "G-PBVCD0FDLB"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
