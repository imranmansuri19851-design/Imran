import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase App
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Firebase Auth
export const auth = getAuth(app);

// Firestore instance using specified database ID
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId || '(default)');
