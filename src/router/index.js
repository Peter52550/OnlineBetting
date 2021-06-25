import React, { useState, useEffect } from "react";
import getWeb3 from "../utils/getWeb3";

// ethereum
import OnlineBetting from "../build/contracts/OnlineBetting.json";

// react-router
import { BrowserRouter, Switch, Route } from "react-router-dom";

// pages
import OpeningPage from "../pages/Opening";
import MainPage from "../pages/Main";
import CreateBetPage from "../pages/CreateBet";
import CheckBetPage from "../pages/Checkbet";
import WheelPage from "../pages/Wheel";
import MemberPage from "../pages/Member";
import AccountPage from "../pages/Account";
import RulePage from "../pages/Rules";

// components
import ScrollToTop from "../components/ScrollToTop";
import Loading from "../components/Loading";

// config
import { paths, areas, categories, status } from "../config";

// api
import { InfoAPI, AdderAPI } from "../api";

const BN = require("bn.js");

export default function Router() {
  const [id, setId] = useState(99999);
  const [cardOwnBettings, setCardOwnBettings] = useState([]);
  const [cardUserBettings, setCardUserBettings] = useState([]);
  const [cardAllBets, setCardAllBets] = useState([]);
  const [cardAllBettings, setCardAllBettings] = useState([]);
  const [web3, setWeb3] = useState(null);
  const [accounts, setAccounts] = useState(null);
  const [contract, setContract] = useState(null);
  const [loading, setLoading] = useState(false);
  const [finish, setFinish] = useState(false);
  const [ownInfo, setOwnInfo] = useState({});
  const [hotBets, setHotBets] = useState([]);
  const createBet = async ({
    formTitleName,
    formLowerBound,
    formUpperBound,
    formPublishTime,
    formLastBetTime,
    formArea,
    formCategory,
    formBetType,
    formBetOptions,
  }) => {
    console.log(
      formTitleName,
      new BN(formLowerBound).toString(),
      new BN(formUpperBound).toString(),
      new BN(formPublishTime / 1000).toString(),
      new BN(formLastBetTime / 1000).toString(),
      new BN(new Date().getTime() / 1000).toString(), // distribute time
      formBetOptions,
      formArea,
      formCategory
    );
    await contract.methods
      .addBet(
        formTitleName,
        new BN(formLowerBound).toString(),
        new BN(formUpperBound).toString(),
        new BN(formPublishTime / 1000).toString(),
        new BN(formLastBetTime / 1000).toString(),
        new BN(new Date().getTime() / 1000).toString(), // distribute time
        formBetOptions,
        formArea,
        formCategory
      )
      .send({
        from: accounts[0],
      });
    let validIds = await contract.methods.getIds().call({
      from: accounts[0],
    });

    console.log({
      bet_id: Number(validIds["0"][validIds["0"].length - 1]),
      title: formTitleName,
      lowerbound: formLowerBound,
      token: Array(formBetOptions.length).fill(0),
      ownTokens: Array(formBetOptions.length).fill(0),
      upperbound: formUpperBound,
      publishTime: formPublishTime,
      lastBetTime: formLastBetTime,
      area: formArea,
      category: formCategory,
      betType: formBetType,
      options: formBetOptions,
      status: 0,
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
        area: formArea,
        category: formCategory,
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
        area: formArea,
        category: formCategory,
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

  // console.log(cardOwnBettings);
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
    try {
      const web3 = await getWeb3();
      const accounts = await web3.eth.getAccounts();
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = OnlineBetting.networks[networkId];
      const instance = new web3.eth.Contract(
        OnlineBetting.abi,
        deployedNetwork && deployedNetwork.address
      );
      setWeb3(web3);
      setAccounts(accounts);
      setContract(instance);
      // let validIds = await InfoAPI.getIds(instance, accounts);
      // console.log(validIds);
      // console.log("hey");
      // let hotBets = await InfoAPI.getHotBets(instance, accounts);
      // console.log("ho");
      // console.log(hotBets);
      let validIds = [
        ["1", "2"],
        [0, 0],
      ];
      setOwnInfo({
        bets: [],
        totalBetAmount: 0,
        member: "none",
        allbets: [],
      });
      if (validIds.length === 0) {
        setCardAllBettings([]);
        setCardOwnBettings([]);
      } else {
        let bets = await InfoAPI.getBets(instance, accounts);
        console.log(bets);
        // console.log(validIds);
        let ownBets = [];
        let allBets = [];

        validIds["0"].forEach((id, index) => {
          let tokens = [];
          bets[index]["currentChoices"].forEach((ele) => {
            tokens.push(Number(ele));
          });

          let bet = {
            bet_id: Number(id),
            title: bets[index]["title"],
            lowerbound: Number(bets[index]["lowerBound"]),
            token: tokens,
            ownTokens: Array(bets[index]["currentChoices"].length).fill(0),
            upperbound: Number(bets[index]["upperBound"]),
            publishTime: Number(bets[index]["publishTime"]) * 1000,
            lastBetTime: Number(bets[index]["lastBetTime"] * 1000),
            distributeTime: Number(bets[index]["distributeTime"] * 1000),
            // area: areas[Math.floor(Math.random() * areas.length)],
            // category: categories[Math.floor(Math.random() * categories.length)],
            area: areas[Number(bets[index]["region"])],
            category: categories[Number(bets[index]["genre"])],
            betType: "multipleChoice",
            options: bets[index]["choices"],
            comments: bets[index]["comments"],
            isAnswerSet: bets[index]["isAnswerSet"],
            ownerId: bets[index]["owner"],
            voter: bets[index]["voter"],
            currentAmount: bets[index]["currentAmount"],
          };
          if (validIds["1"][index] === true) {
            ownBets.push({ ...bet, status: 0 });
            allBets.push({ ...bet, status: 0 });
          } else {
            allBets.push({ ...bet, status: 1 });
          }
        });
        let newPath = paths;
        Object.entries(newPath).map(([type, cards]) => {
          cards.map((ele) => {
            ele.bets = allBets;
            return ele;
          });
          return cards;
        });
        setCardAllBets(newPath);
        setCardOwnBettings(ownBets);
        setCardAllBettings(allBets);
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
  console.log(cardAllBettings);
  return (
    <>
      {loading ? (
        <div>
          <Loading />
        </div>
      ) : (
        <BrowserRouter>
          <Switch>
            <Route exact path="/home/createbet">
              <ScrollToTop />
              <CreateBetPage createBet={createBet} />
            </Route>
            <Route exact path="/home/wheel">
              <ScrollToTop />
              <WheelPage />
            </Route>
            <Route path="/home/member" exact>
              <ScrollToTop />
              <MemberPage
                cardOwnBettings={cardOwnBettings}
                cardAllBettings={cardAllBettings}
                contract={contract}
                accounts={accounts}
                web3={web3}
                ownInfo={ownInfo}
                setOwnInfo={setOwnInfo}
              />
            </Route>
            <Route path="/home/account" exact>
              <ScrollToTop />
              <AccountPage
                cardOwnBettings={cardOwnBettings}
                cardAllBettings={cardAllBettings}
                contract={contract}
                accounts={accounts}
                web3={web3}
                ownInfo={ownInfo}
                setOwnInfo={setOwnInfo}
              />
            </Route>
            <Route path="/home/rules" exact>
              <ScrollToTop />
              <RulePage />
            </Route>
            <Route
              path="/home/:id"
              render={(props) => (
                <>
                  <ScrollToTop />
                  <CheckBetPage
                    handleBettingChange={handleBettingChange}
                    id={props.match.params.id}
                    cardOwnBettings={cardOwnBettings}
                    cardAllBettings={cardAllBettings}
                    contract={contract}
                    accounts={accounts}
                    web3={web3}
                  />
                </>
              )}
            ></Route>
            <Route path="/home" exact>
              <ScrollToTop />
              <MainPage
                cardAllBettings={cardAllBettings}
                cardOwnBettings={cardOwnBettings}
                ownInfo={ownInfo}
              />
            </Route>

            <Route path="/" exact>
              <OpeningPage setLoading={setLoading} finish={finish} />
            </Route>
          </Switch>
        </BrowserRouter>
      )}
    </>
  );
}

// let titles = await InfoAPI.getTitles(instance, accounts, validIds);
//         let lowerBounds = await InfoAPI.getLowerBounds(
//           instance,
//           accounts,
//           validIds
//         );
//         let upperBounds = await InfoAPI.getUpperBounds(
//           instance,
//           accounts,
//           validIds
//         );
//         let currentAmounts = await InfoAPI.getCurrentAmounts(
//           instance,
//           accounts,
//           validIds
//         );
//         let choiceNums = await InfoAPI.getChoiceNums(
//           instance,
//           accounts,
//           validIds
//         );
//         let choiceAmounts = await InfoAPI.getChoicesAmounts(
//           instance,
//           accounts,
//           validIds
//         );

//         console.log(
//           validIds,
//           titles,
//           lowerBounds,
//           upperBounds,
//           currentAmounts,
//           choiceNums,
//           choiceAmounts
//         );
