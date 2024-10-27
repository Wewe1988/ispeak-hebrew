// src/firebase/config.ts
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBsTumnz_rZwivMKo5jbvDCkuGIYKYUJpI",
  authDomain: "ispeak-hebrew.firebaseapp.com",
  projectId: "ispeak-hebrew",
  storageBucket: "ispeak-hebrew.appspot.com",
  messagingSenderId: "90290872778",
  appId: "1:90290872778:web:1ce8cbd7127d747ceb6f33",
  measurementId: "G-JL46TTXED7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);