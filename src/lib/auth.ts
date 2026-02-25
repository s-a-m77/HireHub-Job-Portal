import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { auth, googleProvider } from "@/firebase/firebase";

export const emailSignUp = (email: string, password: string) =>
  createUserWithEmailAndPassword(auth, email, password);

export const emailSignIn = (email: string, password: string) =>
  signInWithEmailAndPassword(auth, email, password);

export const googleSignIn = () => signInWithPopup(auth, googleProvider);

export const logout = () => signOut(auth);
