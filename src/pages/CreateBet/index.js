import React, { useState } from "react";
import moment from "moment";

// router
import { useHistory } from "react-router-dom";

// css
import styles from "./index.module.css";

// components
import BetInfo from "./BetInfo";
import { Modal, Row, Alert, message } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";

// config
import { memberships } from "../../config";

const dateFormat = "YYYY-MM-DD HH:mm:ss";
const ReachableContext = React.createContext();
export default function CreateBetPage({
  createBet,
  publishTime = Date.now(),
  lastBetTime = Date.now(),
  TitleName = "",
  ownInfo,
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
      formArea: formArea,
      formCategory: formCategory,
      formBetType: formBetType,
      formBetOptions: formBetOptions.filter((option) => option !== ""),
    });
  };
  const [formTitleName, setFormTitleName] = useState(TitleName);
  const [formLowerBound, setFormLowerBound] = useState();
  const [formUpperBound, setFormUpperBound] = useState();
  const [formPublishTime, setFormPublishTime] = useState(publishTime);
  const [formLastBetTime, setFormLastBetTime] = useState(lastBetTime);
  const [formArea, setFormArea] = useState("");
  const [formCategory, setFormCategory] = useState("");
  const [formBetType, setFormBetType] = useState("");
  const [formBetOptions, setFormBetOptions] = useState(["", ""]);

  const [allSet, setAllSet] = useState(true);
  const handleTitleNameChange = (e) => setFormTitleName(e.target.value);
  const handleLowerBoundChange = (val) => setFormLowerBound(val);
  const handleUpperBoundChange = (val) => {
    if (formUpperBound > memberships[ownInfo["member"]].upperbound) {
      message.info(
        `${memberships[ownInfo["member"]].tooltip}的最高上限是${
          memberships[ownInfo["member"]].upperbound
        }喔!`
      );
    }
    setFormUpperBound(val);
  };
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
  const handleAreaChange = (val) => {
    setFormArea(val);
  };
  const handleCategoryChange = (val) => {
    setFormCategory(val);
  };
  const handleBetTypeChange = (e) => {
    if (e === "是非") {
      setFormBetType("trueFalse");
      if (formBetOptions.length > 2) {
        setFormBetOptions(formBetOptions.slice(0, -1));
      }
    } else setFormBetType("multipleChoice");
  };
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
      formArea &&
      formCategory &&
      formBetType &&
      formBetOptions
    ) {
      if (formUpperBound > memberships[ownInfo["member"]].upperbound) {
        message.info("再檢查一下上限喔");
      } else {
        setAllSet(true);
        Modal.confirm({
          title: "Confirm",
          icon: <ExclamationCircleOutlined />,
          content: "確認發布嗎？？",
          okText: "確認",
          cancelText: "取消",
          onOk: () => handleBet(),
        });
      }
    } else {
      message.info("有東西漏掉喔");
      setAllSet(false);
      setTimeout(() => {
        setAllSet(true);
      }, 2000);
    }
  };
  return (
    <div className={styles.container}>
      <BetInfo
        formTitleName={formTitleName}
        formLowerBound={formLowerBound}
        formUpperBoundBound={formUpperBound}
        formPublishTime={formPublishTime}
        formLastBetTime={formLastBetTime}
        formArea={formArea}
        formCategory={formCategory}
        formBetType={formBetType}
        formBetOptions={formBetOptions}
        handleTitleNameChange={handleTitleNameChange}
        handleLowerBoundChange={handleLowerBoundChange}
        handleUpperBoundChange={handleUpperBoundChange}
        handlePublishTimeChange={handlePublishTimeChange}
        handleLastBetTimeChange={handleLastBetTimeChange}
        handleAreaChange={handleAreaChange}
        handleCategoryChange={handleCategoryChange}
        handleBetTypeChange={handleBetTypeChange}
        handleBetOptionsChange={handleBetOptionsChange}
        addClick={addClick}
        removeClick={removeClick}
      />
      {ownInfo.member === "none" ? (
        ""
      ) : (
        <button className={styles.btnThree} onClick={handleConfirm}>
          <div>發布賭局</div>
        </button>
      )}
      <button className={styles.btnThree} onClick={() => history.goBack()}>
        <div>返回</div>
      </button>
      <Row className={styles.blank} />
    </div>
  );
}
