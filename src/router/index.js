import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
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
import { message } from "antd";
// config
import { paths, areas, categories, status, memberships } from "../config";

// api
import { InfoAPI, AdderAPI } from "../api";

const BN = require("bn.js");

const getMemberShip = (isVIP, money) => {
  if (!isVIP) return "none";
  else {
    if (money < 10000) return "copper";
    else if (money < 30000) return "golden";
    else return "diamond";
  }
};
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
  const [latest, setLatest] = useState(false);

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
    setLoading(true);
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
    // let validIds = await contract.methods.getIds().call({
    //   from: accounts[0],
    // });
    let bet = await InfoAPI.getLastBet(contract, accounts);
    setCardOwnBettings([
      {
        bet_id: Number(bet[0]),
        title: formTitleName,
        lowerbound: formLowerBound,
        token: Array(formBetOptions.length).fill(0),
        ownTokens: Array(formBetOptions.length).fill(0),
        upperbound: formUpperBound,
        publishTime: formPublishTime,
        lastBetTime: formLastBetTime,
        distributeTime: Number(bet[1].distributeTime * 1000),
        area: formArea,
        category: formCategory,
        betType: formBetType,
        options: formBetOptions,
        status: 0,
        comments: [],
        isAnswerSet: false,
        ownerId: bet[1].owner,
        voter: [],
        currentAmount: 0,
      },
      ...cardOwnBettings,
    ]);

    setCardAllBettings([
      {
        bet_id: Number(bet[0]),
        title: formTitleName,
        lowerbound: formLowerBound,
        token: Array(formBetOptions.length).fill(0),
        ownTokens: Array(formBetOptions.length).fill(0),
        upperbound: formUpperBound,
        publishTime: formPublishTime,
        lastBetTime: formLastBetTime,
        distributeTime: Number(bet[1].distributeTime * 1000),
        area: formArea,
        category: formCategory,
        betType: formBetType,
        options: formBetOptions,
        status: 0,
        comments: [],
        isAnswerSet: false,
        ownerId: bet[1].owner,
        voter: [],
        currentAmount: 0,
      },
      ...cardAllBettings,
    ]);
    setLoading(false);
    setLatest(true);
    message.info("開盤成功!");
  };

  const addChoice = async (id, choices) => {
    for (let index = 0; index < choices.length; index++) {
      const choice = choices[index];
      const res = await contract.methods.addChoice(id, choice).send({
        from: accounts[0],
      });
    }
    return 88;
  };
  const handleBettingChange = (cardList, status) => {
    setCardOwnBettings(
      cardList.filter(({ status }) => status === 0 || status === 2)
    );
    setCardAllBettings(cardList);
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
      let memberInfo = await InfoAPI.getMemberView(instance, accounts);
      setOwnInfo({
        betConstructed: memberInfo["betsConstructed"],
        member: getMemberShip(memberInfo["isVIP"], memberInfo["moneyAdded"]),
        betAmount: memberInfo["moneyAdded"],
        active: 0,
      });
      let all = await InfoAPI.getBets(instance, accounts);
      let validIds = all[0];
      let bets = all[1];
      let statuses = all[2];
      if (all.length === 0) {
        setCardAllBettings([]);
        setCardOwnBettings([]);
      } else {
        // let hotbets = await InfoAPI.getHotBets(instance, accounts);
        // console.log(hotbets);
        // let hotbetIds = hotbets[0];
        // let hotAllBets = hotbets[1];
        // let hots = hotAllBets;
        let hotFinal = [];
        let ownBets = [];
        let allBets = [];

        let rewards = await InfoAPI.getVoterChoices(
          instance,
          accounts,
          validIds
        );
        statuses.forEach((status, index) => {
          let tokens = [];
          bets[index]["currentChoices"].forEach((ele) => {
            tokens.push(Number(ele));
          });
          let ownTokens = [];
          if (rewards[index].length === 0) {
            Array(bets[index]["currentChoices"].length).fill(0);
          } else {
            rewards[index].forEach((ele) => {
              ownTokens.push(Number(ele));
            });
          }
          let comments = [];
          bets[index]["comments"].forEach((ele) => {
            comments.push(ele);
          });

          let bet = {
            bet_id: Number(validIds[index]),
            title: bets[index]["title"],
            lowerbound: Number(bets[index]["lowerBound"]),
            token: tokens,
            ownTokens: ownTokens,
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
            comments: comments,
            isAnswerSet: bets[index]["isAnswerSet"],
            ownerId: bets[index]["owner"],
            voter: bets[index]["voter"],
            currentAmount: bets[index]["currentAmount"],
          };
          if (status === "0" || status === "2") {
            ownBets.push({ ...bet, status: Number(status) });
            allBets.push({ ...bet, status: Number(status) });
          } else {
            allBets.push({ ...bet, status: Number(status) });
          }
          if (bet.voter.length > 0) {
            // if (hotbetIds.includes(validIds[index])) {
            hotFinal.push({ ...bet, status: Number(status) });
          }
        });
        if (hotFinal.length > 5) {
          setHotBets(hotFinal.slice(0, 5));
        } else {
          setHotBets(hotFinal);
        }

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
              <CreateBetPage
                createBet={createBet}
                ownInfo={ownInfo}
                contract={contract}
                accounts={accounts}
              />
            </Route>
            <Route exact path="/home/wheel">
              <ScrollToTop />
              <WheelPage
                ownInfo={ownInfo}
                contract={contract}
                accounts={accounts}
                web3={web3}
              />
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
                latest={latest}
                setLatest={setLatest}
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
                    ownInfo={ownInfo}
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
                hotBets={hotBets}
                setHotBets={setHotBets}
                contract={contract}
                accounts={accounts}
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
