// firebaseConfig.ts
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyDVcPQ18HbuIL6zFc7EMHVSWOwbHHU5U2E",
  authDomain: "explore-penn-f67e6.firebaseapp.com",
  projectId: "explore-penn-f67e6",
  storageBucket: "explore-penn-f67e6.appspot.com",
  messagingSenderId: "414478752713",
  appId: "1:414478752713:web:3a97d56840222b61efa618",
  measurementId: "G-DSJY5NEQ36"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

// Initialize Firebase Authentication with AsyncStorage persistence
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
