
// Firebase SDK modules ઈમ્પોર્ટ કરવા
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc, collection, addDoc, updateDoc, getDocs, onSnapshot, query, where, deleteDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// તમારું Firebase કન્ફિગરેશન
const firebaseConfig = {
  apiKey: "AIzaSyCFynb1aeBWmxwRNXhmp9Kp5w7FYTe9Zq8",
  authDomain: "courier-e27da.firebaseapp.com",
  projectId: "courier-e27da",
  storageBucket: "courier-e27da.firebasestorage.app",
  messagingSenderId: "52895306439",
  appId: "1:52895306439:web:9b13502dc726399c69e4e2",
  measurementId: "G-7KRQEQ9TC0"
};

// Firebase Initialize કરવું
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// બધી વસ્તુઓ એક્સપોર્ટ કરવી (અહીં છેલ્લે deleteDoc ઉમેર્યું છે)
export { auth, db, signInWithEmailAndPassword, signOut, onAuthStateChanged, doc, setDoc, getDoc, collection, addDoc, updateDoc, getDocs, onSnapshot, query, where, deleteDoc };