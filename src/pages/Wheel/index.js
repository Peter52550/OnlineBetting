// import React from "react";
// import ReactDOM from "react-dom";
// import ReactTurntable from "react-turntable";
// import "react-turntable/assets/index.css";
// import styles from "./index.module.css";
// import { message, PageHeader } from "antd";
// import { useHistory } from "react-router-dom";

// const style = {
//   justifyContent: "center",
//   alignContent: "center",
//   display: "flex",
//   marginTop: "7%",
// };
// const prizes = [
//   "Durex",
//   "MI",
//   "Meizu",
//   "iphone 13",
//   "better luck next time",
//   "won 70",
//   "won 10",
//   "better luck next time",
// ];

// const options = {
//   prizes,
//   width: 500,
//   height: 500,
//   primaryColor: "#83AF9B",
//   secondaryColor: "#C8C8A9",
//   fontStyle: {
//     color: "#fff",
//     size: "14px",
//     fontVertical: true,
//     fontWeight: "bold",
//     fontFamily: "Microsoft YaHei",
//   },
//   speed: 1000,
//   duration: 5000,
//   clickText: "Spin",
//   onStart() {
//     //If you want before the rotate do some...
//     console.log("start...");
//     //If you want stop rotate you can return false
//     return true;
//   },
//   onComplete(prize) {
//     console.log("prize:", prize);
//     message.info(`Congratulations!! You won ${prize}`);
//   },
// };
// export default function Wheel() {
//   const history = useHistory();
//   return (
//     <>
//       <PageHeader
//         className={styles.pageheader}
//         onBack={() => history.goBack()}
//         title={
//           <span className={styles.title} onClick={() => history.goBack()}>
//             回到主頁
//           </span>
//         }
//       />
//       <div style={style}>
//         <ReactTurntable {...options} />
//       </div>
//     </>
//   );
// }

import React, { useState, useEffect } from "react";
import { Wheel } from "react-custom-roulette";
import Loading from "../../components/Loading";
import { InfoAPI, AdderAPI } from "../../api";
import { message } from "antd";
import "./wheel.css";
const segments = [
  "Sorry",
  "ByeBye",
  "haha_10",
  "haha_20",
  "haha_50",
  "haha_100",
  "haha_200",
  "Jackpot",
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
const data = [
  {
    option: segments[0],
    style: { backgroundColor: segColors[0], textColor: "black" },
  },
  { option: segments[1], style: { backgroundColor: segColors[1] } },
  {
    option: segments[2],
    style: { backgroundColor: segColors[2], textColor: "black" },
  },
  {
    option: segments[3],
    style: { backgroundColor: segColors[3], textColor: "black" },
  },
  { option: segments[4], style: { backgroundColor: segColors[4] } },
  {
    option: segments[5],
    style: { backgroundColor: segColors[5], textColor: "black" },
  },
  {
    option: segments[6],
    style: { backgroundColor: segColors[6], textColor: "black" },
  },
  { option: segments[7], style: { backgroundColor: segColors[7] } },
];

export default ({ contract, accounts, ownInfo, web3 }) => {
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);
  const [jackPot, setJackPot] = useState("");
  const [loading, setLoading] = useState(true);
  useEffect(async () => {
    let jackPot = await InfoAPI.getJackpot(contract, accounts);
    setJackPot(jackPot);
    setLoading(false);
  });
  const handleSpinClick = async () => {
    if (ownInfo.member === "none") {
      message.info("加入會員才可抽獎喔");
    } else {
      await AdderAPI.spinWheel(contract, accounts, web3);
      let newPrizeNumber = await InfoAPI.getReward(contract, accounts);
      // const newPrizeNumber = Math.floor(Math.random() * data.length);
      setPrizeNumber(newPrizeNumber);
      setMustSpin(true);
    }
  };
  const getReward = async () => {
    message.info(`恭喜您獲得${segments[prizeNumber]}, 您可以至您的錢包查收`);
    setMustSpin(false);
  };
  return (
    <div>
      {loading ? (
        <Loading />
      ) : (
        <div style={{ marginTop: "120px", marginLeft: 500 }}>
          <div class="jackpot">本期特獎：{jackPot}個哈哈幣</div>
          <Wheel
            mustStartSpinning={mustSpin}
            prizeNumber={prizeNumber}
            data={data}
            onStopSpinning={() => {
              getReward();
            }}
            fontSize={15}
            radiusLineWidth={3}
            radiusLineColor={"white"}
            outerBorderColor={"#E176BB"}
          />

          <button class="button7" onClick={handleSpinClick}>
            SPIN
          </button>
        </div>
      )}
    </div>
  );
};

// "better luck next time",
//   "won 70",
//   "won 10",
//   "better luck next time",
//   "won uber eat coupon",
//   "won uber pass",
//   "better luck next time",
//   "won a girlfriend",
