import { firestore, auth } from './firebase';

// Consider Firebase enabled if either a real API key is present or
// dev emulator host is configured (so local emulator writes work).
const EMU_HOST = import.meta.env.VITE_FIREBASE_EMULATOR_HOST;
export const FIREBASE_ENABLED = Boolean(import.meta.env.VITE_FIREBASE_API_KEY || EMU_HOST);

// Export Firestore instance under the name `firestore` to match existing imports
export const db = firestore;

export { auth, firestore };
