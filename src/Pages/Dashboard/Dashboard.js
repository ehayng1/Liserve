import { Log } from "./Components/Log";
import { MyResponsivePie } from "../../Component/PieChart";
import { MyResponsiveLine } from "../../Component/LineChart";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import { TempleBuddhist } from "@mui/icons-material";
export default function Dashboard() {
  const [data, setData] = useState(); // re - render
  const [lineData, setLineData] = useState([]);
  const [periodData, setPeriodData] = useState([]);
  //gets pie chart data
  useEffect(() => {
    console.log("useeffect");
    let data;
    async function getData() {
      const docRef = doc(db, "data", "reservationStat");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        // console.log("Document data:", docSnap.data());
        data = docSnap.data();
        console.log(data);
        setData(data);
      } else {
        // docSnap.data() will be undefined in this case
        console.log("No such document!");
      }
      const querySnapshot = await getDocs(collection(db, "dailyData"));
      let tempReserveData = [
        {
          id: "Reserve",
          color: "hsl(314, 70%, 50%)",
          data: [],
        },
        {
          id: "Cancel",
          color: "hsl(144, 70%, 50%)",
          data: [],
        },
      ];
      let tempPeriodData = [
        {
          id: "Lunch",
          color: "hsl(314, 70%, 50%)",
          data: [],
        },
        {
          id: "Break",
          color: "hsl(144, 70%, 50%)",
          data: [],
        },
      ];
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        let data = doc.data();
        console.log(doc.id, " => ", doc.data());
        let date = new Date(doc.id);
        let dateLabel = date.toLocaleString("en-us", {
          month: "short",
          day: "numeric",
        });
        tempReserveData[0].data.push({
          x: dateLabel,
          y: data.reserveCount,
        });
        tempReserveData[1].data.push({
          x: dateLabel,
          y: data.cancelCount,
        });
        tempPeriodData[0].data.push({
          x: dateLabel,
          y: data.lunchCount,
        });
        tempPeriodData[1].data.push({
          x: dateLabel,
          y: data.breakCount,
        });
        console.log(tempReserveData);
        setLineData(tempReserveData);
        setPeriodData(tempPeriodData);
      });
    }
    getData();
  }, []); // dependency array

  let width = window.innerWidth;
  // let dateData = { mon: 20, tue: 25, wed: 30, thu: 20, fri: 5 };
  let dateData;
  let gradeData;
  let sexData;

  dateData = [
    {
      id: "Monday",
      label: "Monday",
      value: data && data.monCount,
      color: "hsl(24, 70%, 50%)",
    },
    {
      id: "Tudsday",
      label: "Tudsday",
      value: data && data.tueCount,
      color: "hsl(25, 70%, 50%)",
    },
    {
      id: "Wednesday",
      label: "Wednesday",
      value: data && data.wedCount,
      color: "hsl(306, 70%, 50%)",
    },
    {
      id: "Thursday",
      label: "Thursday",
      value: 20,
      color: "hsl(145, 70%, 50%)",
    },
    {
      id: "Friday",
      label: "Friday",
      value: 5,
      color: "hsl(158, 70%, 50%)",
    },
  ];
  gradeData = [
    {
      id: "Grade 6",
      label: "Grade 6",
      value: 20,
      color: "hsl(24, 70%, 50%)",
    },
    {
      id: "Grade 7",
      label: "Grade 7",
      value: 25,
      color: "hsl(25, 70%, 50%)",
    },
    {
      id: "Grade 8",
      label: "Grade 8",
      value: 30,
      color: "hsl(306, 70%, 50%)",
    },
    {
      id: "Grade 9",
      label: "Grade 9",
      value: 20,
      color: "hsl(145, 70%, 50%)",
    },
    {
      id: "Grade 10",
      label: "Grade 10",
      value: 5,
      color: "hsl(158, 70%, 50%)",
    },
  ];
  sexData = [
    {
      id: "Male",
      label: "Male",
      value: data && data.maleCount,
      color: "hsl(24, 70%, 50%)",
    },
    {
      id: "Female",
      label: "Female",
      value: data && data.femaleCount,
      color: "hsl(24, 70%, 50%)",
    },
  ];
  // let lineData;
  // lineData = [
  //   {
  //     id: "Reservation",
  //     color: "hsl(314, 70%, 50%)",
  //     data: [
  //       {
  //         x: "6/2",
  //         y: 278,
  //       },
  //       {
  //         x: "6/5",
  //         y: 193,
  //       },
  //       {
  //         x: "6/6",
  //         y: 176,
  //       },
  //       {
  //         x: "6/11",
  //         y: 121,
  //       },
  //       {
  //         x: "6/12",
  //         y: 33,
  //       },
  //       {
  //         x: "6/15",
  //         y: 66,
  //       },
  //       {
  //         x: "6/20",
  //         y: 30,
  //       },
  //       {
  //         x: "6/22",
  //         y: 203,
  //       },
  //       {
  //         x: "6/25",
  //         y: 62,
  //       },
  //       {
  //         x: "6/26",
  //         y: 276,
  //       },
  //       {
  //         x: "7/1",
  //         y: 128,
  //       },
  //       {
  //         x: "7/2",
  //         y: 32,
  //       },
  //     ],
  //   },
  //   {
  //     id: "Cancellation",
  //     color: "hsl(144, 70%, 50%)",
  //     data: [
  //       {
  //         x: "6/2",
  //         y: 10,
  //       },
  //       {
  //         x: "6/5",
  //         y: 279,
  //       },
  //       {
  //         x: "6/6",
  //         y: 246,
  //       },
  //       {
  //         x: "6/11",
  //         y: 76,
  //       },
  //       {
  //         x: "6/12",
  //         y: 203,
  //       },
  //       {
  //         x: "6/15",
  //         y: 198,
  //       },
  //       {
  //         x: "6/20",
  //         y: 244,
  //       },
  //       {
  //         x: "6/22",
  //         y: 159,
  //       },
  //       {
  //         x: "6/25",
  //         y: 165,
  //       },
  //       {
  //         x: "6/26",
  //         y: 266,
  //       },
  //       {
  //         x: "7/1",
  //         y: 112,
  //       },
  //       {
  //         x: "7/2",
  //         y: 277,
  //       },
  //     ],
  //   },
  // ];

  return (
    <div style={{ display: "flex", flexDirection: "row", flex: 1 }}>
      <div style={{ minWidth: "60vw", flex: 1 }}>
        {/* <div style={{ width: "100%" }}> */}
        <h1 style={{ textAlign: "left" }}>Overview</h1>
        <div style={{ display: "flex", flexDirection: "row" }}>
          <div style={{ width: "33%", height: "40vh" }}>
            <h3>Reservation by date</h3>
            <MyResponsivePie data={dateData}></MyResponsivePie>
          </div>
          <div style={{ width: "33%", height: "40vh" }}>
            <h3>Reservation by grade</h3>
            <MyResponsivePie data={gradeData}></MyResponsivePie>
          </div>
          <div style={{ width: "33%", height: "40vh" }}>
            <h3>Reservation by sex</h3>
            <MyResponsivePie data={sexData}></MyResponsivePie>
          </div>
        </div>

        <div style={{ display: "flex" }}>
          <div style={{ width: "50%", height: "40vh" }}>
            <MyResponsiveLine
              data={lineData}
              legend="Reserve vs Cancel"
            ></MyResponsiveLine>
          </div>
          <div style={{ width: "50%", height: "40vh" }}>
            <MyResponsiveLine
              data={periodData}
              legend="Lunch vs Break"
            ></MyResponsiveLine>
          </div>
        </div>
      </div>
      {/* <PieChart data={dateData}></PieChart> */}

      <Log></Log>

      {/* <TextField id="filled-basic" label="Filled" variant="filled" />
      <TextField id="standard-basic" label="Standard" variant="standard" /> */}
    </div>
  );
}
