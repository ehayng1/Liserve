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
  serverTimestamp,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../firebase";
import { getUserId } from "../utils/Firebase";
import { useContext } from "react";
import { UserContext } from "../Context/UserContext";
import * as React from "react";
import { useNavigate } from "react-router-dom";
import MuiAlert from "@mui/material/Alert";
import { useTheme } from "@emotion/react";
import { getAuth, onAuthStateChanged } from "firebase/auth";

export function SeatsFactory({
  startSeat,
  endSeat,
  direction = "vertical",
  marginRight = "1vw",
  columnGap = "1vw",
  alignment = "center",
}) {
  const [ID, setID] = useState("");
  const [grade, setGrade] = useState();
  const [sex, setSex] = useState("");
  const [open, setOpen] = React.useState(false);
  const [loading, setIsLoading] = React.useState(true);
  const [userName, setUserName] = useState();
  const totalSeats = endSeat - startSeat;
  const [seats, setSeats] = useState([]);
  const [reserved, setReserved] = useState(0);
  const [available, setAvailable] = useState(75);
  const auth = getAuth();

  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  // gets user ID and user data
  useEffect(() => {
    setIsLoading(true);
    let tempId;
    let tempSex;
    let tempGrade;
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/auth.user
        // const uid = user.uid;
        tempId = await getUserId();
        setID(tempId);
        const userRef = doc(db, "users", tempId);
        const userSnap = await getDoc(userRef);
        const userData = userSnap.data();
        setUserName(userData.firstName + userData.lastName);
      } else {
        // User is signed out
        // ...
      }
    });
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
      setIsLoading(false);
    }
    getUserData();
  }, []);

  useEffect(() => {
    setIsLoading(true);
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
        setIsLoading(false);
        // console.log(startSeat + "~" + endSeat + ": ", tempSeats);
      });
    }
    getSeatData();
  }, []);

  function validateReserveTime() {
    var currentDate = new Date();
    // if (4 === currentDate.getDay())
    // {
    //   return false
    // }
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
    // alert(userName);
    let isReserveTime = validateReserveTime();
    if (userName === "" || !userName) {
      alert("Please log in before reservation.");
      return;
    } else {
      // if (isReserveTime !== false) {
      if (true) {
        const docRef = doc(db, "seats", e.target.innerText);
        const userRef = doc(db, "users", ID);
        const seatNumber = e.target.innerText;

        const docSnap = await getDoc(docRef);
        const userSnap = await getDoc(userRef);
        const seatReserved = userSnap.data().seatReserved;
        const reserveCount = userSnap.data().reserveCount; // weekly reserveCount
        if (docSnap.exists()) {
          let data = docSnap.data();

          // not reserved => reservation weekly limit is set to 2.
          if (!data.isReserved && reserveCount < 2 && seatReserved === "") {
            // show dialog button here
            await reserve(docRef, seatNumber);
            return;
          } else {
            // if I have reserved the seat=> cancelation
            if (data.reservedBy === userName) {
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
              alert("This seat is already reserved by" + " " + data.reservedBy);

              return;
            }
          }
        }
      } else {
        // this part is de-activated for now.
        setOpen(true);
        // alert(
        //   "It is not reservation time! Reservation times are 8:10 ~ 8:40 and 11:05 ~ 11:30"
        // );
      }
    }
  }

  async function reserve(docRef, seatNumber) {
    alert("Seat reserved succesfully!");

    const updatedSeat = [...seats];
    updatedSeat[seatNumber - startSeat].isReserved = true;
    updatedSeat[seatNumber - startSeat].reservedBy = userName;
    setSeats(updatedSeat);
    setReserved(reserved + 1);
    setAvailable(available - 1);

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
    updateRservationData();
  }

  async function updateRservationData() {
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

  // SeatFactory
  const SeatFactory = styled(Button)(({}) => ({
    // rem differs from each window.
    // vh = view height
    maxWidth: "3rem",
    maxHeight: "3rem",
    marginBottom: "1vh",
    borderRadius: "1rem",
    color: "#1e6cc7",
    fontSize: "1.5rem",
    // marginRight: "2rem",
  }));

  return (
    <div
      style={{
        marginRight: marginRight,
        display: "flex",
        flexDirection: direction === "vertical" ? "column" : "row",
        flexWrap: "wrap",
        // justifyContent: "center",
        justifyContent: alignment,
        columnGap: direction === "vertical" ? "1vw" : "0.5vw",
      }}
    >
      {seats.map((el, index) => (
        //use of SeatFactory
        <SeatFactory
          color={el.reservedBy === userName ? "success" : undefined}
          sx={{ color: el.isReserved && "#ffffff" }}
          key={index}
          onClick={handleClick}
          variant={el.isReserved ? "contained" : "outlined"}
        >
          {el.seatNumber}
        </SeatFactory>
      ))}
    </div>
  );
}

// another useage of seatsFactory: Square seats 2x2
export function SquareSeats({ startSeat, endSeat }) {
  return (
    <div style={{ display: "flex", flexDirection: "row" }}>
      <SeatsFactory statSeat={startSeat} endSeat={startSeat + 2}></SeatsFactory>
      <SeatsFactory statSeat={endSeat - 2} endSeat={endSeat}></SeatsFactory>
    </div>
  );
}
