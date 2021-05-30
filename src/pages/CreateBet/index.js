import React, { useState } from "react";
// router
import { useHistory } from "react-router-dom";
// css
import styles from "./index.module.css";
// components
// import Title from "./Title";
import moment from "moment";
import BetInfo from "./BetInfo";
// import MobilepayList from "./MobilepayList";
const dateFormat = "YYYY-MM-DD HH:mm:ss";
export default function CreateBetPage({
  createBet,
  amount = "",
  publishTime = Date.now(),
  lastBetTime = Date.now(),
  TitleName = "",
}) {
  const history = useHistory();
  //   const titleConfig = testTitle;
  //   const cards = testCards;
  //   const others = testOthers;
  const index = 44444;
  const handleBet = () => {
    createBet({
      formTitleName: formTitleName,
      formLowerBound: formLowerBound,
      formUpperBound: formUpperBound,
      formPublishTime: formPublishTime,
      formLastBetTime: formLastBetTime,
    });
    history.push("/");
  };
  const [formTitleName, setFormTitleName] = useState(TitleName);
  const [formLowerBound, setFormLowerBound] = useState();
  const [formUpperBound, setFormUpperBound] = useState();
  const [formPublishTime, setFormPublishTime] = useState(publishTime);
  const [formLastBetTime, setFormLastBetTime] = useState(lastBetTime);
  const handleTitleNameChange = (e) => setFormTitleName(e.target.value);
  const handleLowerBoundChange = (val) => setFormLowerBound(val);
  const handleUpperBoundChange = (val) => setFormUpperBound(val);
  const handlePublishTimeChange = (publishTime, publishTimeString) => {
    setFormPublishTime(
      parseInt(moment(publishTimeString, dateFormat).format("x"))
    );
  };
  const handleLastBetTimeChange = (lastBetTime, lastBetTimeString) => {
    setFormLastBetTime(
      parseInt(moment(lastBetTimeString, dateFormat).format("x"))
    );
  };
  return (
    <div style={{ backgroundColor: "#fdfdfd" }}>
      <BetInfo
        formTitleName={formTitleName}
        formLowerBound={formLowerBound}
        formUpperBoundBound={formUpperBound}
        formPublishTime={formPublishTime}
        formLastBetTime={formLastBetTime}
        handleTitleNameChange={handleTitleNameChange}
        handleLowerBoundChange={handleLowerBoundChange}
        handleUpperBoundChange={handleUpperBoundChange}
        handlePublishTimeChange={handlePublishTimeChange}
        handleLastBetTimeChange={handleLastBetTimeChange}
      />
      <button className={styles.trackBtn} onClick={handleBet}>
        <div>發布賭局</div>
      </button>
    </div>
  );
}
