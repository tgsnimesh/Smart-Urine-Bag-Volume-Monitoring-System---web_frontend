// src/firebase/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyD70hjzKUiXGk7bmKSo-x82-l0TB82JbV4",
  authDomain: "smarturinebagvolumemonitoring.firebaseapp.com",
  databaseURL:
    "https://smarturinebagvolumemonitoring-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "smarturinebagvolumemonitoring",
  storageBucket: "smarturinebagvolumemonitoring.firebasestorage.app",
  messagingSenderId: "137632201825",
  appId: "1:137632201825:web:76eaf4c0f6643c2de27e20",
};

const app = initializeApp(firebaseConfig);

// ✅ Create these instances
const auth = getAuth(app);
const db = getDatabase(app);

// ✅ Export both
export { auth, db };
