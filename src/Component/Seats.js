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

export function SixSeats({
  startSeat,
  endSeat,
  direction = "vertical",
  marginRight = "1vw",
  columnGap = "1vw",
}) {
  const [ID, setID] = useState("");
  const [grade, setGrade] = useState();
  const [sex, setSex] = useState("");
  const [open, setOpen] = React.useState(false);
  const { id, userName } = useContext(UserContext);
  const totalSeats = endSeat - startSeat;
  const [seats, setSeats] = useState([
    // { isReserved: false, seatNumber: 1, reservedBy: "" },
  ]);
  const [reserved, setReserved] = useState(0);
  const [available, setAvailable] = useState(75);

  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  // gets user ID and user data
  useEffect(() => {
    let tempId;
    let tempSex;
    let tempGrade;
    async function getUserData() {
      tempId = await getUserId();
      // console.log(tempId);

      const docRef = doc(db, "users", tempId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        let data = docSnap.data();
        tempGrade = data.grade;
        tempSex = data.sex;
      } else {
        // docSnap.data() will be undefined in this case
        console.log("No such document!");
      }
      setSex(tempSex);
      setGrade(tempGrade);
      setID(tempId);
    }
    getUserData();
  }, []);

  // get seat data
  useEffect(() => {
    // console.log(startSeat + "~" + endSeat + ": ");
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
        setSeats(tempSeats);
        // console.log(startSeat + "~" + endSeat + ": ", tempSeats);
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
        start: { hour: 9, minute: 5 },
        end: { hour: 18, minute: 59 },
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
    // console.log("seat: ", seatNumber);
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
      // this part does not work
      setOpen(true);
      // alert(
      //   "It is not reservation time! Reservation times are 8:10 ~ 8:40 and 11:05 ~ 11:30"
      // );
    }
  }

  async function reserve(docRef, seatNumber) {
    alert("Seat reserved succesfully!");
    const updatedSeat = [...seats];
    updatedSeat[seatNumber - startSeat].isReserved = true;
    updatedSeat[seatNumber - startSeat].reservedBy = ID;
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
    updateRservationData();
  }

  async function updateRservationData() {
    const dataRef = doc(db, "data", "reservationStat");
    const dataSnap = await getDoc(dataRef);
    let dateArr = ["monCount", "tueCount", "wedCount", "thuCount", "friCount"];
    let dateKey = dateArr[new Date().getDay()];
    let sexKey = sex === "M" ? "maleCount" : "femaleCount";
    let gradeArr = [
      "gradeSixCount",
      "gradeSevenCount",
      "gradeEightCount",
      "gradeNineCount",
      "gradeTenCount",
      "gradeElevenCount",
      "gradeTwelveCount",
    ];
    let gradeKey = gradeArr[grade - 6];
    // console.log(dateKey, sexKey, gradeKey);

    // updates date count
    await updateDoc(dataRef, {
      [dateKey]: increment(1),
      [sexKey]: increment(1),
      [gradeKey]: increment(1),
    });

    // updates sex count
  }
  async function cancelReservation(docRef, seatNumber) {
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
        marginRight: marginRight,
        // width: "10vw",
        // width: direction === "vertical" ? "10vw" : "40vw",
        // height: direction === "vertical" ? "40vh" : "10vh",
        // height: direction === "vertical" && "10vh",
        display: "flex",
        flexDirection: direction === "vertical" ? "column" : "row",
        flexWrap: "wrap",
        justifyContent: "center",
        columnGap: direction === "vertical" ? "1vw" : "0.5vw",
        // columGap: "1vw",
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

export function SquareSeats({ startSeat, endSeat }) {
  return (
    <div style={{ display: "flex", flexDirection: "row" }}>
      <SixSeats statSeat={startSeat} endSeat={startSeat + 2}></SixSeats>
      <SixSeats statSeat={endSeat - 2} endSeat={endSeat}></SixSeats>
    </div>
  );
}
