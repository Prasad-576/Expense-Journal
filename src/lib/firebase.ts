// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBkSui6CVD__yRmKvZ1qD4qTesxiumyBLQ",
  authDomain: "expense-journal-fde16.firebaseapp.com",
  projectId: "expense-journal-fde16",
  storageBucket: "expense-journal-fde16.firebasestorage.app",
  messagingSenderId: "242478961947",
  appId: "1:242478961947:web:78a2ab4c32093400e9efbe",
  measurementId: "G-QMP113WVNK"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
export const auth = getAuth(app);
export const db = getFirestore(app);
