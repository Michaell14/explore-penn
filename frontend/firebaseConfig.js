// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, initializeAuth, getReactNativePersistence } from "firebase/auth";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

export {auth, app};