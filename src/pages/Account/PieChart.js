import React from "react";

// components
import { Pie } from "@ant-design/charts";

export default function PieChart() {
  var data = [
    {
      type: "分类一",
      value: 27,
    },
    {
      type: "分类二",
      value: 25,
    },
    {
      type: "分类三",
      value: 18,
    },
    {
      type: "分类四",
      value: 15,
    },
    {
      type: "分类五",
      value: 10,
    },
    {
      type: "其他",
      value: 5,
    },
  ];
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
