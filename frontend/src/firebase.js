import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAiOBUIWFnQf5Vey2nus_RDJ6ewym9rCoo",
  authDomain: "qflora-17242.firebaseapp.com",
  projectId: "qflora-17242",
  storageBucket: "qflora-17242.firebasestorage.app",
  messagingSenderId: "533251574081",
  appId: "1:533251574081:web:e168b293d4b6e0f01779c0",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider };
