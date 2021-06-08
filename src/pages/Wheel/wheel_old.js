import { useEffect, useState } from "react";
import WheelComponent from "react-wheel-of-prizes";
import "react-wheel-of-prizes/dist/index.css";

export default function Wheel_old() {
  const segments = [
    "better luck next time",
    "won 70",
    "won 10",
    "better luck next time",
    "won uber eat coupon",
    "won uber pass",
    "better luck next time",
    "won a girlfriend",
  ];
  const segColors = [
    "#EE4040",
    "#F0CF50",
    "#815CD1",
    "#3DA5E0",
    "#34A24F",
    "#F9AA1F",
    "#EC3F3F",
    "#FF9000",
  ];
  const onFinished = (winner) => {
    console.log(winner);
  };
  return (
    <div
      style={{
        position: "absolute",
        top: "10%",
        left: "28%",
        // transform: "translate(-50%, -50%)",
      }}
    >
      <WheelComponent
        segments={segments}
        segColors={segColors}
        winningSegment="won 10"
        onFinished={(winner) => onFinished(winner)}
        primaryColor="black"
        contrastColor="white"
        buttonText="Spin"
        isOnlyOnce={false}
        size={290}
        upDuration={1000}
        downDuration={3000}
        fontFamily="Arial"
      />
    </div>
  );
}
