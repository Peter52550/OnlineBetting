import { Typography, PageHeader } from "antd";
import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { ArrowLeftOutlined } from "@ant-design/icons";
import styles from "./index.module.css";
import { Input, Row, Col, Button, Modal } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
export default function CheckBet(props) {
  const {
    handleBettingChange,
    id,
    cardUserBettings,
    cardOwnBettings,
    cardAllBettings,
  } = props;
  const history = useHistory();
  const [token, setToken] = useState([]);
  const [mode, setMode] = useState("");
  const [betInfo, setBetInfo] = useState({});
  console.log(cardAllBettings);
  const tokenDisable = false;
  useEffect(() => {
    let bet = cardOwnBettings.find(({ bet_id }) => bet_id === Number(id));
    if (bet === undefined) {
      bet = cardAllBettings.find(({ bet_id }) => bet_id === id);
      if (bet.status === 1) setMode("熱門");
      else setMode("全部");
    } else {
      setMode("自己");
    }
    setBetInfo(bet);
    setToken(Array(bet.options.length));
  }, []);

  const handleBidChange = (tokenArray) => {
    let bet = betInfo;
    tokenArray.map((value, index) => {
      if (value != null) {
        bet.token[index] = Number(bet.token[index]) + Number(value);
      }
    });
    setBetInfo(bet);
    let bettings;
    if (mode === "自己") {
      bettings = cardOwnBettings;
    } else if (mode === "熱門") {
      bettings = cardUserBettings;
    } else {
      bettings = cardAllBettings;
    }
    bettings = bettings.filter(({ bet_id }) => Number(bet_id) !== Number(id));
    bettings.unshift(bet);
    handleBettingChange(bettings, mode);
    setToken(Array(betInfo.options.length).fill(""));
  };
  const handleTokenChange = (e, i) => {
    let newToken = [...token];
    newToken[i] = e.target.value;
    setToken(newToken);
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
      {Object.keys(betInfo).length !== 0 ? (
        <div style={{ marginLeft: 550, fontSize: 30 }}>
          目前總下賭金額：
          {betInfo.token.reduce((acc, curValue) => acc + curValue, 0)}
        </div>
      ) : (
        ""
      )}
      <div style={{ marginLeft: 550, fontSize: 30 }}>
        上限金額：{betInfo.upperbound}
      </div>

      {Object.keys(betInfo).length !== 0
        ? betInfo.options.map((option, index) => (
            <Row
              className={styles.vertical_spacing}
              style={{ marginLeft: "20%" }}
            >
              <Col span={6} style={{ fontSize: 30 }}>
                選項{`${index + 1}`}: {option}
              </Col>
              <Col span={6} style={{ fontSize: 30 }}>
                總下賭金額 : {betInfo.token[index]}
              </Col>
              <Col span={4} style={{ fontSize: 30 }}>
                下注金額{" "}
              </Col>
              <Col span={6}>
                <Input
                  className={styles.input}
                  placeholder="請輸入下注金額"
                  size="large"
                  value={token[index]}
                  disabled={tokenDisable}
                  onChange={(e) => handleTokenChange(e, index)}
                />
              </Col>
            </Row>
          ))
        : ""}
      {Object.keys(betInfo).length !== 0 ? (
        <Button
          className={styles.bidbutton}
          disabled={
            Number(
              token
                .flat(0)
                .filter((t) => t != null)
                .reduce((acc, curValue) => Number(acc) + Number(curValue), 0)
            ) < Number(betInfo.lowerbound) ||
            // !Number(token[index]) ||
            Number(
              token
                .flat(0)
                .filter((t) => t != null)
                .reduce((acc, curValue) => Number(acc) + Number(curValue), 0)
            ) +
              Number(
                betInfo.token.reduce(
                  (acc, curValue) => Number(acc) + Number(curValue),
                  0
                )
              ) >
              Number(betInfo.upperbound)
          }
          onClick={() => confirm()}
        >
          Bid
        </Button>
      ) : (
        ""
      )}
    </div>
  );
}
