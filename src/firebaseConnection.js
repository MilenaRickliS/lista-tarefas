// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getFirestore} from "firebase/firestore";
import {getAuth} from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBAJYoz-3VnlZsLSKhk3IYcnknXs3k3J_s",
  authDomain: "exemplo1-45bc6.firebaseapp.com",
  databaseURL: "https://exemplo1-45bc6-default-rtdb.firebaseio.com",
  projectId: "exemplo1-45bc6",
  storageBucket: "exemplo1-45bc6.appspot.com",
  messagingSenderId: "1027722670631",
  appId: "1:1027722670631:web:2d1c5360ecc53f0253d402",
  measurementId: "G-S4YS60ZJ0T"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);

export {db, auth};