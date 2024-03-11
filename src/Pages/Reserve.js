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

import { SixSeats } from "../Component/Seats";
import { SquareSeats } from "../Component/Seats";
import { upload } from "@testing-library/user-event/dist/upload";
// import Stair from "../assets/stair.png";
import Stair from "../assets/stair.png";
import StairtoDown from "../assets/StairtoDown.png";
import { height } from "@mui/system";
import "./Reserve.css";

export default function Reserve() {
  const [ID, setID] = useState("");
  const [open, setOpen] = useState(false);
  const { id, userName } = useContext(UserContext);
  const [loading, setIsLoading] = useState(true);
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
    setIsLoading(true);
    async function init() {
      const tempId = await getUserId();
      setID(tempId);
      // console.log(tempId);
    }
    init();
  }, []);

  // get seat data
  useEffect(() => {
    setIsLoading(true);
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
        setIsLoading(false);
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
    <>
      {loading ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100vh",
          }}
        >
          <img
            style={{
              cursor: "pointer",
              borderRadius: "1rem",
              width: "30%",
              height: "40%",
            }}
            src="https://i.pinimg.com/originals/26/20/8c/26208c54439dd5d89de0256177496258.gif"
            alt="Centered image"
          />
          <h1>Liserve is loading...</h1>
        </div>
      ) : (
        <div
          style={{
            width: "100%",
          }}
        >
          {isFirst ? (
            <>
              <h1
                style={{
                  marginBottom: "5vh",
                  marginLeft: "10%",
                  marginRight: "10%",
                }}
              >
                First Floor
              </h1>
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
                    <div style={{ marginRight: "3vw" }}>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                        }}
                      >
                        <SixSeats
                          startSeat={1}
                          endSeat={4}
                          direction={"horizontal"}
                          alignment="flex-start"
                        ></SixSeats>

                        <SixSeats
                          startSeat={4}
                          endSeat={7}
                          direction={"horizontal"}
                          alignment="flex-start"
                        ></SixSeats>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          marginTop: "5vh",
                        }}
                      >
                        <SixSeats
                          direction={"horizontal"}
                          startSeat={7}
                          endSeat={13}
                        ></SixSeats>
                        <SixSeats
                          direction={"horizontal"}
                          startSeat={13}
                          endSeat={19}
                        ></SixSeats>
                      </div>
                    </div>
                    <SixSeats startSeat={19} endSeat={25}></SixSeats>
                    <SixSeats startSeat={25} endSeat={31}></SixSeats>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        marginLeft: "3vw",
                      }}
                    >
                      <SixSeats startSeat={31} endSeat={37}></SixSeats>
                      <SixSeats startSeat={37} endSeat={43}></SixSeats>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        marginLeft: "3vw",
                      }}
                    >
                      <SixSeats startSeat={43} endSeat={49}></SixSeats>
                      <SixSeats startSeat={49} endSeat={55}></SixSeats>
                    </div>

                    {/* <div
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
                    </div> */}
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
                    Available: {54 - firstFloorReserved} / 54
                  </h2>
                  <img
                    className="stair"
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
              <div style={{ marginLeft: "10%", marginRight: "10%" }}>
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
                    <div style={{ flex: 1 }}>
                      <img
                        className="stair"
                        onClick={() => setIsFirst(!isFirst)}
                        src={StairtoDown}
                        style={{
                          marginLeft: "25vw",
                          marginRight: "2vw",
                          marginTop: "5vh",
                        }}
                      ></img>
                    </div>
                    <div>
                      <SixSeats
                        startSeat={98}
                        endSeat={104}
                        marginRight="0.5vw"
                        direction={"horizontal"}
                      ></SixSeats>
                      <SixSeats
                        startSeat={104}
                        endSeat={110}
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
                      justifyContent: "space-evenly",
                    }}
                  >
                    <SixSeats startSeat={55} endSeat={62}></SixSeats>

                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        marginLeft: "3vw",
                        marginRight: "3vw",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "row",
                        }}
                      >
                        <SixSeats
                          startSeat={62}
                          endSeat={64}
                          marginRight="0.5vw"
                        ></SixSeats>
                        <SixSeats
                          marginRight="2vw"
                          startSeat={64}
                          endSeat={66}
                        ></SixSeats>
                        <SixSeats
                          startSeat={66}
                          endSeat={68}
                          marginRight="0.5vw"
                        ></SixSeats>
                        <SixSeats startSeat={68} endSeat={70}></SixSeats>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          marginTop: "1vw",
                        }}
                      >
                        <SixSeats
                          startSeat={70}
                          endSeat={72}
                          marginRight="0.5vw"
                        ></SixSeats>
                        <SixSeats
                          marginRight="2vw"
                          startSeat={72}
                          endSeat={74}
                        ></SixSeats>

                        <SixSeats
                          startSeat={74}
                          endSeat={76}
                          marginRight="0.5vw"
                        ></SixSeats>
                        <SixSeats startSeat={76} endSeat={78}></SixSeats>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          marginTop: "1vw",
                        }}
                      >
                        <SixSeats
                          startSeat={78}
                          endSeat={80}
                          marginRight="0.5vw"
                        ></SixSeats>
                        <SixSeats
                          marginRight="2vw"
                          startSeat={80}
                          endSeat={82}
                        ></SixSeats>

                        <SixSeats
                          startSeat={82}
                          endSeat={84}
                          marginRight="0.5vw"
                        ></SixSeats>
                        <SixSeats
                          marginRight="2vw"
                          startSeat={84}
                          endSeat={86}
                        ></SixSeats>

                        <SixSeats
                          startSeat={86}
                          endSeat={88}
                          marginRight="0.5vw"
                        ></SixSeats>
                        <SixSeats
                          marginRight="2vw"
                          startSeat={88}
                          endSeat={90}
                        ></SixSeats>
                      </div>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        marginLeft: "3vw",
                      }}
                    >
                      <SixSeats
                        startSeat={90}
                        endSeat={94}
                        marginRight="0.5vw"
                        alignment="flex-end"
                      ></SixSeats>
                      <SixSeats
                        startSeat={94}
                        endSeat={98}
                        alignment="flex-end"
                      ></SixSeats>
                    </div>
                  </div>
                </div>
                <h2 style={{ marginTop: "5vh" }}>
                  Available: {55 - secondFloorReserved} / 55
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
      )}
    </>
  );
}
