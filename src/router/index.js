import React, { useState, useEffect } from "react";

import getWeb3 from "../utils/getWeb3";

import OnlineBetting from "../build/contracts/OnlineBetting.json";
// react-router
import { BrowserRouter, Switch, Route } from "react-router-dom";
// pages
import RulePage from "../pages/Rules";
import MainPage from "../pages/Main";
import CreateBetPage from "../pages/CreateBet";
import CheckBetPage from "../pages/Checkbet";
import WheelPage from "../pages/Wheel";
import paths from "./path";
import { InfoAPI, AdderAPI } from "../api";
// import AddAccountRecord from "../pages/AddAccountRecord";
// import AccountRecords from "../pages/AccountRecords";
// logic
// import { init, authState } from "../slices/authSlice";
const BN = require("bn.js");
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
  const [loading, setLoading] = useState(false);
  const [finish, setFinish] = useState(false);
  const createBet = async ({
    formTitleName,
    formLowerBound,
    formUpperBound,
    formPublishTime,
    formLastBetTime,
    formBetType,
    formBetOptions,
  }) => {
    console.log(
      formLowerBound,
      formUpperBound,
      formPublishTime,
      formLastBetTime
    );
    await contract.methods
      .addBet(
        formTitleName,
        new BN(formLowerBound).toString(),
        new BN(formUpperBound).toString(),
        new BN(formPublishTime / 1000).toString(),
        new BN(formLastBetTime / 1000).toString(),
        formBetOptions
      )
      .send({
        from: accounts[0],
      });
    let validIds = await contract.methods.getIds().call({
      from: accounts[0],
    });
    setCardOwnBettings([
      {
        user_id: 8888,
        bet_id: Number(validIds["0"][validIds["0"].length - 1]),
        title: formTitleName,
        lowerbound: formLowerBound,
        token: Array(formBetOptions.length).fill(0),
        ownTokens: Array(formBetOptions.length).fill(0),
        upperbound: formUpperBound,
        publishTime: formPublishTime,
        lastBetTime: formLastBetTime,
        betType: formBetType,
        options: formBetOptions,
        status: 0,
      },
      ...cardOwnBettings,
    ]);
    setCardAllBettings([
      {
        user_id: 8888,
        bet_id: Number(validIds["0"][validIds["0"].length - 1]),
        title: formTitleName,
        lowerbound: formLowerBound,
        token: Array(formBetOptions.length).fill(0),
        ownTokens: Array(formBetOptions.length).fill(0),
        upperbound: formUpperBound,
        publishTime: formPublishTime,
        lastBetTime: formLastBetTime,
        betType: formBetType,
        options: formBetOptions,
        status: 0,
      },
      ...cardAllBettings,
    ]);
    console.log(validIds);
    // setId(Number(id) + 10000);
    // let iid = validIds["0"][validIds["0"].length - 1];
    // let _ = await addChoice(iid, formBetOptions);
  };
  const addChoice = async (id, choices) => {
    for (let index = 0; index < choices.length; index++) {
      const choice = choices[index];
      const res = await contract.methods.addChoice(id, choice).send({
        from: accounts[0],
      });
      console.log(res);
    }
    return 88;
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
    // let newPath = paths;
    // Object.entries(newPath).map(([type, cards]) => {
    //   cards.map((ele) => {
    //     ele.bets = publicCards;
    //     return ele;
    //   });
    //   return cards;
    // });
    // setCardAllBets(newPath);
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
      let validIds = await InfoAPI.getIds(instance, accounts);
      if (validIds.length === 0) {
        setCardAllBettings([]);
        setCardOwnBettings([]);
      } else {
        let titles = await InfoAPI.getTitles(instance, accounts, validIds);
        let lowerBounds = await InfoAPI.getLowerBounds(
          instance,
          accounts,
          validIds
        );
        let upperBounds = await InfoAPI.getUpperBounds(
          instance,
          accounts,
          validIds
        );
        let currentAmounts = await InfoAPI.getCurrentAmounts(
          instance,
          accounts,
          validIds
        );
        let choiceNums = await InfoAPI.getChoiceNums(
          instance,
          accounts,
          validIds
        );
        let choiceAmounts = await InfoAPI.getChoicesAmounts(
          instance,
          accounts,
          validIds
        );

        console.log(
          validIds,
          titles,
          lowerBounds,
          upperBounds,
          currentAmounts,
          choiceNums,
          choiceAmounts
        );
        let ownBets = [];
        let allBets = [];
        validIds["0"].forEach((id, index) => {
          let bet = {
            bet_id: id,
            title: titles[index],
            lowerbound: lowerBounds[index],
            token: choiceAmounts[index],
            ownTokens: Array(Number(choiceNums[index])).fill(0),
            upperbound: upperBounds[index],
            publishTime: 1623254399000,
            lastBetTime: 1623250799000,
            betType: "multipleChoice",
            options: [],
          };
          if (validIds["1"][index] === true) {
            ownBets.push({ ...bet, status: 0 });
            allBets.push({ ...bet, status: 0 });
          } else {
            allBets.push({ ...bet, status: 1 });
          }
        });
        setCardOwnBettings(ownBets);
        setCardAllBettings(allBets);
        console.log(ownBets);
      }
      setId(Number(id) + 10000);
      setFinish(true);
      setLoading(false);
    } catch (error) {
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );

      console.error(error);
    }
  }, []);
  return (
    <>
      {loading ? (
        <div>loading...</div>
      ) : (
        <BrowserRouter>
          <Switch>
            <Route exact path="/home/createbet">
              <CreateBetPage createBet={createBet} />
            </Route>
            <Route exact path="/home/wheel">
              <WheelPage />
            </Route>
            <Route
              path="/home/:id"
              render={(props) => (
                <CheckBetPage
                  handleBettingChange={handleBettingChange}
                  id={props.match.params.id}
                  cardOwnBettings={cardOwnBettings}
                  cardAllBettings={cardAllBettings}
                  contract={contract}
                  accounts={accounts}
                  web3={web3}
                />
              )}
            ></Route>
            <Route path="/home" exact>
              <MainPage
                cardAllBettings={cardAllBettings}
                cardOwnBettings={cardOwnBettings}
                paths={paths}
                cardAllBets={cardAllBets}
              />
            </Route>
            <Route path="/" exact>
              <RulePage setLoading={setLoading} finish={finish} />
            </Route>
          </Switch>
        </BrowserRouter>
      )}
    </>
  );
}
