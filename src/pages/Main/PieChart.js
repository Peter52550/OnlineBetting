import React, { useState, useEffect } from "react";

// components
import { Pie } from "@ant-design/charts";
import { areas } from "../../config";
export default function PieChart({ cardAllBettings }) {
  const [data, setData] = useState([]);
  useEffect(() => {
    let mapping = areas.map((area) => ({ type: area, value: 0 }));
    cardAllBettings.forEach((bet) => {
      mapping.find((map) => map.type === bet.area).value += Number(
        bet.token.reduce((acc, curValue) => Number(acc) + Number(curValue), 0)
      );
    });
    setData(mapping.filter(({ value }) => value > 0));
  }, [cardAllBettings]);
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
