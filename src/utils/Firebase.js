import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  doc,
  getDoc,
  setDoc,
  collection,
  query,
  updateDoc,
  getDocs,
  where,
} from "firebase/firestore";

import { db } from "../firebase";

const auth = getAuth();

export const getUserId = async function uploadBeforePromise() {
  return new Promise(function(resolve, reject) {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        resolve(user.uid);
      } else {
      }
    });
  });
};

// upload 100 seats
// use this once for uploading seats
export async function uploadSeats() {
  const DocRef = collection(db, "seats");
  for (let i = 100; i < 110; i++) {
    // console.log(i);
    // console.log(typeof parseInt(i));
    await setDoc(doc(DocRef, String(i)), {
      isReserved: false,
      reservedBy: "",
      waitlist: [],
      seatNumber: i,
      reserveCount: 0,
    });
  }
}

export async function unreserveAllSeats() {
  const q = query(collection(db, "seats"), where("isReserved", "==", true));

  const querySnapshot = await getDocs(q);
  querySnapshot.forEach(async (doc) => {
    await updateDoc(doc, {
      isReserved: false,
      reservedBy: "",
    });
  });
}
