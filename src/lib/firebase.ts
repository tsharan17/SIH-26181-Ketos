import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDPv5k2S_VXxWlFI1zd1kl2ZpNtgK80ec0",
  authDomain: "praana-sih.firebaseapp.com",
  projectId: "praana-sih",
  storageBucket: "praana-sih.firebasestorage.app",
  messagingSenderId: "1088423174487",
  appId: "1:1088423174487:web:93fa1db2e79a6bdd391e12"
};

// Initialize Firebase (singleton pattern for Next.js SSR/client)
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { app, db, auth };
