// import React, { useState } from "react";
// import { Wheel } from "react-custom-roulette";
// import Title from "./Title";
// import "./wheel.css";
// const segments = [
//   "better luck next time",
//   "won 70",
//   "won 10",
//   "better luck next time",
//   "won uber eat coupon",
//   "won uber pass",
//   "better luck next time",
//   "won a girlfriend",
// ];
// const segColors = [
//   "#EE4040",
//   "#F0CF50",
//   "#815CD1",
//   "#3DA5E0",
//   "#34A24F",
//   "#F9AA1F",
//   "#EC3F3F",
//   "#FF9000",
// ];
// const data = [
//   {
//     option: segments[0],
//     style: { backgroundColor: segColors[0], textColor: "black" },
//   },
//   { option: segments[1], style: { backgroundColor: segColors[1] } },
//   {
//     option: segments[2],
//     style: { backgroundColor: segColors[2], textColor: "black" },
//   },
//   {
//     option: segments[3],
//     style: { backgroundColor: segColors[3], textColor: "black" },
//   },
//   { option: segments[4], style: { backgroundColor: segColors[4] } },
//   {
//     option: segments[5],
//     style: { backgroundColor: segColors[5], textColor: "black" },
//   },
//   {
//     option: segments[6],
//     style: { backgroundColor: segColors[6], textColor: "black" },
//   },
//   { option: segments[7], style: { backgroundColor: segColors[7] } },
// ];

// export default () => {
//   const [mustSpin, setMustSpin] = useState(false);
//   const [prizeNumber, setPrizeNumber] = useState(0);

//   const handleSpinClick = () => {
//     const newPrizeNumber = Math.floor(Math.random() * data.length);
//     setPrizeNumber(newPrizeNumber);
//     setMustSpin(true);
//   };

//   return (
//     <div
//       // style={{
//       //   position: "absolute",
//       //   top: "5%",
//       //   left: "33%",
//       //   height: "200%",
//       //   // transform: "translate(-50%, -50%)",
//       // }}
//       class="back"
//     >
//       <Title />
//       <div style={{ marginTop: "-30px", marginRight: 30 }}>
//         <Wheel
//           mustStartSpinning={mustSpin}
//           prizeNumber={prizeNumber}
//           data={data}
//           onStopSpinning={() => {
//             setMustSpin(false);
//           }}
//           fontSize={15}
//           radiusLineWidth={3}
//           radiusLineColor={"white"}
//           outerBorderColor={"#E176BB"}
//         />

//         <button class="button7" onClick={handleSpinClick}>
//           SPIN
//         </button>
//       </div>
//     </div>
//   );
// };
