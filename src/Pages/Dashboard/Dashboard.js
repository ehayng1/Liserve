// import SideBar from "../Component/SideBar";

import { Log } from "./Components/Log";
// import PieChart from "../../Component/PieChart";
import { MyResponsivePie } from "../../Component/PieChart";
import { MyResponsiveLine } from "../../Component/LineChart";

export default function Dashboard() {
  let width = window.innerWidth;
  // let dateData = { mon: 20, tue: 25, wed: 30, thu: 20, fri: 5 };
  let dateData = [
    {
      id: "Monday",
      label: "Monday",
      value: 20,
      color: "hsl(24, 70%, 50%)",
    },
    {
      id: "Tudsday",
      label: "Tudsday",
      value: 25,
      color: "hsl(25, 70%, 50%)",
    },
    {
      id: "Wednesday",
      label: "Wednesday",
      value: 30,
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
  let gradeData = [
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
  let sexData = [
    {
      id: "Male",
      label: "Male",
      value: 40,
      color: "hsl(24, 70%, 50%)",
    },
    {
      id: "Female",
      label: "Female",
      value: 60,
      color: "hsl(24, 70%, 50%)",
    },
  ];
  let lineData = [
    // {
    //   id: "Reservation",
    //   color: "hsl(74, 70%, 50%)",
    //   data: [
    //     {
    //       x: "plane",
    //       y: 36,
    //     },
    //     {
    //       x: "helicopter",
    //       y: 211,
    //     },
    //     {
    //       x: "boat",
    //       y: 91,
    //     },
    //     {
    //       x: "train",
    //       y: 127,
    //     },
    //     {
    //       x: "subway",
    //       y: 245,
    //     },
    //     {
    //       x: "bus",
    //       y: 227,
    //     },
    //     {
    //       x: "car",
    //       y: 7,
    //     },
    //     {
    //       x: "moto",
    //       y: 71,
    //     },
    //     {
    //       x: "bicycle",
    //       y: 205,
    //     },
    //     {
    //       x: "horse",
    //       y: 63,
    //     },
    //     {
    //       x: "skateboard",
    //       y: 234,
    //     },
    //     {
    //       x: "others",
    //       y: 156,
    //     },
    //   ],
    // },
    // {
    //   id: "Cancellation",
    //   color: "hsl(185, 70%, 50%)",
    //   data: [
    //     {
    //       x: "plane",
    //       y: 241,
    //     },
    //     {
    //       x: "helicopter",
    //       y: 128,
    //     },
    //     {
    //       x: "boat",
    //       y: 0,
    //     },
    //     {
    //       x: "train",
    //       y: 217,
    //     },
    //     {
    //       x: "subway",
    //       y: 274,
    //     },
    //     {
    //       x: "bus",
    //       y: 239,
    //     },
    //     {
    //       x: "car",
    //       y: 32,
    //     },
    //     {
    //       x: "moto",
    //       y: 288,
    //     },
    //     {
    //       x: "bicycle",
    //       y: 292,
    //     },
    //     {
    //       x: "horse",
    //       y: 25,
    //     },
    //     {
    //       x: "skateboard",
    //       y: 136,
    //     },
    //     {
    //       x: "others",
    //       y: 17,
    //     },
    //   ],
    // },
    // {
    //   id: "us",
    //   color: "hsl(274, 70%, 50%)",
    //   data: [
    //     {
    //       x: "plane",
    //       y: 27,
    //     },
    //     {
    //       x: "helicopter",
    //       y: 226,
    //     },
    //     {
    //       x: "boat",
    //       y: 48,
    //     },
    //     {
    //       x: "train",
    //       y: 153,
    //     },
    //     {
    //       x: "subway",
    //       y: 273,
    //     },
    //     {
    //       x: "bus",
    //       y: 250,
    //     },
    //     {
    //       x: "car",
    //       y: 281,
    //     },
    //     {
    //       x: "moto",
    //       y: 96,
    //     },
    //     {
    //       x: "bicycle",
    //       y: 243,
    //     },
    //     {
    //       x: "horse",
    //       y: 54,
    //     },
    //     {
    //       x: "skateboard",
    //       y: 174,
    //     },
    //     {
    //       x: "others",
    //       y: 38,
    //     },
    //   ],
    // },
    {
      id: "Reservation",
      color: "hsl(314, 70%, 50%)",
      data: [
        {
          x: "6/2",
          y: 278,
        },
        {
          x: "6/5",
          y: 193,
        },
        {
          x: "6/6",
          y: 176,
        },
        {
          x: "6/11",
          y: 121,
        },
        {
          x: "6/12",
          y: 33,
        },
        {
          x: "6/15",
          y: 66,
        },
        {
          x: "6/20",
          y: 30,
        },
        {
          x: "6/22",
          y: 203,
        },
        {
          x: "6/25",
          y: 62,
        },
        {
          x: "6/26",
          y: 276,
        },
        {
          x: "7/1",
          y: 128,
        },
        {
          x: "7/2",
          y: 32,
        },
      ],
    },
    {
      id: "Cancellation",
      color: "hsl(144, 70%, 50%)",
      data: [
        {
          x: "6/2",
          y: 10,
        },
        {
          x: "6/5",
          y: 279,
        },
        {
          x: "6/6",
          y: 246,
        },
        {
          x: "6/11",
          y: 76,
        },
        {
          x: "6/12",
          y: 203,
        },
        {
          x: "6/15",
          y: 198,
        },
        {
          x: "6/20",
          y: 244,
        },
        {
          x: "6/22",
          y: 159,
        },
        {
          x: "6/25",
          y: 165,
        },
        {
          x: "6/26",
          y: 266,
        },
        {
          x: "7/1",
          y: 112,
        },
        {
          x: "7/2",
          y: 277,
        },
      ],
    },
  ];

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
        <div style={{ width: "100%", height: "40vh" }}>
          <MyResponsiveLine data={lineData}></MyResponsiveLine>
        </div>
      </div>
      {/* <PieChart data={dateData}></PieChart> */}

      <Log></Log>

      {/* <TextField id="filled-basic" label="Filled" variant="filled" />
      <TextField id="standard-basic" label="Standard" variant="standard" /> */}
    </div>
  );
}
