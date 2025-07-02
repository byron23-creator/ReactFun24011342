import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCY0UwaLSFQul5BvhxA2XC88WhnahI6Z3g",
  authDomain: "reactfundaments.firebaseapp.com",
  projectId: "reactfundaments",
  storageBucket: "reactfundaments.firebasestorage.app",
  messagingSenderId: "102764709212",
  appId: "1:102764709212:web:fbc0bde614806ff00ded99",
  measurementId: "G-8VBM684055"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };