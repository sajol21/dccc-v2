import { initializeApp } from "firebase/app";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDOsoF3LXoF6lCPVcQCETyHGuV_B5WNCVg",
  authDomain: "dccc-v2.firebaseapp.com",
  projectId: "dccc-v2",
  storageBucket: "dccc-v2.firebasestorage.app",
  messagingSenderId: "952486297243",
  appId: "1:952486297243:web:dfa6b463c691b6b7d4d03e",
  measurementId: "G-17FD5VS0R4"
};

// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig);