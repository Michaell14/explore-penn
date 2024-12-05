// firebaseConfig.ts
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';  
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyDVcPQ18HbuIL6zFc7EMHVSWOwbHHU5U2E",
  authDomain: "explore-penn-f67e6.firebaseapp.com",
  projectId: "explore-penn-f67e6",
  storageBucket: "explore-penn-f67e6.firebasestorage.app",
  messagingSenderId: "414478752713",
  appId: "1:414478752713:web:3a97d56840222b61efa618",
  measurementId: "G-DSJY5NEQ36"
};

// Initialize Firebase
export const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const db = getFirestore(app);

export const storage = getStorage(app);
console.log("storage logged from firebaseconfig", storage);
// Initialize Firebase Authentication with AsyncStorage persistence
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
