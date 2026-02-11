import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAZnvbEptSJoe6KVYsBUMv9t9ZvwtJorwQ",
  authDomain: "todo-ap-a5b25.firebaseapp.com",
  projectId: "todo-ap-a5b25",
  storageBucket: "todo-ap-a5b25.firebasestorage.app",
  messagingSenderId: "1019901906478",
  appId: "1:1019901906478:web:7560dbc8039397d5f8d9bf",
  measurementId: "G-WTHWS4RKF1",
};

// Initialize Firebase
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
