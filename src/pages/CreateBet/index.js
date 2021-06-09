import React, { useState } from "react";
// router
import { useHistory } from "react-router-dom";
// css
import styles from "./index.module.css";
import { Modal, Row, Alert } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
// import AntDialog from "../../components/modal"
// components
// import Title from "./Title";
import moment from "moment";
import BetInfo from "./BetInfo";
// import MobilepayList from "./MobilepayList";
const dateFormat = "YYYY-MM-DD HH:mm:ss";
const ReachableContext = React.createContext();
export default function CreateBetPage({
  createBet,
  publishTime = Date.now(),
  lastBetTime = Date.now(),
  TitleName = "",
}) {
  const history = useHistory();
  const index = 44444;
  const handleBet = () => {
    createBet({
      formTitleName: formTitleName,
      formLowerBound: formLowerBound,
      formUpperBound: formUpperBound,
      formPublishTime: formPublishTime,
      formLastBetTime: formLastBetTime,
      formBetType: formBetType,
      formBetOptions: formBetOptions.filter((option) => option !== ""),
    });
    history.push("/home");
  };
  const [formTitleName, setFormTitleName] = useState(TitleName);
  const [formLowerBound, setFormLowerBound] = useState();
  const [formUpperBound, setFormUpperBound] = useState();
  const [formPublishTime, setFormPublishTime] = useState(publishTime);
  const [formLastBetTime, setFormLastBetTime] = useState(lastBetTime);
  const [formBetType, setFormBetType] = useState("");
  const [formBetOptions, setFormBetOptions] = useState([""]);
  const [allSet, setAllSet] = useState(true);
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
  console.log(formLowerBound, formUpperBound, formPublishTime, formLastBetTime);
  const handleBetTypeChange = (e) => setFormBetType(e.target.value);
  const handleBetOptionsChange = (e, i) => {
    let newOptions = [...formBetOptions];
    newOptions[i] = e.target.value;
    setFormBetOptions(newOptions);
  };
  const addClick = () => {
    setFormBetOptions([...formBetOptions, ""]);
  };
  const removeClick = (i) => {
    setFormBetOptions(formBetOptions.filter((option, index) => index !== i));
  };

  const handleConfirm = () => {
    if (
      formTitleName &&
      formLowerBound &&
      formUpperBound &&
      formPublishTime &&
      formLastBetTime &&
      formBetType &&
      formBetOptions
    ) {
      setAllSet(true);
      Modal.confirm({
        title: "Confirm",
        icon: <ExclamationCircleOutlined />,
        content: "確認發布嗎？？",
        okText: "確認",
        cancelText: "取消",
        onOk: () => handleBet(),
      });
    } else {
      setAllSet(false);
      setTimeout(() => {
        setAllSet(true);
      }, 2000);
    }
  };
  return (
    <div style={{ backgroundColor: "#fdfdfd" }}>
      {!allSet ? (
        <Alert message="你有些東西沒填喔" type="error" showIcon />
      ) : (
        ""
      )}
      <BetInfo
        formTitleName={formTitleName}
        formLowerBound={formLowerBound}
        formUpperBoundBound={formUpperBound}
        formPublishTime={formPublishTime}
        formLastBetTime={formLastBetTime}
        formBetType={formBetType}
        formBetOptions={formBetOptions}
        handleTitleNameChange={handleTitleNameChange}
        handleLowerBoundChange={handleLowerBoundChange}
        handleUpperBoundChange={handleUpperBoundChange}
        handlePublishTimeChange={handlePublishTimeChange}
        handleLastBetTimeChange={handleLastBetTimeChange}
        handleBetTypeChange={handleBetTypeChange}
        handleBetOptionsChange={handleBetOptionsChange}
        addClick={addClick}
        removeClick={removeClick}
      />
      <Row className={styles.blank} />
      <button className={styles.trackBtn} onClick={handleConfirm}>
        <div>發布賭局</div>
      </button>
    </div>
  );
}
