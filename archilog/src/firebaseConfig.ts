import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyBqZhTzb2JZVJ98enUP00r-rDiUJDmxWcI",
  authDomain: "archilog-7b615.firebaseapp.com",
  projectId: "archilog-7b615",
  storageBucket: "archilog-7b615.appspot.com",
  messagingSenderId: "466013229154",
  appId: "1:466013229154:web:b620d0ca6e2f233979813b",
  measurementId: "G-E7W8H7CLWZ",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
