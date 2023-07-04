import { ResponsivePie } from "@nivo/pie";
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
  limit,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../firebase";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import { MyResponsiveLine } from "../Component/LineChart";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function Test() {
  const [reservedSeatCount, setReservedSeatCount] = useState(0);
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

  const data = {
    labels: ["Reserved", "Available"],
    datasets: [
      {
        label: "# of Votes",
        data: [75, reservedSeatCount],
        backgroundColor: ["rgba(255, 99, 132, 0.2)", "rgba(54, 162, 235, 0.2)"],
        borderColor: ["rgba(255, 99, 132, 1)", "rgba(54, 162, 235, 1)"],
        borderWidth: 1,
      },
    ],
  };
  //   return <PieChart></PieChart>;
  return (
    <MyResponsiveLine></MyResponsiveLine>
    // <div style={{ width: "30vh", height: "30vh" }}>
    //   <Pie data={data} />
    // </div>
  );
}
