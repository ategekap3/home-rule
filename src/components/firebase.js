// src/components/firebase.js

// Import Firebase modules
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB7PMGyiHPu4g3TN4RpaoW9tvhBMPSelOI",
  authDomain: "mcwug-c060a.firebaseapp.com",
  projectId: "mcwug-c060a",
  storageBucket: "mcwug-c060a.appspot.com",
  messagingSenderId: "166616855811",
  appId: "1:166616855811:web:01072879268c874dc9a536",
  measurementId: "G-ZHD6ECPY8B"
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Analytics (optional)
const analytics = getAnalytics(app);

// Initialize Firestore Database
const db = getFirestore(app);

// Initialize Firebase Auth
const auth = getAuth(app);

// Export initialized services and Auth helpers for phone OTP
export { db, auth, analytics, RecaptchaVerifier, signInWithPhoneNumber };
