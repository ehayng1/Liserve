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

export async function updateReservationData() {
  const dataRef = doc(db, "data", "reservationStat");

  let dateArr = ["monCount", "tueCount", "wedCount", "thuCount", "friCount"];
  let dateKey = dateArr[new Date().getDay() - 1];
  let sexKey = sex === "M" ? "maleCount" : "femaleCount";
  let gradeArr = ["gradeTenCount", "gradeElevenCount", "gradeTwelveCount"];
  let gradeKey = gradeArr[grade - 10];

  await updateDoc(dataRef, {
    [dateKey]: increment(1),
    [sexKey]: increment(1),
    [gradeKey]: increment(1),
  });
}

export async function getSeatData() {
  const q = query(
    collection(db, "seats"),
    // limit(40),
    limit(totalSeats),
    orderBy("seatNumber"),
    where("seatNumber", ">=", startSeat),
    where("seatNumber", "<=", endSeat)
  );
  let reservedCount = 0;
  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    let tempSeats = [];
    querySnapshot.forEach((doc) => {
      tempSeats.push(doc.data());
      if (doc.data().isReserved) {
        reservedCount++;
      }
    });
    // setSeats(tempSeats);
    // setIsLoading(false);
    // console.log(startSeat + "~" + endSeat + ": ", tempSeats);
  });
}
