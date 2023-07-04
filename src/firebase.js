// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBzvgqV4Nzfbd2kfbl9uX6om4E1A6GxZ6A",
  authDomain: "library-b89de.firebaseapp.com",
  projectId: "library-b89de",
  storageBucket: "library-b89de.appspot.com",
  messagingSenderId: "364489908354",
  appId: "1:364489908354:web:cb2e08d271ee73f7ef149b",
  measurementId: "G-H2K2YZC876",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// CRUD

// Create data

// Read data

// Update data

// Delete data
