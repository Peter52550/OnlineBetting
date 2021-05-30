import { Typography, PageHeader } from "antd";
import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { ArrowLeftOutlined } from "@ant-design/icons";
import styles from "./index.module.css";
import { Input, Row, Col, Button, Modal } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
export default function CheckBet(props) {
  const { handleBettingChange, id, cardUserBettings, cardOwnBettings } = props;
  const history = useHistory();
  const [token, setToken] = useState();
  const [mode, setMode] = useState("");
  const [betInfo, setBetInfo] = useState({});
  const tokenDisable = false;
  useEffect(() => {
    let bet = cardOwnBettings.find(({ bet_id }) => bet_id === Number(id));
    if (bet === undefined) {
      bet = cardUserBettings.find(({ bet_id }) => bet_id === id);
      setMode("熱門");
    } else {
      setMode("自己");
    }
    setBetInfo(bet);
  }, []);

  const handleBidChange = (value) => {
    let bet = betInfo;
    bet.token = Number(betInfo.token) + Number(value);
    setBetInfo(bet);
    let bettings;
    if (mode === "自己") {
      bettings = cardOwnBettings;
    } else {
      bettings = cardUserBettings;
    }
    bettings = bettings.filter(({ bet_id }) => bet_id !== Number(id));
    bettings.unshift(bet);
    handleBettingChange(bettings, mode);
    setToken();
  };
  const handleTokenChange = (e) => {
    setToken(e.target.value);
  };

  const confirm = () => {
    Modal.confirm({
      title: "Confirm",
      icon: <ExclamationCircleOutlined />,
      content: "確認下注嗎？？",
      okText: "確認",
      cancelText: "取消",
      onOk: () => handleBidChange(token),
    });
  };
  return (
    <div>
      <div
        style={{ marginLeft: 20, width: "300px", display: "flex" }}
        onClick={() => history.goBack()}
      >
        <ArrowLeftOutlined
          style={{ fontSize: "30px", color: "#08c" }}
          //   theme="outlined"
          className={styles.arrow}
        />
        <div className={styles.text}>查看賭博</div>
      </div>
      <div style={{ marginLeft: 550, fontSize: 30 }}>
        賭局標題：{betInfo.title}
      </div>
      <div style={{ marginLeft: 550, fontSize: 30 }}>
        每次下注最小金額：{betInfo.lowerbound}
      </div>
      <div style={{ marginLeft: 550, fontSize: 30 }}>
        目前下賭金額：{betInfo.token}
      </div>
      <div style={{ marginLeft: 550, fontSize: 30 }}>
        上限金額：{betInfo.upperbound}
      </div>
      <Row className={styles.vertical_spacing}>
        <Col span={4} style={{ fontSize: 30 }}>
          下注金額{" "}
        </Col>
        <Col span={8}>
          <Input
            className={styles.input}
            placeholder="請輸入下注金額"
            size="large"
            value={token}
            disabled={tokenDisable}
            onChange={handleTokenChange}
          />
        </Col>
      </Row>
      <Button
        className={styles.bidbutton}
        disabled={
          token < betInfo.lowerbound ||
          !token ||
          Number(betInfo.token) + Number(token) > Number(betInfo.upperbound)
        }
        onClick={confirm}
      >
        Bid
      </Button>
    </div>
  );
}
