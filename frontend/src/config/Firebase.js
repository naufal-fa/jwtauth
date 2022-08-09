import { initializeApp } from "firebase/app";
import { GoogleAuthProvider } from "firebase/auth";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCLKtPJwxh1HTaW2F4a_80SXAXO7efsito",
    authDomain: "projectauth-ba14d.firebaseapp.com",
    projectId: "projectauth-ba14d",
    storageBucket: "projectauth-ba14d.appspot.com",
    messagingSenderId: "594693942203",
    appId: "1:594693942203:web:5ce38ca503b374f5b0b29e"
  };

  
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  export const googleProvider = new GoogleAuthProvider();