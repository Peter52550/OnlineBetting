import React, { useState, useEffect } from "react";
import moment from "moment";

// components
import { Pie } from "@ant-design/charts";
import { categories } from "../../config";

export default function PieChart({ cardOwnBettings, menuText }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    let datas;
    let mapping = categories.map((category) => ({ type: category, value: 0 }));
    datas = cardOwnBettings.filter(({ lastBetTime }) => {
      if (menuText === "1小時以內") {
        return lessThanSomeTimeAgo(lastBetTime, 1);
      } else if (menuText === "12小時以內") {
        return lessThanSomeTimeAgo(lastBetTime, 12);
      } else if (menuText === "24小時以內") {
        return lessThanSomeTimeAgo(lastBetTime, 24);
      } else {
        return MoreThanSomeTimeAfter(lastBetTime, 24);
      }
    });
    datas.forEach((bet) => {
      mapping.find((map) => map.type === bet.category).value += Number(
        bet.ownTokens.reduce(
          (acc, curValue) => Number(acc) + Number(curValue),
          0
        )
      );
    });
    setData(mapping.filter(({ value }) => value > 0));
  }, [cardOwnBettings, menuText]);

  const lessThanSomeTimeAgo = (date, num) =>
    moment(date).isAfter(moment().subtract(num, "hours"));
  const MoreThanSomeTimeAfter = (date, num) =>
    moment(date).isBefore(moment().subtract(num, "hours"));

  var config = {
    appendPadding: 50,
    data: data,
    angleField: "value",
    colorField: "type",
    radius: 0.8,
    label: {
      type: "outer",
      content: "{name} {percentage}",
    },
    legend: {
      layout: "vertical",
      position: "left",
    },
    interactions: [{ type: "pie-legend-active" }, { type: "element-active" }],
  };
  return <Pie {...config} />;
}

// var data = [
//   {
//     type: "分类一",
//     value: 27,
//   },
//   {
//     type: "分类二",
//     value: 25,
//   },
//   {
//     type: "分类三",
//     value: 18,
//   },
//   {
//     type: "分类四",
//     value: 15,
//   },
//   {
//     type: "分类五",
//     value: 10,
//   },
//   {
//     type: "其他",
//     value: 5,
//   },
// ];
