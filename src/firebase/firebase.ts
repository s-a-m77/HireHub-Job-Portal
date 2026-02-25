import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, connectAuthEmulator } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'dummy',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'dummy',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'dummy',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'dummy',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || 'dummy',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || 'dummy',
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const firestore = getFirestore(app);

// Use a strict check to ensure emulators NEVER run in production.
// Only allow emulators if the domain is explicitly localhost or 127.0.0.1
const isLocalhost = typeof window !== 'undefined' &&
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

if (import.meta.env.VITE_FIREBASE_EMULATOR_HOST && isLocalhost) {
  // Auth: 19099 (matches firebase.json)
  connectAuthEmulator(auth, "http://localhost:19099");
  // Firestore: 18087 (fixed to match firebase.json)
  connectFirestoreEmulator(firestore, "localhost", 18087);
  console.log('Connected to Firebase Emulators');
}
