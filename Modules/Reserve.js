import { useEffect, useState } from "react";
import { db } from "../firebase";
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
import { updateReservationData } from "./Data";

export async function reserve(docRef, seatNumber) {
  alert("Seat reserved succesfully!");

  const updatedSeat = [...seats];
  updatedSeat[seatNumber - startSeat].isReserved = true;
  updatedSeat[seatNumber - startSeat].reservedBy = userName;

  await updateDoc(docRef, {
    isReserved: true,
    reservedBy: userName,
    reserveCount: increment(1),
  });
  await updateDoc(doc(db, "users", ID), {
    seatReserved: seatNumber,
  });
  let timePeriod = validateReserveTime();
  let dataRef = doc(db, "dailyData", new Date().toDateString());
  await setDoc(
    dataRef,
    timePeriod === "Break"
      ? {
          reserveCount: increment(1),
          breakCount: increment(1),
          timeStamp: serverTimestamp(),
        }
      : {
          reserveCount: increment(1),
          lunchCount: increment(1),
          timeStamp: serverTimestamp(),
        },
    { merge: true }
  );
  updateReservationData();

  return {
    updateSeat: updatedSeat,
    reserved: reserved + 1,
    available: available + 1,
  };
}

export async function cancelReservation(docRef, seatNumber) {
  alert("Seat canceled succesfully!");
  const updatedSeat = [...seats];
  updatedSeat[seatNumber - startSeat].isReserved = false;
  updatedSeat[seatNumber - startSeat].reservedBy = "";
  setSeats(updatedSeat);
  setReserved(reserved - 1);
  setAvailable(available + 1);
  await updateDoc(docRef, {
    isReserved: false,
    reservedBy: "",
    reserveCount: increment(-1),
  });
  await updateDoc(doc(db, "users", ID), {
    seatReserved: "",
    reserveCount: increment(-1),
  });
  let timePeriod = validateReserveTime();
  let dataRef = doc(db, "dailyData", new Date().toDateString());
  await setDoc(
    dataRef,
    timePeriod === "Break"
      ? {
          reserveCount: increment(-1),
          cancelCount: increment(1),
          breakCount: increment(-1),
        }
      : {
          reserveCount: increment(-1),
          cancelCount: increment(1),
          lunchCount: increment(-1),
        },
    { merge: true }
  );
}
