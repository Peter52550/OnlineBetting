import React from "react";

// css
import "./BetModal.css";

// component
import { Modal as AntModal, Divider } from "antd";
import { CloseOutlined } from "@ant-design/icons";

const Card = (props) => {
  const { bet } = props;
  console.log(bet);
  return (
    <div>
      <div style={{ display: "flex", textAlign: "center" }}>
        <div className="title">{bet.title}</div>
        <div className="big">
          總下注金額:{" "}
          {bet.token.reduce(
            (acc, curValue) => Number(acc) + Number(curValue),
            0
          )}
          /{bet.upperbound}
        </div>
      </div>
      <div className="small">開盤日期: </div>
      <div className="small">
        結束日期: {new Date(bet.lastBetTime).getMonth() + 1}/
        {new Date(bet.lastBetTime).getDate()}
      </div>
    </div>
  );
};

export default function BetModal({
  isModalVisible,
  handleCancel,
  cardOwnBettings,
}) {
  return (
    <AntModal
      visible={isModalVisible}
      onCancel={handleCancel}
      closeIcon={<CloseOutlined className="close-icon" />}
      className="bet-modal"
      title={"全部賭注"}
      footer={null}
    >
      {cardOwnBettings.map((bet) => (
        <>
          <Card bet={bet} />
          <Divider />
        </>
      ))}
    </AntModal>
  );
}
