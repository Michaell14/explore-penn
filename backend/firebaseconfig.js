// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBLpn8HTkH7RotBNE_x6bwAkYIHZfu1nl0",
  authDomain: "explore-penn.firebaseapp.com",
  projectId: "explore-penn",
  storageBucket: "explore-penn.appspot.com",
  messagingSenderId: "149303467317",
  appId: "1:149303467317:web:aa01611ea7d7d3f59a007c",
  measurementId: "G-L7L1PK3RJZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export { app, analytics };