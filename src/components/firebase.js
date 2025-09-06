// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB7PMGyiHPu4g3TN4RpaoW9tvhBMPSelOI",
  authDomain: "mcwug-c060a.firebaseapp.com",
  projectId: "mcwug-c060a",
  storageBucket: "mcwug-c060a.appspot.com",
  messagingSenderId: "166616855811",
  appId: "1:166616855811:web:01072879268c874dc9a536",
  measurementId: "G-ZHD6ECPY8B"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app); // ✅

export { db, auth };
