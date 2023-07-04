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
  limit,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../firebase";
import { getUserId } from "../utils/Firebase";
import { uploadSeats } from "../utils/Firebase";
import { useTheme } from "@mui/material/styles";
import { UpdateLog } from "../Component/UpdateLog";
import { Announcement } from "../Component/Announcement";
import LiServeBot from "../Component/LiServeBot";
import Stats from "./Stats";
import PieChart from "../Component/PieChart";
import { useContext } from "react";
import { UserContext } from "../Context/UserContext";
import * as React from "react";
import Stack from "@mui/material/Stack";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import Slide from "@mui/material/Slide";
import RectangleSeat from "../Component/RectangleSeat";
import { SixSeats } from "../Component/Seats";
import { SquareSeats } from "../Component/Seats";
import { upload } from "@testing-library/user-event/dist/upload";
// import Stair from "../assets/stair.png";
import Stair from "../assets/stair.png";
import StairtoDown from "../assets/StairtoDown.png";
import { height } from "@mui/system";

export default function Reserve() {
  const [ID, setID] = useState("");
  const [open, setOpen] = React.useState(false);
  const { id, userName } = useContext(UserContext);

  const totalSeats = 75;
  const [isFirst, setIsFirst] = useState(true);
  const [seats, setSeats] = useState([
    { isReserved: false, seatNumber: 1, reservedBy: "" },
  ]);
  const [firstFloorReserved, setFirstFloorReserved] = useState(0);
  const [secondFloorReserved, setSecondFloorReserved] = useState(0);
  const [available, setAvailable] = useState(75);

  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });
  const theme = useTheme();

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
        // limit(totalSeats),
        orderBy("seatNumber")
      );
      let firstReservedCount;
      let secondReservedCount;
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        let tempSeats = [];
        firstReservedCount = 0;
        secondReservedCount = 0;

        querySnapshot.forEach((doc) => {
          let data = doc.data();
          tempSeats.push(data);
          if (data.isReserved) {
            // if seat is at first floor
            if (data.seatNumber <= 60) {
              firstReservedCount++;
            }
            // if seat is at second floor
            else {
              secondReservedCount++;
            }
          }
        });
        setFirstFloorReserved(firstReservedCount);
        setSecondFloorReserved(secondReservedCount);
        setSeats(tempSeats);
      });
    }
    getSeatData();
  }, []);

  // gets reserved count
  // useEffect(() => {
  //   async function getSeatData() {
  //     const q = query(
  //       collection(db, "seats"),
  //       // limit(40),
  //       limit(totalSeats),
  //       orderBy("seatNumber")
  //     );
  //     let reservedCount = 0;
  //     const unsubscribe = onSnapshot(q, (querySnapshot) => {
  //       let tempSeats = [];
  //       querySnapshot.forEach((doc) => {
  //         tempSeats.push(doc.data());
  //         if (doc.data().isReserved) {
  //           reservedCount++;
  //         }
  //       });
  //       // setReserved(reservedCount);
  //       setSeats(tempSeats);
  //     });
  //   }
  //   getSeatData();
  // }, []);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  function TransitionRight(props) {
    return <Slide {...props} direction="right" />;
  }

  return (
    <div
      style={{
        // display: "flex",
        // flexDirection: "row",
        // flexWrap: "wrap",
        width: "100%",
      }}
    >
      {/* <div style={{ height: "30%", width: "100%", margin: "0 auto" }}> */}
      {/* </div> */}
      {/* <div
        style={{
          height: "70%",
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          rowGap: "1.5vh",
          justifyContent: "center",
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
      </div> */}
      {isFirst ? (
        <>
          <h1 style={{ marginBottom: "5vh" }}>First Floor</h1>
          <div>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  flexWrap: "wrap",
                }}
              >
                <SixSeats startSeat={1} endSeat={7}></SixSeats>
                <SixSeats startSeat={7} endSeat={13}></SixSeats>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    marginLeft: "3vw",
                  }}
                >
                  <SixSeats startSeat={13} endSeat={19}></SixSeats>
                  <SixSeats startSeat={19} endSeat={25}></SixSeats>
                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    marginLeft: "3vw",
                  }}
                >
                  <SixSeats startSeat={25} endSeat={31}></SixSeats>
                  <SixSeats startSeat={31} endSeat={37}></SixSeats>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    marginLeft: "3vw",
                  }}
                >
                  <SixSeats startSeat={37} endSeat={43}></SixSeats>
                  <SixSeats startSeat={43} endSeat={49}></SixSeats>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    marginLeft: "3vw",
                  }}
                >
                  <SixSeats
                    startSeat={49}
                    endSeat={55}
                    direction={"horizontal"}
                  ></SixSeats>
                  <SixSeats
                    startSeat={55}
                    endSeat={61}
                    direction={"horizontal"}
                  ></SixSeats>
                </div>
              </div>
            </div>
            <div>
              <h2
                style={{
                  textAlign: "center",
                  marginTop: "2vh",
                  marginBottom: "5vh",
                }}
              >
                Available: {60 - firstFloorReserved} / 60
              </h2>
              <img
                onClick={() => setIsFirst(!isFirst)}
                src={Stair}
                style={{}}
              ></img>
            </div>
          </div>
        </>
      ) : (
        <>
          <h1 style={{ marginBottom: "5vh" }}>Second Floor</h1>
          <div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "end",
                flex: 1,
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                  marginBottom: "5vh",
                }}
              >
                <div>
                  <img
                    onClick={() => setIsFirst(!isFirst)}
                    src={StairtoDown}
                    // color : #838383
                    style={{
                      marginLeft: "25vw",
                      marginRight: "2vw",
                      marginTop: "5vh",
                    }}
                  ></img>
                </div>
                <div>
                  <SixSeats
                    startSeat={95}
                    endSeat={101}
                    marginRight="0.5vw"
                    direction={"horizontal"}
                  ></SixSeats>
                  <SixSeats
                    startSeat={101}
                    endSeat={107}
                    marginRight="0.5vw"
                    direction={"horizontal"}
                  ></SixSeats>
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "end",
                }}
              ></div>
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                }}
              >
                <SixSeats startSeat={61} endSeat={67}></SixSeats>

                {/*  square seats */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    marginLeft: "3vw",
                    marginRight: "3vw",
                  }}
                >
                  <div style={{ display: "flex", flexDirection: "row" }}>
                    <SixSeats
                      startSeat={67}
                      endSeat={69}
                      marginRight="0.5vw"
                    ></SixSeats>
                    <SixSeats startSeat={69} endSeat={71}></SixSeats>
                    <SixSeats
                      startSeat={71}
                      endSeat={73}
                      marginRight="0.5vw"
                    ></SixSeats>
                    <SixSeats startSeat={73} endSeat={75}></SixSeats>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      marginTop: "1vw",
                    }}
                  >
                    <SixSeats
                      startSeat={75}
                      endSeat={77}
                      marginRight="0.5vw"
                    ></SixSeats>
                    <SixSeats startSeat={77} endSeat={79}></SixSeats>

                    <SixSeats
                      startSeat={79}
                      endSeat={81}
                      marginRight="0.5vw"
                    ></SixSeats>
                    <SixSeats startSeat={81} endSeat={83}></SixSeats>
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "row" }}>
                  <SixSeats
                    startSeat={83}
                    endSeat={89}
                    marginRight="0.5vw"
                    // direction={"horizontal"}
                  ></SixSeats>
                  <SixSeats
                    startSeat={89}
                    endSeat={95}
                    // direction={"horizontal"}
                  ></SixSeats>
                </div>
              </div>
            </div>
            <h2 style={{ marginTop: "5vh" }}>
              Available: {46 - secondFloorReserved} / 46
            </h2>
          </div>
        </>
      )}
      <div style={{ width: "30%", height: "30%" }}>
        <LiServeBot></LiServeBot>
      </div>
      {/* <Stats
        totalSeats={totalSeats}
        reserved={reserved}
        available={available}
      ></Stats> */}
      <Stack spacing={2} sx={{ width: "100%" }}>
        {/* <Button variant="outlined" onClick={handleOpenSnack}>
          Open success snackbar
        </Button> */}
        <Snackbar
          open={open}
          autoHideDuration={3000}
          onClose={handleClose}
          TransitionComponent={TransitionRight}
        >
          <Alert
            onClose={handleClose}
            severity="info"
            sx={{ width: "100%", textAlign: "left", fontSize: "1rem" }}
          >
            It is not reservation time! <br />
            Reservation times are 8:10 ~ 8:40 and 11:05 ~ 11:30.
          </Alert>
        </Snackbar>
        {/* <Alert severity="error">This is an error message!</Alert>
        <Alert severity="warning">This is a warning message!</Alert>
        <Alert severity="info">This is an information message!</Alert>
        <Alert severity="success">This is a success message!</Alert> */}
      </Stack>
    </div>
    // <RectangleSeat></RectangleSeat>
  );
}
