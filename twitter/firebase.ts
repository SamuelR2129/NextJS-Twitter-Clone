// Import the functions you need from the SDKs you need
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { initializeApp, getApp, getApps } from 'firebase/app';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: 'twitter-7a13e.firebaseapp.com',
  projectId: 'twitter-7a13e',
  storageBucket: 'twitter-7a13e.appspot.com',
  messagingSenderId: '993817629037',
  appId: '1:993817629037:web:ff2432b01db8bc73a3ca64'
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore();
const storage = getStorage();

export { app, db, storage };
