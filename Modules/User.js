import { useEffect, useState } from "react";
import {
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  increment,
  query,
  collection,
  where,
  limit,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";

export async function getUserData() {
  let tempId = await getUserId();

  const docRef = doc(db, "users", tempId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    let data = docSnap.data();
    return data;
  } else {
    console.log("No such document!");
  }
}
