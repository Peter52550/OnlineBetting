import React from "react";

// component
import { Button } from "antd";

export default function TwoButtons({
  first,
  second,
  handleClickFirst,
  handleClickSecond,
}) {
  return (
    <>
      <Button
        type="primary"
        style={{
          position: "fixed",
          paddingTop: "20px",
          paddingBottom: "20px",
          width: "100px",
          marginLeft: "-50px",
          bottom: "64px",
          left: "50%",
          backgroundColor: "#097ac5",
          borderColor: "#097ac5",
          borderRadius: "20px",
          fontSize: "18px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        onClick={handleClickFirst}
      >
        {first}
      </Button>
      <Button
        type="primary"
        style={{
          position: "fixed",
          paddingTop: "20px",
          paddingBottom: "20px",
          width: "100px",
          marginLeft: "-50px",
          bottom: "16px",
          left: "50%",
          backgroundColor: "#097ac5",
          borderColor: "#097ac5",
          borderRadius: "20px",
          fontSize: "18px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        onClick={handleClickSecond}
      >
        {second}
      </Button>
    </>
  );
}
