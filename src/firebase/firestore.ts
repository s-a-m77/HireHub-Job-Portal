import { firestore } from "./firebase";
import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

// ---- GENERIC ----
export const getAll = (collectionName: string) =>
  getDocs(collection(firestore, collectionName));

export const getOne = (collectionName: string, id: string) =>
  getDoc(doc(firestore, collectionName, id));

export const createOne = (collectionName: string, data: any) =>
  addDoc(collection(firestore, collectionName), data);

export const updateOne = (collectionName: string, id: string, data: any) =>
  updateDoc(doc(firestore, collectionName, id), data);

export const deleteOne = (collectionName: string, id: string) =>
  deleteDoc(doc(firestore, collectionName, id));
