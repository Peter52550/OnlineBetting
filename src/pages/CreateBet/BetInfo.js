import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import moment from "moment";
import clsx from "clsx";
// css
import styles from "./Info.module.css";
// component
import { Typography, PageHeader } from "antd";
// import TwoButtons from "./TwoButtons";
import BetForm from "./BetForm";

const dateFormat = "YYYY-MM-DD HH:mm:ss";
const { Title } = Typography;

/**
 * handle add form step, flow, button
 */
export default function BetInfo({
  formTitleName,
  formLowerBound,
  formUpperBound,
  formPublishTime,
  formLastBetTime,
  formBetType,
  formBetOptions,
  handleTitleNameChange,
  handleLowerBoundChange,
  handleUpperBoundChange,
  handlePublishTimeChange,
  handleLastBetTimeChange,
  handleBetTypeChange,
  handleBetOptionsChange,
  addClick,
  removeClick,
}) {
  const history = useHistory();
  // data control

  // flow control
  const [step, setStep] = useState(1);
  const handleNextStep = () => {
    // TODO: check card_id  must exist
    setStep(2);
  };
  const handlePreviousStep = () => setStep(1);
  const handleAddToPending = () => {
    // TODO
  };
  const handleFinish = () => {
    // TODO
  };
  return (
    <div>
      <div>
        <PageHeader
          className={styles.pageheader}
          onBack={() => history.goBack()}
          title={<span className={styles.title}>我要賭博</span>}
        />
        <BetForm
          formTitleName={formTitleName}
          formLowerBound={formLowerBound}
          formUpperBound={formUpperBound}
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
      </div>
    </div>
  );
}
