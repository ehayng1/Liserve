import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
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
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../firebase";
import { getUserId } from "../utils/Firebase";
import { useContext } from "react";
import { UserContext } from "../Context/UserContext";
import * as React from "react";

import MuiAlert from "@mui/material/Alert";

export default function RectangleSeat({
  startSeat,
  endSeat,
  direction = "vertical",
}) {
  const [ID, setID] = useState("");
  const [open, setOpen] = React.useState(false);
  const { id, userName } = useContext(UserContext);
  const totalSeats = endSeat - startSeat;
  const [seats, setSeats] = useState([
    { isReserved: false, seatNumber: 1, reservedBy: "" },
  ]);
  const [reserved, setReserved] = useState(0);
  const [available, setAvailable] = useState(75);

  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  // gets user ID
  useEffect(() => {
    async function init() {
      const tempId = await getUserId();
      setID(tempId);
      // console.log(tempId);
    }
    init();
  }, []);

  // get seat data
  useEffect(() => {
    async function getSeatData() {
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
        // setReserved(reservedCount);
        setSeats(tempSeats);
      });
    }
    getSeatData();
  }, []);

  // gets reserved count
  useEffect(() => {
    async function getSeatData() {
      const q = query(
        collection(db, "seats"),
        // limit(40),
        limit(totalSeats),
        orderBy("seatNumber")
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
        // setReserved(reservedCount);
        setSeats(tempSeats);
      });
    }
    getSeatData();
  }, []);

  function validateReserveTime() {
    var currentDate = new Date();
    var currentHour = currentDate.getHours();
    var currentMinute = currentDate.getMinutes();

    // Define the time ranges
    var timeRanges = [
      {
        start: { hour: 8, minute: 10 },
        end: { hour: 8, minute: 40 },
      },
      {
        start: { hour: 11, minute: 5 },
        end: { hour: 18, minute: 30 },
      },
    ];

    // Convert current time to minutes for easier comparison
    var currentTotalMinutes = currentHour * 60 + currentMinute;

    let BreakStartTotalMinutes =
      timeRanges[0].start.hour * 60 + timeRanges[0].start.minute;
    let BreakEndTotalMinutes =
      timeRanges[0].end.hour * 60 + timeRanges[0].end.minute;
    let LunchStartTotalMinutes =
      timeRanges[1].start.hour * 60 + timeRanges[1].start.minute;
    let LunchEndTotalMinutes =
      timeRanges[1].end.hour * 60 + timeRanges[1].end.minute;

    // Check if the current time falls within any of the specified ranges
    if (
      currentTotalMinutes >= BreakStartTotalMinutes &&
      currentTotalMinutes <= BreakEndTotalMinutes
    ) {
      return "Break";
    } else if (
      currentTotalMinutes >= LunchStartTotalMinutes &&
      currentTotalMinutes <= LunchEndTotalMinutes
    ) {
      return "Lunch";
    } else {
      return false;
    }
    // for (var i = 0; i < timeRanges.length; i++) {
    //   var startTotalMinutes =
    //     timeRanges[i].start.hour * 60 + timeRanges[i].start.minute;
    //   var endTotalMinutes =
    //     timeRanges[i].end.hour * 60 + timeRanges[i].end.minute;

    //   if (
    //     currentTotalMinutes >= startTotalMinutes &&
    //     currentTotalMinutes <= endTotalMinutes
    //   ) {
    //     return true;
    //   }
    // }
    return false;
  }

  async function handleClick(e) {
    const docRef = doc(db, "seats", e.target.innerText);
    const userRef = doc(db, "users", ID);
    const seatNumber = e.target.innerText;
    const docSnap = await getDoc(docRef);
    const userSnap = await getDoc(userRef);
    const seatReserved = userSnap.data().seatReserved;
    const reserveCount = userSnap.data().reserveCount; // weekly reserveCount
    let isReserveTime = validateReserveTime();
    if (isReserveTime !== false) {
      if (docSnap.exists()) {
        let data = docSnap.data();

        // not reserved => reservation weekly limit is set to 2.
        if (!data.isReserved && reserveCount < 2 && seatReserved === "") {
          // show dialog button here

          await reserve(docRef, seatNumber);

          return;
        } else {
          // if I have reserved the seat=> cancelation
          if (data.reservedBy === ID) {
            await cancelReservation(docRef, seatNumber);
            return;
          }
          // UNCOMMENT THESE AFTER TESTING
          // user trying to reserve more than one seat
          else if (seatReserved !== "") {
            alert("You can only reserve one seat at a time!");
            return;
          }
          // user trying to reserve more two seats per week
          else if (reserveCount >= 2) {
            alert("You cannot reserve more than twice per week!");
            return;
          }
          // someoneelse reserved the seat
          else if (data.reservedBy !== ID) {
            alert("This seat is already reserved!");
            return;
          }
        }
      }
    } else {
      setOpen(true);
      // alert(
      //   "It is not reservation time! Reservation times are 8:10 ~ 8:40 and 11:05 ~ 11:30"
      // );
    }
  }

  async function reserve(docRef, seatNumber) {
    alert("Seat reserved succesfully!");
    const updatedSeat = [...seats];
    updatedSeat[seatNumber - 1].isReserved = true;
    updatedSeat[seatNumber - 1].reservedBy = ID;
    setSeats(updatedSeat);
    setReserved(reserved + 1);
    setAvailable(available - 1);
    await updateDoc(docRef, {
      isReserved: true,
      reservedBy: ID,
      reserveCount: increment(1),
    });
    await updateDoc(doc(db, "users", ID), {
      seatReserved: seatNumber,
    });
  }
  async function cancelReservation(docRef, seatNumber) {
    alert("Seat canceled succesfully!");
    const updatedSeat = [...seats];
    updatedSeat[seatNumber - 1].isReserved = false;
    updatedSeat[seatNumber - 1].reservedBy = "";
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
  }

  const Seat = styled(Button)(({ theme }) => ({
    // width: "10%",
    // height: "20%",
    maxWidth: "3rem",
    maxHeight: "3rem",
    marginBottom: "1vh",
    borderRadius: "1rem",
    // marginRight: "2rem",
    fontSize: "1.5rem",
  }));

  return (
    <div
      style={{
        // width: "10vw",
        width: direction === "vertical" ? "10vw" : "40vw",
        height: direction === "vertical" ? "40vh" : "10vh",
        // height: direction === "vertical" && "10vh",
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "center",
        columnGap: "1vw",
      }}
    >
      {seats.map((el, index) => (
        <Seat
          key={index}
          onClick={handleClick}
          variant={el.isReserved ? "contained" : "outlined"}
          color={el.reservedBy === ID ? "success" : undefined}
        >
          {el.seatNumber}
        </Seat>
      ))}
    </div>
  );
}
