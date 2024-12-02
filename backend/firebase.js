import { initializeApp } from "firebase-admin";
import { getFirestore } from "firebase-admin/firestore";
import admin from "./firebaseadmin";

const firebaseConfig = {
  apiKey: "AIzaSyDVcPQ18HbuIL6zFc7EMHVSWOwbHHU5U2E",
  authDomain: "explore-penn-f67e6.firebaseapp.com",
  projectId: "explore-penn-f67e6",
  storageBucket: "explore-penn-f67e6.appspot.com",
  messagingSenderId: "414478752713",
  appId: "1:414478752713:web:3a97d56840222b61efa618",
  measurementId: "G-DSJY5NEQ36"
};

// Initialize Firebase and Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default { db, admin };
