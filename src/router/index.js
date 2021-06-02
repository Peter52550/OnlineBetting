import React, { useState, useEffect } from "react";

// react-router
import { BrowserRouter, Switch, Route } from "react-router-dom";
// pages
import MainPage from "../pages/Main";
import CreateBetPage from "../pages/CreateBet";
import CheckBetPage from "../pages/Checkbet";

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
  },
];
export default function Router(props) {
  //   const dispatch = useDispatch();
  //   const { isInit } = useSelector(authState);
  //   useEffect(() => {
  //     dispatch(init());
  //   }, []);
  const [id, setId] = useState(99999);
  const [cardOwnBettings, setCardOwnBettings] = useState([]);
  const [cardUserBettings, setCardUserBettings] = useState(cardUserBetting);
  const createBet = ({
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
      },
      ...cardOwnBettings,
    ]);
    setId(Number(id) + 10000);
  };
  const handleBettingChange = (cardList, status) => {
    if (status === "自己") {
      setCardOwnBettings(cardList);
    } else {
      setCardUserBettings(cardList);
    }
  };
  return (
    <>
      <BrowserRouter>
        <Switch>
          <Route path="/createbet">
            <CreateBetPage createBet={createBet} />
          </Route>
          <Route
            path="/:id"
            render={(props) => (
              <CheckBetPage
                handleBettingChange={handleBettingChange}
                id={props.match.params.id}
                cardUserBettings={cardUserBettings}
                cardOwnBettings={cardOwnBettings}
              />
            )}
          ></Route>
          <Route path="/" exact>
            <MainPage
              cardUserBettings={cardUserBettings}
              cardOwnBettings={cardOwnBettings}
            />
          </Route>
        </Switch>
      </BrowserRouter>
    </>
  );
}
