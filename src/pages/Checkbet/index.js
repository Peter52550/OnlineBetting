import { Typography, PageHeader } from "antd";
import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { ArrowLeftOutlined } from "@ant-design/icons";
import styles from "./index.module.css";
import { Input, Row, Col, Button, Modal } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { InfoAPI, AdderAPI } from "../../api";
export default function CheckBet(props) {
  const {
    handleBettingChange,
    id,
    cardOwnBettings,
    cardAllBettings,
    contract,
    accounts,
    web3,
  } = props;
  const history = useHistory();
  const [token, setToken] = useState([]);
  const [mode, setMode] = useState("");
  const [betInfo, setBetInfo] = useState({});
  const [answer, setAnswer] = useState("");
  const tokenDisable = false;
  useEffect(async () => {
    let bet = cardOwnBettings.find(({ bet_id }) => bet_id === Number(id));
    if (bet === undefined) {
      bet = cardAllBettings.find(({ bet_id }) => bet_id === id);
      if (bet.status === 1) setMode("熱門");
      else setMode("全部");
    } else {
      setMode("自己");
    }
    bet.options = await InfoAPI.getChoices(
      contract,
      accounts,
      bet.bet_id,
      bet.token
    );
    // let token = await contract.methods.getAddressAmount(bet.bet_id).call({
    //   from: accounts[0],
    // });
    // bet.ownTokens = await InfoAPI.getAddressAmounts(
    //   contract,
    //   accounts,
    //   bet.bet_id
    // );

    console.log(bet);
    setBetInfo(bet);
    setToken(Array(bet.options.length));
  }, []);

  const handleBidChange = async (tokenArray) => {
    let bet = betInfo;
    let arr = bet.token;
    tokenArray.map((value, index) => {
      console.log(Number(bet.token[index]), value);
      if (value != null) {
        // bet.token[index] = 1;
        arr[index] = Number(betInfo.token[index]) + Number(value);
        console.log(bet.token[index]);
        bet.ownTokens[index] = Number(betInfo.ownTokens[index]) + Number(value);
      }
    });
    let _ = await AdderAPI.addMoney(
      contract,
      accounts,
      web3,
      betInfo.bet_id,
      betInfo.options,
      tokenArray
    );
    setBetInfo(bet);
    let bettings;
    if (mode === "自己") {
      bettings = cardOwnBettings;
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
  const handleAnswerChange = (e) => {
    let ans = answer;
    ans = e.target.value;
    setAnswer(ans);
  };

  const handleSetAnswer = async () => {
    let _ = await AdderAPI.setAnswer(
      contract,
      accounts,
      betInfo.bet_id,
      betInfo.options.indexOf(answer)
    );
  };
  const handleDistributeMoney = async () => {
    let _ = await AdderAPI.distributeMoney(contract, accounts, betInfo.bet_id);
  };
  const confirm = (func, mode) => {
    let text;
    if (mode === 0) text = "下注嗎??";
    else if (mode === 1) text = "答案嗎??(答案只能由開局者設定喔)~";
    else text = "分發嗎??";
    Modal.confirm({
      title: "Confirm",
      icon: <ExclamationCircleOutlined />,
      content: `確認${text}`,
      okText: "確認",
      cancelText: "取消",
      onOk: func,
      // onOk: () => handleBidChange(token),
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
      <div style={{ marginLeft: 250, fontSize: 30 }}>
        最後下注時間:
        <span style={{ marginLeft: 20, color: "red", fontSize: 25 }}>
          {String(new Date(betInfo.lastBetTime))}
        </span>
      </div>
      <div style={{ marginLeft: 250, fontSize: 30 }}>
        結果公佈時間:
        <span style={{ marginLeft: 20, color: "red", fontSize: 25 }}>
          {String(new Date(betInfo.publishTime))}
        </span>
      </div>
      {Object.keys(betInfo).length !== 0
        ? betInfo.options.map((option, index) => (
            <Row
              className={styles.vertical_spacing}
              style={{ marginLeft: "20%" }}
            >
              <Col span={6} style={{ fontSize: 30, marginLeft: "-180px" }}>
                選項{`${index + 1}`}: {option}
              </Col>
              <Col span={6} style={{ fontSize: 30, marginLeft: "-100px" }}>
                總下賭金額 : {betInfo.token[index]}
              </Col>
              <Col span={4} style={{ fontSize: 30, marginLeft: "-60px" }}>
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
              <Col span={6} style={{ fontSize: 30, marginLeft: 20 }}>
                自己下注金額: {betInfo.ownTokens[index]}
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
          onClick={() => confirm(() => handleBidChange(token), 0)}
        >
          Bid
        </Button>
      ) : (
        ""
      )}
      <Row className={styles.vertical_spacing} style={{ marginLeft: "30%" }}>
        <Col span={12} style={{ display: "flex" }}>
          <Button
            style={{ marginRight: 20, marginTop: 7 }}
            onClick={() => confirm(() => handleSetAnswer(), 1)}
          >
            設定答案:
          </Button>
          <Input
            className={styles.input}
            placeholder="請輸入答案"
            size="large"
            value={answer}
            // disabled={betInfo.publishTime < Date.now()}
            disabled={false}
            onChange={(e) => handleAnswerChange(e)}
          />
          <Button
            style={{ marginLeft: 20, marginTop: 7 }}
            onClick={() => confirm(() => handleDistributeMoney(), 2)}
            // onClick={handleDistributeMoney}
          >
            分發錢錢
          </Button>
        </Col>
      </Row>
    </div>
  );
}
