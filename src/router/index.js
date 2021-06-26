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
  const history = useHistory();
  console.log(history);
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
    // let validIds = await contract.methods.getIds().call({
    //   from: accounts[0],
    // });
    let bet = await InfoAPI.getLastBet(contract, accounts);
    console.log({
      bet_id: Number(bet.bet_id),
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
      comments: [],
      isAnswerSet: false,
      ownerId: bet.ownerId,
      voter: [],
      currentAmount: 0,
    });
    console.log("after add bet: ", bet);
    setCardOwnBettings([
      {
        user_id: 8888,
        bet_id: Number(bet.bet_id),
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
        comments: [],
        isAnswerSet: false,
        ownerId: bet.ownerId,
        voter: [],
        currentAmount: 0,
      },
      ...cardOwnBettings,
    ]);

    setCardAllBettings([
      {
        user_id: 8888,
        bet_id: Number(bet.bet_id),
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
        comments: [],
        isAnswerSet: false,
        ownerId: bet.ownerId,
        voter: [],
        currentAmount: 0,
      },
      ...cardAllBettings,
    ]);
    console.log(Number(100));
    history.push("/home");
    message.info("開盤成功!");
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
    } else if (status === "全部") {
      setCardAllBettings(cardList);
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
      let memberInfo = await InfoAPI.getMemberView(instance, accounts);
      console.log(memberInfo);
      setOwnInfo({
        betConstructed: memberInfo["betsConstructed"],
        member: getMemberShip(memberInfo["isVIP"], memberInfo["moneyAdded"]),
        betAmount: memberInfo["moneyAdded"],
        active: 0,
      });
      let all = await InfoAPI.getBets(instance, accounts);
      console.log(all);
      let validIds = all[0];
      let bets = all[1];
      let statuses = all[2];
      if (all.length === 0) {
        setCardAllBettings([]);
        setCardOwnBettings([]);
      } else {
        console.log(all);
        let hotbets = await InfoAPI.getHotBets(instance, accounts);
        console.log(hotbets);
        let hots = hotbets
          .filter(({ isAnswerSet }) => !isAnswerSet)
          .map((bet) => {
            let tokens = [];
            bet["currentChoices"].forEach((ele) => {
              tokens.push(Number(ele));
            });
            // let ownTokens = [];
            // bets[index]["ownTokens"].forEach((ele) => {
            //   ownTokens.push(Number(ele));
            // });
            let comments = [];
            bet["comments"].forEach((ele) => {
              comments.push(ele);
            });
            return {
              bet_id: 100,
              title: bet["title"],
              lowerbound: Number(bet["lowerBound"]),
              token: tokens,
              ownTokens: Array(bet["currentChoices"].length).fill(200),
              upperbound: Number(bet["upperBound"]),
              publishTime: Number(bet["publishTime"]) * 1000,
              lastBetTime: Number(bet["lastBetTime"] * 1000),
              distributeTime: Number(bet["distributeTime"] * 1000),
              // area: areas[Math.floor(Math.random() * areas.length)],
              // category: categories[Math.floor(Math.random() * categories.length)],
              area: areas[Number(bet["region"])],
              category: categories[Number(bet["genre"])],
              betType: "multipleChoice",
              options: bet["choices"],
              comments: comments,
              isAnswerSet: bet["isAnswerSet"],
              ownerId: bet["owner"],
              voter: bet["voter"],
              currentAmount: bet["currentAmount"],
            };
          });
        console.log(hots);
        // console.log(validIds);
        let ownBets = [];
        let allBets = [];

        // let rewards = await InfoAPI.getVoterChoices(instance, accounts, bets);
        // console.log(rewards);
        console.log(statuses);
        statuses.forEach((status, index) => {
          let tokens = [];
          bets[index]["currentChoices"].forEach((ele) => {
            tokens.push(Number(ele));
          });
          // let ownTokens = [];
          // bets[index]["ownTokens"].forEach((ele) => {
          //   ownTokens.push(Number(ele));
          // });
          let comments = [];
          bets[index]["comments"].forEach((ele) => {
            comments.push(ele);
          });

          let bet = {
            bet_id: Number(validIds[index]),
            title: bets[index]["title"],
            lowerbound: Number(bets[index]["lowerBound"]),
            token: tokens,
            ownTokens: Array(bets[index]["currentChoices"].length).fill(200),
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
          console.log(hots, id);
          // if (hots.includes(Number(id))) {
          //   hotFinal.push({ ...bet, status: Number(status) });
          // }
        });
        // console.log(hotFinal);
        // setHotBets(hotFinal);
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
