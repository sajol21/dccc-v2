import { initializeApp } from "firebase/app";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDOsoF3LXoF6lCPVcQCETyHGuV_B5WNCVg",
  authDomain: "dccc-v2.firebaseapp.com",
  projectId: "dccc-v2",
  storageBucket: "dccc-v2.appspot.com",
  messagingSenderId: "952486297243",
  appId: "1:952486297243:web:dfa6b463c691b6b7d4d03e",
  measurementId: "G-17FD5VS0R4"
};

// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig);

// IMPORTANT: After setting this up, you must go to your Firebase project console,
// navigate to Authentication -> Sign-in method, and enable the "Email/Password" provider.
// You also need to add at least one user in the "Users" tab to be able to log in.
