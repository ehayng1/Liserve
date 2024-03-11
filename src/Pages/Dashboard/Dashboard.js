import { Log } from "./Components/Log";
import { MyResponsivePie } from "../../Component/PieChart";
import { MyResponsiveLine } from "../../Component/LineChart";
import { useEffect, useState } from "react";
import { doc, getDoc, orderBy } from "firebase/firestore";
import { collection, getDocs, query } from "firebase/firestore";
import { db } from "../../firebase";
import { TempleBuddhist } from "@mui/icons-material";
export default function Dashboard() {
  const [data, setData] = useState(); // re - render
  const [lineData, setLineData] = useState([
    {
      id: "Reserve",
      color: "hsl(314, 70%, 50%)",
      data: [
        {
          x: "6/2",
          y: 278,
        },
      ],
    },
    {
      id: "Cancel",
      color: "hsl(144, 70%, 50%)",
      data: [
        {
          x: "6/2",
          y: 278,
        },
      ],
    },
  ]);
  const [periodData, setPeriodData] = useState([]);
  const [dateData, setDateData] = useState([
    {
      id: "Monday",
      label: "Monday",
      value: 0,
      color: "hsl(24, 70%, 50%)",
    },
    {
      id: "Tudsday",
      label: "Tudsday",
      value: 0,
      color: "hsl(25, 70%, 50%)",
    },
    {
      id: "Wednesday",
      label: "Wednesday",
      value: 0,
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
  ]);
  const [gradeData, setGradeData] = useState([
    {
      id: "Grade 10",
      label: "Grade 6",
      value: 20,
      color: "hsl(24, 70%, 50%)",
    },
    {
      id: "Grade 11",
      label: "Grade 7",
      value: 25,
      color: "hsl(25, 70%, 50%)",
    },
    {
      id: "Grade 12",
      label: "Grade 8",
      value: 30,
      color: "hsl(306, 70%, 50%)",
    },
  ]);
  const [sexData, setSexData] = useState([
    {
      id: "Male",
      label: "Male",
      value: 12,
      color: "hsl(24, 70%, 50%)",
    },
    {
      id: "Female",
      label: "Female",
      value: 5,
      color: "hsl(24, 70%, 50%)",
    },
  ]);
  const [dateTotal, setDateTotal] = useState();
  const [gradeTotal, setGradeTotal] = useState();
  const [sexTotal, setSexTotal] = useState();

  useEffect(() => {
    console.log("useeffect");
    let data;

    async function getData() {
      let tempDateData = [
        {
          id: "Monday",
          label: "Mon",
          value: 0,
          color: "hsl(24, 70%, 50%)",
        },
        {
          id: "Tudsday",
          label: "Tue",
          value: 0,
          color: "hsl(25, 70%, 50%)",
        },
        {
          id: "Wednesday",
          label: "Wed",
          value: 0,
          color: "hsl(306, 70%, 50%)",
        },
        {
          id: "Thursday",
          label: "Thu",
          value: 20,
          color: "hsl(145, 70%, 50%)",
        },
        {
          id: "Friday",
          label: "Fri",
          value: 5,
          color: "hsl(158, 70%, 50%)",
        },
      ];
      let tempGradeData = [
        {
          id: "Grade 10",
          label: "Gr.10",
          value: 20,
          color: "hsl(24, 70%, 50%)",
        },
        {
          id: "Grade 11",
          label: "Gr.11",
          value: 25,
          color: "hsl(25, 70%, 50%)",
        },
        {
          id: "Grade 12",
          label: "Gr.12",
          value: 30,
          color: "hsl(306, 70%, 50%)",
        },
      ];
      let tempSexData = [
        {
          id: "Male",
          label: "Male",
          value: 12,
          color: "hsl(24, 70%, 50%)",
        },
        {
          id: "Female",
          label: "Female",
          value: 5,
          color: "hsl(24, 70%, 50%)",
        },
      ];
      const docRef = doc(db, "data", "reservationStat");
      //gets pie chart data
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        // console.log("Document data:", docSnap.data());
        data = docSnap.data();
        tempDateData[0].value = data.monCount;
        tempDateData[1].value = data.tueCount;
        tempDateData[2].value = data.wedCount;
        tempDateData[3].value = data.thuCount;
        tempDateData[4].value = data.friCount;
        setDateTotal(
          data.monCount +
            data.tueCount +
            data.wedCount +
            data.thuCount +
            data.friCount
        );
        tempGradeData[0].value = data.gradeTenCount;
        tempGradeData[1].value = data.gradeElevenCount;
        tempGradeData[2].value = data.gradeTwelveCount;
        setGradeTotal(
          data.gradeTenCount + data.gradeElevenCount + data.gradeTwelveCount
        );
        tempSexData[0].value = data.maleCount;
        tempSexData[1].value = data.femaleCount;
        setSexTotal(data.maleCount + data.femaleCount);
        // console.log(data);
        setData(data);
        setDateData(tempDateData);
        setGradeData(tempGradeData);
        setSexData(tempSexData);
      } else {
        // docSnap.data() will be undefined in this case
        console.log("No such document!");
      }
      //gets linechart data
      const q = query(collection(db, "dailyData"), orderBy("timeStamp"));
      const querySnapshot = await getDocs(q);
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
        let data = doc.data();
        let date = new Date(doc.id);
        let dateLabel = date.toLocaleString("en-us", {
          month: "short",
          day: "numeric",
        });
        tempReserveData[0].data.push({
          x: dateLabel,
          y: data.reserveCount ? data.reserveCount : 0,
        });
        tempReserveData[1].data.push({
          x: dateLabel,
          y: data.cancelCount ? data.cancelCount : 0,
        });
        tempPeriodData[0].data.push({
          x: dateLabel,
          y: data.lunchCount ? data.lunchCount : 0,
        });
        tempPeriodData[1].data.push({
          x: dateLabel,
          y: data.breakCount ? data.breakCount : 0,
        });
      });
      console.log(tempReserveData);
      console.log(tempPeriodData);
      setLineData(tempReserveData);
      setPeriodData(tempPeriodData);
    }
    getData();
  }, []); // dependency array
  // let dateData = { mon: 20, tue: 25, wed: 30, thu: 20, fri: 5 };
  // let dateData;
  // let gradeData;
  // let sexData;

  // dateData = [
  //   {
  //     id: "Monday",
  //     label: "Monday",
  //     value: data && data.monCount,
  //     color: "hsl(24, 70%, 50%)",
  //   },
  //   {
  //     id: "Tudsday",
  //     label: "Tudsday",
  //     value: data && data.tueCount,
  //     color: "hsl(25, 70%, 50%)",
  //   },
  //   {
  //     id: "Wednesday",
  //     label: "Wednesday",
  //     value: data && data.wedCount,
  //     color: "hsl(306, 70%, 50%)",
  //   },
  //   {
  //     id: "Thursday",
  //     label: "Thursday",
  //     value: 20,
  //     color: "hsl(145, 70%, 50%)",
  //   },
  //   {
  //     id: "Friday",
  //     label: "Friday",
  //     value: 5,
  //     color: "hsl(158, 70%, 50%)",
  //   },
  // ];
  // gradeData = [
  //   {
  //     id: "Grade 6",
  //     label: "Grade 6",
  //     value: 20,
  //     color: "hsl(24, 70%, 50%)",
  //   },
  //   {
  //     id: "Grade 7",
  //     label: "Grade 7",
  //     value: 25,
  //     color: "hsl(25, 70%, 50%)",
  //   },
  //   {
  //     id: "Grade 8",
  //     label: "Grade 8",
  //     value: 30,
  //     color: "hsl(306, 70%, 50%)",
  //   },
  //   {
  //     id: "Grade 9",
  //     label: "Grade 9",
  //     value: 20,
  //     color: "hsl(145, 70%, 50%)",
  //   },
  //   {
  //     id: "Grade 10",
  //     label: "Grade 10",
  //     value: 5,
  //     color: "hsl(158, 70%, 50%)",
  //   },
  // ];
  // sexData = [
  //   {
  //     id: "Male",
  //     label: "Male",
  //     value: data && data.maleCount,
  //     color: "hsl(24, 70%, 50%)",
  //   },
  //   {
  //     id: "Female",
  //     label: "Female",
  //     value: data && data.femaleCount,
  //     color: "hsl(24, 70%, 50%)",
  //   },
  // ];
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
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        flex: 1,
        marginLeft: "2vw",
        marginRight: "2vh",
      }}
    >
      <div style={{ minWidth: "75vw", flex: 1 }}>
        {/* <div style={{ width: "100%" }}> */}
        <h1 style={{ textAlign: "left" }}>Overview</h1>
        <div style={{ display: "flex", flexDirection: "row" }}>
          <div style={{ width: "33%", height: "40vh" }}>
            <h3>Reservation by day</h3>
            <MyResponsivePie
              data={dateData}
              total={dateTotal}
            ></MyResponsivePie>
          </div>
          <div style={{ width: "33%", height: "40vh" }}>
            <h3>Reservation by grade</h3>
            <MyResponsivePie
              data={gradeData}
              total={gradeTotal}
            ></MyResponsivePie>
          </div>
          <div style={{ width: "33%", height: "40vh" }}>
            <h3>Reservation by gender</h3>
            <MyResponsivePie data={sexData} total={sexTotal}></MyResponsivePie>
          </div>
        </div>

        <div style={{ display: "flex", marginTop: "5vh" }}>
          <div style={{ width: "50%", height: "40vh" }}>
            <div style={{ fontSize: "1.2rem", fontWeight: "bold" }}>
              Reserve vs Cancel
            </div>
            <MyResponsiveLine
              data={lineData}
              legend="Reserve vs Cancel"
            ></MyResponsiveLine>
          </div>
          <div style={{ width: "50%", height: "40vh" }}>
            <div style={{ fontSize: "1.2rem", fontWeight: "bold" }}>
              Lunch vs Break
            </div>
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
