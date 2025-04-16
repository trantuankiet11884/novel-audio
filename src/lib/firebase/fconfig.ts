// lib/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
const firebaseConfig = {
  apiKey: "AIzaSyC6T-o-6TOj00IaaBG_cXpR4e1AW6iSP9M",
  authDomain: "novelfullaudio.firebaseapp.com",
  projectId: "novelfullaudio",
  storageBucket: "novelfullaudio.appspot.com",
  messagingSenderId: "141532797780",
  appId: "1:141532797780:web:4d2f1f15c5b1181afb06c1",
  measurementId: "G-SVD5TZFDHM",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { app, auth };
