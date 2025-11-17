import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCwNzX0RZZ8oQ0tvNRkDOFjRh_seix7JtI",
  authDomain: "ufabc-academic-planner.firebaseapp.com",
  projectId: "ufabc-academic-planner",
  storageBucket: "ufabc-academic-planner.firebasestorage.app",
  messagingSenderId: "700910138780",
  appId: "1:700910138780:web:8b84760069232b8c6b0459",
  measurementId: "G-7JFDS50KY2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

const googleProvider = new GoogleAuthProvider();

export { app, analytics, auth, db, googleProvider };