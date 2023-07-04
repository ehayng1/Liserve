import { useEffect, useState } from "react";
import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
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
import { db } from "../firebase";
import { useTheme } from "@mui/material/styles";
import { ResponsivePie } from "@nivo/pie";
// import PieChart from "../Component/PieChart";
import { PieChart } from "../Component/PieChart";

export default function Stats({ totalSeats, reserved, available }) {
  const [reservedSeatCount, setReservedSeatCount] = useState(0);
  const theme = useTheme();
  const data = [
    {
      id: "Reserved",
      label: "Reserved",
      value: 261,
      color: "hsl(201, 70%, 50%)",
    },
    {
      id: "Available",
      label: "Available",
      value: 264,
      color: "hsl(68, 70%, 50%)",
    },
  ];
  useEffect(() => {
    async function getSeatData() {
      const querySnapshot = await getDocs(collection(db, "seats"));
      const q = query(collection(db, "seats"));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        let count = 0;
        querySnapshot.forEach((doc) => {
          if (doc.data().isReserved) {
            count++;
          }
        });
        setReservedSeatCount(count);
      });
    }
    getSeatData();
  }, []);

  const NivoPieChart = ({ data /* see data tab */ }) => (
    <div style={{ width: "30vw", height: "30vh" }}>
      <ResponsivePie
        data={[
          {
            id: "Reserved",
            label: "Reserved",
            value: reservedSeatCount,
            color: "hsl(201, 70%, 50%)",
          },
          {
            id: "Available",
            label: "Available",
            value: totalSeats - reservedSeatCount,
            color: "hsl(68, 70%, 50%)",
          },
        ]}
        margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
        sortByValue={true}
        innerRadius={0.3}
        padAngle={2}
        cornerRadius={2}
        activeOuterRadiusOffset={8}
        colors={{ scheme: "category10" }}
        borderWidth={1}
        borderColor={{
          from: "color",
          modifiers: [["darker", 0.2]],
        }}
        enableArcLinkLabels={false}
        arcLinkLabelsSkipAngle={10}
        arcLinkLabelsTextColor="#333333"
        arcLinkLabelsThickness={2}
        arcLinkLabelsColor={{ from: "color" }}
        arcLabelsSkipAngle={10}
        arcLabelsTextColor="#ffffff"
        motionConfig="slow"
        transitionMode="startAngle"
        legends={[
          {
            anchor: "bottom",
            direction: "row",
            justify: false,
            translateX: 0,
            translateY: 83,
            itemsSpacing: 0,
            itemWidth: 100,
            itemHeight: 100,
            itemTextColor: "#999",
            itemDirection: "left-to-right",
            itemOpacity: 1,
            symbolSize: 15,
            symbolShape: "circle",
            effects: [
              {
                on: "hover",
                style: {
                  itemTextColor: "#000",
                },
              },
            ],
          },
        ]}
      />
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "row" }}>
      {/* <div style={{ width: "30vh", height: "30vh" }}>
        {" "}
        <NivoPieChart></NivoPieChart>
      </div> */}

      <div style={{ width: "30vh", height: "30vh" }}>
        <PieChart reserved={reservedSeatCount} available={available}></PieChart>
      </div>
    </div>
  );
}
