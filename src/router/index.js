import React, { useState, useEffect } from "react";

import getWeb3 from "../utils/getWeb3";

import OnlineBetting from "../build/contracts/OnlineBetting.json";
// react-router
import { BrowserRouter, Switch, Route } from "react-router-dom";
// pages
import MainPage from "../pages/Main";
import CreateBetPage from "../pages/CreateBet";
import CheckBetPage from "../pages/Checkbet";
import WheelPage from "../pages/Wheel";
import paths from "./path";
// import AddAccountRecord from "../pages/AddAccountRecord";
// import AccountRecords from "../pages/AccountRecords";
// logic
// import { init, authState } from "../slices/authSlice";
const cardUserBetting = [
  {
    user_id: "ahf8we7fojewo",
    bet_id: "77777",
    title: "明天確診人數會破600嗎",
    lowerbound: 10,
    token: [20, 3],
    upperbound: 100,
    publishTime: "2021-05-30 00:56:30",
    lastBetTime: "2021-05-30 00:56:30",
    betType: "trueFalse",
    options: [true, false],
    status: 1,
  },
  {
    user_id: "shfi69wefo0021",
    bet_id: "88888",
    title: "下一任台北4漲",
    lowerbound: 0,
    token: [60, 20, 2],
    upperbound: 100,
    publishTime: "2021-05-30 00:56:30",
    lastBetTime: "2021-05-30 00:56:30",
    betType: "multipleChoice",
    options: ["雞排妹", "柯p", "冰鳥"],
    status: 1,
  },
];
const publicCards = [
  ...cardUserBetting,
  {
    user_id: "ahf8we7fojewo",
    bet_id: "444",
    title: "我明天會吃得到炸雞嗎",
    lowerbound: 10,
    token: [20, 3],
    upperbound: 100,
    publishTime: "2021-05-30 00:56:30",
    lastBetTime: "2021-05-30 00:56:30",
    betType: "trueFalse",
    options: ["會", "不會"],
    status: 2,
  },
  {
    user_id: "shfi69wefo0021",
    bet_id: "11111",
    title: "什麼時候可以出去玩啊QQ",
    lowerbound: 0,
    token: [60, 20, 2],
    upperbound: 100,
    publishTime: "2021-05-30 00:56:30",
    lastBetTime: "2021-05-30 00:56:30",
    betType: "multipleChoice",
    options: ["等一下", "你沒有妹妹", "再等一百年"],
    status: 2,
  },
];
console.log(paths);
export default function Router(props) {
  //   const dispatch = useDispatch();
  //   const { isInit } = useSelector(authState);
  //   useEffect(() => {
  //     dispatch(init());
  //   }, []);
  const [id, setId] = useState(99999);
  const [cardOwnBettings, setCardOwnBettings] = useState([]);
  const [cardUserBettings, setCardUserBettings] = useState(cardUserBetting);
  const [cardAllBets, setCardAllBets] = useState([]);
  const [cardAllBettings, setCardAllBettings] = useState(publicCards);
  const [web3, setWeb3] = useState(null);
  const [accounts, setAccounts] = useState(null);
  const [contract, setContract] = useState(null);
  const createBet = async ({
    formTitleName,
    formLowerBound,
    formUpperBound,
    formPublishTime,
    formLastBetTime,
    formBetType,
    formBetOptions,
  }) => {
    setCardOwnBettings([
      {
        user_id: 8888,
        bet_id: Number(id) + 10000,
        title: formTitleName,
        lowerbound: formLowerBound,
        token: Array(formBetOptions.length).fill(0),
        upperbound: formUpperBound,
        publishTime: formPublishTime,
        lastBetTime: formLastBetTime,
        betType: formBetType,
        options: formBetOptions,
        status: 0,
      },
      ...cardOwnBettings,
    ]);
    await contract.methods
      .addBet(formTitleName, formLowerBound, formUpperBound, 123, 456)
      .send({
        from: this.accounts[0],
      });
    setId(Number(id) + 10000);
  };
  const handleBettingChange = (cardList, status) => {
    if (status === "自己") {
      setCardOwnBettings(cardList);
    } else if (status === "熱門") {
      setCardUserBettings(cardList);
      let allBets = cardAllBettings.filter(
        ({ bet_id }) => !cardList.map(({ bet_id }) => bet_id).includes(bet_id)
      );
      console.log(cardList.filter(({ bet_id }) => bet_id));
      console.log(allBets);
      setCardAllBettings([...cardUserBettings, ...allBets]);
    } else {
      setCardUserBettings(cardList);
    }
  };
  useEffect(async () => {
    let newPath = paths;
    Object.entries(newPath).map(([type, cards]) => {
      cards.map((ele) => {
        ele.bets = publicCards;
        return ele;
      });
      return cards;
    });
    setCardAllBets(newPath);
    try {
      const web3 = await getWeb3();
      const accounts = await web3.eth.getAccounts();
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = OnlineBetting.networks[networkId];
      const instance = new web3.eth.Contract(
        OnlineBetting.abi,
        deployedNetwork && deployedNetwork.address
      );
      console.log(accounts, networkId, deployedNetwork, instance);
      setWeb3(web3);
      setAccounts(accounts);
      setContract(instance);
    } catch (error) {
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
      console.error(error);
    }
  }, []);
  return (
    <>
      <BrowserRouter>
        <Switch>
          <Route path="/createbet">
            <CreateBetPage createBet={createBet} />
          </Route>
          <Route path="/wheel">
            <WheelPage />
          </Route>
          <Route
            path="/:id"
            render={(props) => (
              <CheckBetPage
                handleBettingChange={handleBettingChange}
                id={props.match.params.id}
                cardUserBettings={cardUserBettings}
                cardOwnBettings={cardOwnBettings}
                cardAllBettings={cardAllBettings}
              />
            )}
          ></Route>
          <Route path="/" exact>
            <MainPage
              cardUserBettings={cardUserBettings}
              cardOwnBettings={cardOwnBettings}
              paths={paths}
              cardAllBets={cardAllBets}
            />
          </Route>
        </Switch>
      </BrowserRouter>
    </>
  );
}
