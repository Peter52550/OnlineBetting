import React, { useState, useEffect } from "react";

// components
import { Bar } from "@ant-design/charts";
import moment from "moment";

// config
import { areas, categories } from "../../config";

const labels = [
  {
    label: "全部",
    value: 0,
  },
  {
    label: "5小時以前",
    value: 5,
  },
  {
    label: "12小時以前",
    value: 12,
  },
  {
    label: "24小時以前",
    value: 24,
  },
  {
    label: "48小時以前",
    value: 48,
  },
];

export default function BarChart({ cardAllBettings }) {
  const [data, setData] = useState([]);
  useEffect(() => {
    let areaMapping = areas.map((area) => ({ type: area, value: 0 }));
    let categoryMapping = categories.map((category) => ({
      type: category,
      value: 0,
    }));
    let mapping = [];
    console.log(labels);
    labels.forEach(({ label, value }) => {
      let bets = cardAllBettings.filter(({ distributeTime }) =>
        MoreThanSomeTimeAgo(new Date(distributeTime), value)
      );
      console.log(bets);
      bets.forEach((bet) => {
        console.log(bet);
        categoryMapping.find((map) => map.type === bet.category).value +=
          Number(
            bet.ownTokens.reduce(
              (acc, curValue) => Number(acc) + Number(curValue),
              0
            )
          );
        areaMapping.find((map) => map.type === bet.area).value += Number(
          bet.ownTokens.reduce(
            (acc, curValue) => Number(acc) + Number(curValue),
            0
          )
        );
      });
      let maxCategory = Math.max.apply(
        Math,
        categoryMapping.map(({ value }) => value)
      );
      let maxArea = Math.max.apply(
        Math,
        areaMapping.map(({ value }) => value)
      );
      console.log(maxCategory, maxArea);
      mapping.push({
        label: label,
        type: categoryMapping.find(({ value }) => value === maxCategory).type,
        value: maxCategory,
      });
      mapping.push({
        label: label,
        type: areaMapping.find(({ value }) => value === maxArea).type,
        value: maxArea,
      });
      console.log(mapping);
    });
    console.log(mapping);
    setData(mapping);
  }, [cardAllBettings]);

  const MoreThanSomeTimeAgo = (date, num) =>
    moment(date).isBefore(moment().subtract(num, "hours"));
  var config = {
    data: data,
    isGroup: true,
    xField: "value",
    yField: "label",
    seriesField: "type",
    marginRatio: 0,
    label: {
      position: "middle",
      layout: [
        { type: "interval-adjust-position" },
        { type: "interval-hide-overlap" },
        { type: "adjust-color" },
      ],
    },
  };
  return <Bar {...config} />;
}

// var data = [
//   {
//     label: "Mon.",
//     type: "series1",
//     value: 2800,
//   },
//   {
//     label: "Mon.",
//     type: "series2",
//     value: 2260,
//   },
//   {
//     label: "Tues.",
//     type: "series1",
//     value: 1800,
//   },
//   {
//     label: "Tues.",
//     type: "series2",
//     value: 1300,
//   },
//   {
//     label: "Wed.",
//     type: "series1",
//     value: 950,
//   },
//   {
//     label: "Wed.",
//     type: "series2",
//     value: 900,
//   },
//   {
//     label: "Thur.",
//     type: "series1",
//     value: 500,
//   },
//   {
//     label: "Thur.",
//     type: "series2",
//     value: 390,
//   },
//   {
//     label: "Fri.",
//     type: "series1",
//     value: 170,
//   },
//   {
//     label: "Fri.",
//     type: "series2",
//     value: 100,
//   },
// ];
