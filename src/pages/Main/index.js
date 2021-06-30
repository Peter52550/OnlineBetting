import React, { useState, useEffect } from "react";

// router
import { useHistory } from "react-router-dom";

// css
import styles from "./index.module.css";

// components
import CardMembershipIcon from "@material-ui/icons/CardMembership";
import Carousel from "../../components/Carousel/Carousel";
import CardList from "./CardList";
import SiftModal from "./SiftModal";
import PieChart from "./PieChart";
import BarChart from "./BarChart";
import { Button, Layout, Menu, Tooltip } from "antd";
import {
  PoweroffOutlined,
  UserOutlined,
  LaptopOutlined,
  NotificationOutlined,
} from "@ant-design/icons";
import Loading from "../../components/Loading";

// api
import { InfoAPI } from "../../api";

// config
import { memberships } from "../../config";

// icons
import money from "../../icons/money.svg";
import person from "../../icons/person.svg";

export default function MainPage({
  cardAllBettings,
  cardOwnBettings,
  ownInfo,
  hotBets,
  setHotBets,
  contract,
  accounts,
}) {
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [currentBets, setCurrentBets] = useState([]);
  const [mode, setMode] = useState("");
  // modal
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [lower, setLower] = useState([0, 1000000]);
  const [upper, setUpper] = useState([0, 1000000]);
  const [title, setTitle] = useState("");
  const showModal = () => {
    setIsModalVisible(true);
  };
  const handleCancel = () => {
    setIsModalVisible(false);
  };
  const handleLowerValueChange = (val) => {
    setLower(val);
  };
  const handleUpperValueChange = (val) => {
    setUpper(val);
  };
  const handleTitleChange = (val) => {
    setTitle(val);
  };
  const inRange = (x, min, max) => (x - min) * (x - max) <= 0;

  const handleSearch = () => {
    setIsModalVisible(false);
    if (currentBets.length > 0) {
      setCurrentBets(
        currentBets.filter((bet) =>
          inRange(bet.lowerbound, lower[0], lower[1]) &&
          inRange(bet.upperbound, upper[0], upper[1]) &&
          title === ""
            ? true
            : bet.title.includes(title) && !bet.isAnswerSet
        )
      );
    } else {
      setCurrentBets(
        cardAllBettings.filter((bet) =>
          inRange(bet.lowerbound, lower[0], lower[1]) &&
          inRange(bet.upperbound, upper[0], upper[1]) &&
          title === ""
            ? true
            : bet.title.includes(title) && !bet.isAnswerSet
        )
      );
    }
    setMode("search");
  };
  const enterLoading = (url) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      history.push(`/home/${url}`);
    }, 400);
    setMode("");
  };

  const handleMenuClick = (subMenuType, key) => {
    setMode("click");
    subMenuType === "main"
      ? setCurrentBets([])
      : setCurrentBets(
          cardAllBettings.filter(
            (bet) =>
              bet.area === subMenuType.replace(/\s/g, "") ||
              bet.category === subMenuType.replace(/\s/g, "")
          )
        );
  };
  const backToMain = () => {
    setMode("");
    setCurrentBets([]);
  };
  useEffect(async () => {
    // let hotbets = await InfoAPI.getHotBets(contract, accounts);
    // let hotbetIds = hotbets[0];
    let hotFinal = [];
    // console.log(hotbets);
    let allBetIds = cardAllBettings.map(({ bet_id }) => String(bet_id));
    cardAllBettings.forEach((bet, index) => {
      // if (allBetIds.includes(hotbetIds[index]) && !bet.isAnswerSet) {
      if (!bet.isAnswerSet) {
        hotFinal.push(bet);
      }
    });
    if (hotFinal.length > 5) {
      setHotBets(hotFinal.slice(0, 5));
    } else {
      setHotBets(hotFinal);
    }
    setPageLoading(false);
  }, []);
  return pageLoading ? (
    <Loading />
  ) : (
    <div style={{ backgroundColor: "#fdfdfd" }}>
      <div className={styles.top_holder} onClick={backToMain}>
        <Button className={styles.top_icon}>
          <img
            src={money}
            alt="icon"
            style={{ width: 44, marginTop: "-4px" }}
          />
          <div className={styles.top_icon_word}>Money</div>
        </Button>
        <div style={{ alignItems: "center", display: "flex" }}>
          <Button
            className={styles.button}
            icon={<PoweroffOutlined />}
            loading={loading}
            onClick={() => enterLoading("rules")}
          >
            閱讀規則
          </Button>
          <Button
            className={styles.button}
            icon={<PoweroffOutlined />}
            loading={loading}
            onClick={() => enterLoading("createbet")}
          >
            發布賭局
          </Button>
          <Button
            className={styles.button}
            icon={<PoweroffOutlined />}
            loading={loading}
            onClick={() => enterLoading("wheel")}
          >
            進入轉盤
          </Button>

          {ownInfo.member === "none" ? (
            <div style={{ paddingTop: 0 }}>
              <Tooltip
                title="加入會員"
                color={"volcano"}
                key={"volcano"}
                zIndex={200}
                placement="top"
                className={styles.memIcon}
              >
                <CardMembershipIcon
                  style={{ fontSize: 37 }}
                  className={styles.member}
                  onClick={() => history.push("./home/member")}
                />
              </Tooltip>
            </div>
          ) : (
            ""
          )}
          <Tooltip
            title="查看帳戶"
            color={"volcano"}
            key={"volcano"}
            zIndex={200}
            placement="top"
            className={styles.copper}
          >
            <img
              src={person}
              alt="person"
              className={styles.person}
              onClick={() => history.push("./home/account")}
            />
          </Tooltip>

          <Tooltip
            title={memberships[ownInfo.member].tooltip}
            color={"volcano"}
            key={"volcano"}
            zIndex={200}
            placement="top"
            className={styles.copper}
          >
            <img
              src={memberships[ownInfo.member].src}
              alt="copper"
              style={{
                paddingBottom: 0,
                width: 44,
                height: 44,
                marginTop: "-5px",
              }}
            />
          </Tooltip>
        </div>
      </div>
      <div style={{ display: "flex", paddingTop: 30 }}>
        <div className={styles.pie}>
          <PieChart cardAllBettings={cardAllBettings} />
        </div>
        <div className={styles.bar}>
          <BarChart cardAllBettings={cardAllBettings} />
        </div>
      </div>
      <div
        style={{
          display: "flex",
          paddingTop: 30,
          justifyContent: "space-around",
        }}
      >
        <div>各地區交易比例</div>
        <div>各類別交易比例</div>
      </div>
      <div className={styles.nav_header}>
        <div className={styles.nav_holder}>
          <div style={{ borderRight: "1px solid #808080" }}>
            <Button className={styles.nav} onClick={showModal}>
              篩選條件
            </Button>
          </div>
          <Carousel
            backToMain={backToMain}
            handleMenuClick={handleMenuClick}
            cardAllBettings={cardAllBettings}
            cardOwnBettings={cardOwnBettings}
          />
        </div>
      </div>

      {currentBets.length === 0 && mode === "" ? (
        <>
          <div style={{ display: "flex" }}>
            <div className={styles.title}>您所創建的賭局</div>
          </div>
          {cardOwnBettings.filter(({ isAnswerSet }) => !isAnswerSet).length ===
          0 ? (
            <div className={styles.text}>您尚未創建賭局喔</div>
          ) : (
            <CardList
              cards={cardOwnBettings.filter(({ isAnswerSet }) => !isAnswerSet)}
              ownInfo={ownInfo}
              stat=""
            />
          )}
          <br />
          {hotBets.length > 0 ? (
            <div className={styles.title}>熱門賭局</div>
          ) : (
            ""
          )}
          {hotBets.length > 0 ? (
            <CardList
              cards={hotBets.filter(({ isAnswerSet }) => !isAnswerSet)}
              ownInfo={ownInfo}
              stat=""
            />
          ) : (
            ""
          )}
          {cardAllBettings.filter(({ isAnswerSet }) => !isAnswerSet).length >
          0 ? (
            <div className={styles.title}>全部賭局</div>
          ) : (
            ""
          )}
          {cardAllBettings.filter(({ isAnswerSet }) => !isAnswerSet).length >
          0 ? (
            <CardList
              cards={cardAllBettings.filter(({ isAnswerSet }) => !isAnswerSet)}
              ownInfo={ownInfo}
              stat="全部"
            />
          ) : (
            ""
          )}
          <SiftModal
            isModalVisible={isModalVisible}
            handleCancel={handleCancel}
            handleLowerValueChange={handleLowerValueChange}
            lower={lower}
            handleUpperValueChange={handleUpperValueChange}
            upper={upper}
            handleTitleChange={handleTitleChange}
            title={title}
            handleSearch={handleSearch}
          />
          <br />
          <br />
          <br />
        </>
      ) : (
        <>
          {/*<DashCards cards={currentBets} />*/}
          {currentBets.length === 0 ? (
            <div className={styles.result}>
              {mode === "" ? "你要的好像沒結果誒..." : "目前沒有相關結果..."}
            </div>
          ) : (
            <div>
              {currentBets.filter(
                ({ status, isAnswerSet }) =>
                  (status === 0 || status === 2) && !isAnswerSet
              ).length > 0 ? (
                <>
                  <div className={styles.title}>您所創建的賭局</div>
                  <CardList
                    cards={currentBets.filter(
                      ({ status, isAnswerSet }) =>
                        status === 0 || (status === 2 && !isAnswerSet)
                    )}
                    stat=""
                  />{" "}
                </>
              ) : (
                ""
              )}

              {currentBets.filter(({ status, isAnswerSet }) => !isAnswerSet)
                .length > 0 ? (
                <>
                  <div className={styles.title}>全部賭局</div>
                  <CardList
                    cards={currentBets.filter(
                      ({ status, isAnswerSet }) => !isAnswerSet
                    )}
                    stat=""
                  />
                </>
              ) : (
                ""
              )}
            </div>
          )}
          <br />

          <SiftModal
            isModalVisible={isModalVisible}
            handleCancel={handleCancel}
            handleLowerValueChange={handleLowerValueChange}
            lower={lower}
            handleUpperValueChange={handleUpperValueChange}
            upper={upper}
            handleTitleChange={handleTitleChange}
            title={title}
            handleSearch={handleSearch}
          />
          <br />
          <br />
          <br />
        </>
      )}
    </div>
  );
}
{
  /*<Button className={styles.nav}>
            <div onClick={backToMain}>全部</div>
            </Button>*/
}

{
  /*<Button className={styles.nav}>
            <div onClick={(e) => handleMenuClick(e.target.outerText, 1)}>
              寶島
            </div>
          </Button>
          <Button className={styles.nav}>
            <div onClick={(e) => handleMenuClick(e.target.outerText, 1)}>
              支那
            </div>
          </Button>
          <Button className={styles.nav}>
            <div onClick={(e) => handleMenuClick(e.target.outerText, 1)}>
              美國
            </div>
          </Button>
          <Button className={styles.nav}>
            <div onClick={(e) => handleMenuClick(e.target.outerText, 1)}>
              歐洲
            </div>
          </Button>
          <Button className={styles.nav}>
            <div onClick={(e) => handleMenuClick(e.target.outerText, 1)}>
              news
            </div>
          </Button>
          <Button className={styles.nav}>
            <div onClick={(e) => handleMenuClick(e.target.outerText, 1)}>
              politics
            </div>
          </Button>
          <Button className={styles.nav}>
            <div onClick={(e) => handleMenuClick(e.target.outerText, 1)}>
              sports
            </div>
            </Button>*/
}
