import React, { useState, useEffect } from "react";

// router
import { useHistory } from "react-router-dom";

// css
import styles from "./index.module.css";

//components
import {
  ArrowLeftOutlined,
  MoneyCollectOutlined,
  SkypeOutlined,
  PaperClipOutlined,
  SettingOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import {
  Col,
  Input,
  Button,
  Modal,
  Divider,
  Row,
  message as AntMessage,
} from "antd";
import Loading from "../../components/Loading";
import Timer from "./Timer";

// icons
import ChatBubbleIcon from "@material-ui/icons/ChatBubble";
import LocationOnIcon from "@material-ui/icons/LocationOn";
import LabelIcon from "@material-ui/icons/Label";

// api
import { InfoAPI, AdderAPI } from "../../api";

// config
import { comments } from "../../config";

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
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const tokenDisable = false;
  useEffect(async () => {
    let bet = cardOwnBettings.find(({ bet_id }) => bet_id === Number(id));
    if (bet === undefined) {
      bet = cardAllBettings.find(({ bet_id }) => bet_id === Number(id));
      if (bet.status === 1) setMode("熱門");
      else setMode("全部");
    } else {
      setMode("自己");
    }
    let coms = await InfoAPI.getComments(contract, web3, id);
    console.log(coms);
    console.log(bet);
    setBetInfo(bet);
    setToken(Array(bet.options.length));
    setLoading(false);
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
  const handleAnswerChange = (op) => {
    let ans = answer;
    ans = op;
    setAnswer(ans);
  };
  const handleSetAnswer = async () => {
    let _ = await AdderAPI.setAnswer(
      contract,
      accounts,
      betInfo.bet_id,
      betInfo.options.indexOf(answer)
    );
    let e = await AdderAPI.distributeMoney(contract, accounts, betInfo.bet_id);
  };
  // const handleDistributeMoney = async () => {

  // };
  const confirm = (func, mode) => {
    let text;
    if (mode === 0) text = "下注嗎??";
    else if (mode === 1)
      text = "答案嗎??(答案只能由開局者設定喔)~確認答案後將直接分發賭金";
    else if (mode === 2) text = "發佈嗎?";
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

  const handleMessage = (e) => {
    setMessage(e.target.value);
  };
  const addComment = async (e) => {
    await AdderAPI.addComment(contract, accounts, id, message);
    let bet = betInfo;
    bet.comments.push(message);
    setBetInfo(bet);
    let bettings;
    if (mode === "自己") {
      bettings = [
        bet,
        ...cardOwnBettings.filter(
          ({ bet_id }) => Number(bet_id) !== Number(id)
        ),
      ];

      handleBettingChange(bettings);
    } else if (mode === "熱門") {
      bettings = [
        bet,
        ...cardAllBettings.filter(
          ({ bet_id }) => Number(bet_id) !== Number(id)
        ),
      ];
      handleBettingChange(bettings);
    }
    console.log(bettings);
    setMessage("");
    AntMessage.info("發佈成功!");
  };
  console.log(
    Number(betInfo.lastBetTime),
    Date.now(),
    Number(betInfo.lastBetTime) > Date.now()
  );
  return loading ? (
    <div>
      <Loading />
    </div>
  ) : (
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
        <div className={styles.text}>回到主頁</div>
      </div>
      <div style={{ paddingLeft: "10%" }}>
        <div className={styles.title}>賭局標題：{betInfo.title}</div>
        <div style={{ display: "flex", width: "50%" }}>
          <div className={styles.miconWrapper}>
            <LocationOnIcon style={{ fontSize: "28px", color: "#B10DC9" }} />
            <div className={styles.micon_word}>{betInfo.area}</div>
          </div>
          <div className={styles.miconWrapper}>
            <LabelIcon style={{ fontSize: "28px", color: "#B10DC9" }} />
            <div className={styles.micon_word}>{betInfo.category}</div>
          </div>
        </div>
        <Divider />
        <div style={{ display: "flex" }}>
          <div>
            <div className={styles.iconWrapper}>
              <MoneyCollectOutlined className={styles.icon} />
              <div className={styles.icon_word}>
                每次下注最小金額：{betInfo.lowerbound}
              </div>
            </div>
            <div className={styles.iconWrapper}>
              <SkypeOutlined className={styles.icon} />
              {Object.keys(betInfo).length !== 0 ? (
                <div className={styles.icon_word}>
                  目前總下賭金額：
                  {betInfo.token.reduce((acc, curValue) => acc + curValue, 0)}
                </div>
              ) : (
                ""
              )}
            </div>
            <div className={styles.iconWrapper}>
              <PaperClipOutlined className={styles.icon} />
              <div className={styles.icon_word}>
                上限金額：{betInfo.upperbound}
              </div>
            </div>
          </div>
          <div className={styles.paper}>
            <div className={styles.paperTitle}>最後下注時間</div>
            <Timer text={"Sorry..."} waitTime={betInfo.lastBetTime} />
            <div className={styles.paperTitle}>結果公佈時間</div>
            <Timer text={"Nice!!"} waitTime={betInfo.publishTime} />
          </div>
        </div>
        <Divider />
        <div style={{ display: "flex" }}>
          <div className={styles.title}>下注</div>
          {Object.keys(betInfo).length !== 0 &&
          Number(betInfo.lastBetTime) > Number(Date.now()) ? (
            <Button
              className={styles.bidbutton}
              disabled={
                Number(
                  token
                    .flat(0)
                    .filter((t) => t != null)
                    .reduce(
                      (acc, curValue) => Number(acc) + Number(curValue),
                      0
                    )
                ) < Number(betInfo.lowerbound) ||
                // !Number(token[index]) ||
                Number(
                  token
                    .flat(0)
                    .filter((t) => t != null)
                    .reduce(
                      (acc, curValue) => Number(acc) + Number(curValue),
                      0
                    )
                ) +
                  Number(
                    betInfo.token.reduce(
                      (acc, curValue) => Number(acc) + Number(curValue),
                      0
                    )
                  ) >
                  Number(betInfo.upperbound) ||
                betInfo.lastBetTime < Date.now()
              }
              onClick={() => confirm(() => handleBidChange(token), 0)}
            >
              Bid
            </Button>
          ) : (
            ""
          )}
          {Number(betInfo.publishTime) < Number(Date.now()) ? (
            <Button
              className={styles.bidbutton}
              onClick={() => confirm(() => handleSetAnswer(), 1)}
              disabled={betInfo.publishTime > Date.now()}
            >
              設定答案
            </Button>
          ) : (
            ""
          )}
          {Number(betInfo.publishTime) < Number(Date.now()) ? (
            <div className={styles.comment}>
              可以點選每個選項左邊的icon做為答案喔~
            </div>
          ) : (
            ""
          )}
        </div>
        {Object.keys(betInfo).length !== 0
          ? betInfo.options.map((option, index) => (
              <div className={styles.iconWrapper}>
                <SettingOutlined
                  className={styles.icon}
                  onClick={() => handleAnswerChange(option)}
                  style={{
                    color:
                      betInfo.publishTime < Date.now() && answer === option
                        ? "red"
                        : "black",
                    cursor:
                      betInfo.publishTime < Date.now() && answer === option
                        ? "pointer"
                        : "auto",
                  }}
                />
                <div className={styles.icon_word}>
                  選項{`${index + 1}`}: {option}
                </div>
                <div className={styles.icon_word} style={{ marginLeft: 32 }}>
                  總下賭金額 : {betInfo.token[index]}
                </div>
                <div className={styles.icon_word} style={{ marginLeft: 32 }}>
                  自己下注金額: {betInfo.ownTokens[index]}
                </div>
                <Col span={6}>
                  <Input
                    className={styles.input}
                    placeholder="請輸入下注金額"
                    size="large"
                    bordered={false}
                    value={token[index]}
                    disabled={Number(betInfo.lastBetTime) < Number(Date.now())}
                    onChange={(e) => handleTokenChange(e, index)}
                  />
                </Col>
              </div>
            ))
          : ""}
        <Divider />
        <div>
          <div className={styles.title}>評價</div>
          <Row>
            <Col span={15}>
              <Input
                className={styles.input}
                placeholder="留下您的評論吧"
                size="large"
                value={message}
                // disabled={Number(betInfo.lastBetTime) < Number(Date.now())}
                onChange={(e) => handleMessage(e)}
              />
            </Col>
            <Button
              className={styles.button}
              onClick={() => confirm(() => addComment(), 2)}
              disabled={message === ""}
            >
              發布
            </Button>
          </Row>
          {betInfo.comments.map((comment) => (
            <div className={styles.messageWrapper}>
              <div style={{ marginRight: 8 }}>
                <ChatBubbleIcon style={{ fontSize: 32 }} />
              </div>
              <div className={styles.message}>{comment}</div>
            </div>
          ))}
        </div>
        <br />
        <br />
        <br />
        <br />
        {/*<Row className={styles.vertical_spacing} style={{ marginLeft: "30%" }}>
          <Col span={12} style={{ display: "flex" }}>
            <Input
              className={styles.input}
              placeholder="請輸入答案"
              size="large"
              value={answer}
              disabled={betInfo.publishTime > Date.now()}
              // disabled={false}
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
        </Row>*/}
      </div>
    </div>
  );
}
