import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDf2p5FfEqYxeIclZdHtsIWo_y8bpTQOuk",
  authDomain: "agent-ai-pilot-91d9a.firebaseapp.com",
  projectId: "agent-ai-pilot-91d9a",
  storageBucket: "agent-ai-pilot-91d9a.firebasestorage.app",
  messagingSenderId: "466723938461",
  appId: "1:466723938461:web:d9d6e4c1150648d6873474",
  measurementId: "G-NC4J3PHM3T"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
