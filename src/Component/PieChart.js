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
// import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import "chartjs-plugin-datalabels";

// install (please try to align the version of installed @nivo packages)
// yarn add @nivo/pie

// make sure parent container have a defined height when using
// responsive component, otherwise height will be 0 and
// no chart will be rendered.
// website examples showcase many properties,
// you'll often use just a few of them.
export const MyResponsivePie = ({ data /* see data tab */ }) => {
  const formatValue = (value, total) => {
    const percentage = ((value / total) * 100).toFixed(1);
    return `${percentage}%`;
  };
  return (
    <ResponsivePie
      data={data}
      margin={{ top: 0, right: 80, bottom: 80, left: 80 }}
      innerRadius={0.5}
      padAngle={0.7}
      cornerRadius={3}
      activeOuterRadiusOffset={8}
      colors={{ scheme: "nivo" }}
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
      // arcLabel="id"
      arcLabel={(e) => e.value + "%"}
      arcLabelsSkipAngle={10}
      arcLabelsTextColor={{
        from: "color",
        modifiers: [["darker", 2]],
      }}
      legends={[
        {
          anchor: "left",
          direction: "column",
          justify: false,
          translateX: -80,
          translateY: -10,
          itemsSpacing: 0,
          itemWidth: 10,
          itemHeight: 30,
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
  );
};

// ChartJS.register(ArcElement, Tooltip, Legend);

// export default function PieChart({ reserved, available }) {
export function PieChart({ data }) {
  // const data = [
  //   { x: "Reserved", y: reserved },
  //   { x: "Availalbe", y: available },
  // ];
  const Piedata = { ...data };
  console.log(Piedata);
  const ChartjsData = {
    // labels: ["Reserved", "Available"],
    labels: Object.keys(Piedata),
    datasets: [
      {
        label: "# of Votes",
        // data: [reserved, available],
        data: Object.values(Piedata),
        // backgroundColor: ["rgba(20,0, 0, 0.2)", "rgba(54, 162, 235, 0.2)"],
        backgroundColor: ["#EC6B56", "#FFC154", "#47B39C"],
        borderColor: ["#EC6B56", "#FFC154", "#47B39C"],
        borderWidth: 1,
      },
    ],
  };

  //   const options = {
  //     tooltips: {
  //         enabled: false
  //     },
  //     plugins: {
  //         datalabels: {
  //             formatter: (value, ctx) => {
  //               const datapoints = ctx.chart.data.datasets[0].data
  //               function totalSum(totla, datapoint) {
  //                 return totla + datapoint
  //               }
  //               const totalvalue = datapoints.reduce(totalSUmn, 0)
  //               const percentageValue = (value / totalvalue * 100).toFixed(1)
  //               const display = [`${percentageValue}%`]
  //               return display
  //                 // let sum = 0;
  //                 // let dataArr = ctx.chart.data.datasets[0].data;
  //                 // dataArr.map(data => {
  //                 //     sum += data;
  //                 // });
  //                 // let percentage = (value*100 / sum).toFixed(2)+"%";
  //                 // return percentage;
  //             },
  //             // color: '#fff',
  //         }
  //     }
  // };

  // const options = {
  //   tooltips: {
  //     callbacks: {
  //       label: function(tooltipItem, data) {
  //         var dataset = data.datasets[tooltipItem.datasetIndex];
  //         var meta = dataset._meta[Object.keys(dataset._meta)[0]];
  //         var total = meta.total;
  //         var currentValue = dataset.data[tooltipItem.index];
  //         var percentage = parseFloat(
  //           ((currentValue / total) * 100).toFixed(1)
  //         );
  //         return currentValue + " (" + percentage + "%)";
  //       },
  //       title: function(tooltipItem, data) {
  //         return data.labels[tooltipItem[0].index];
  //       },
  //     },
  //   },
  // };

  const options = {
    tooltips: {
      callbacks: {
        label: function(tooltipItem, data) {
          var dataset = data.datasets[tooltipItem.datasetIndex];
          var meta = dataset._meta[Object.keys(dataset._meta)[0]];
          var total = meta.total;
          var currentValue = dataset.data[tooltipItem.index];
          var percentage = parseFloat(
            ((currentValue / total) * 100).toFixed(1)
          );
          return currentValue + " (" + percentage + "%)";
        },
      },
    },
  };

  return (
    <div style={{ width: "30vh", height: "30vh" }}>
      {/* <Pie data={ChartjsData} options={options}></Pie> */}
    </div>
  );
}
