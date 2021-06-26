import React, { useState, useEffect } from "react";

// css
import styles from "./index.module.css";

// components
import DropMenu from "./DropMenu";
import PieChart from "./PieChart";
import ColumnChart from "./ColumnChart";
import BetModal from "./BetModal";
import { Statistic, Divider, Button, Empty } from "antd";
import { ArrowUpOutlined } from "@ant-design/icons";

// images
import cat from "../../images/cat.jpeg";

// config
import { memberships } from "../../config";

export default function Account({ ownInfo, cardOwnBettings }) {
  console.log(ownInfo);
  const [menuText, setMenuText] = useState("24小時以內");
  const [leftData, setLeftData] = useState(
    cardOwnBettings
      .map(({ ownTokens }) => ownTokens)
      .flat()
      .reduce((acc, curValue) => Number(acc) + Number(curValue), 0)
  );
  const member =
    ownInfo.member === "copper"
      ? "古銅"
      : ownInfo.member === "golden"
      ? "黃金"
      : "鑽石";
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  // modal
  const [isModalVisible, setIsModalVisible] = useState(false);
  const showModal = () => {
    setIsModalVisible(true);
  };
  const handleCancel = () => {
    setIsModalVisible(false);
  };
  console.log(
    cardOwnBettings
      .map(({ distributeTime }) => distributeTime)
      .sort(function (a, b) {
        return a.distributeTime - b.distributeTime;
      })
  );
  useEffect(() => {
    ownInfo.active =
      cardOwnBettings.filter(({ isAnswerSet }) => !isAnswerSet).length > 0
        ? 0
        : cardOwnBettings.filter(({ isAnswerSet }) => !isAnswerSet)[0].voter
            .length > 0
        ? cardOwnBettings.filter(({ isAnswerSet }) => !isAnswerSet)[0].voter
            .length - ownInfo.active
        : ownInfo.active;
  }, [cardOwnBettings]);
  return (
    <div className={styles.root}>
      <div className={styles.left}>
        <h1 className={styles.title}>EE首家線上賭場上線啦</h1>
        <div className={styles.subleft}>
          <div
            className={styles.bigCard}
            style={cardOwnBettings.length > 0 ? {} : { height: 400 }}
          >
            <div style={{ display: "flex", justifyContent: "space-around" }}>
              <div>Transactions by Category</div>
              <DropMenu menuText={menuText} setMenuText={setMenuText} />
            </div>
            {leftData > 0 ? (
              <PieChart
                cardOwnBettings={cardOwnBettings}
                menuText={menuText}
                setLeftData={setLeftData}
              />
            ) : (
              <Empty description="尚無資料" />
            )}
          </div>

          <div className={styles.bigCard} style={{ marginLeft: 40 }}>
            <div style={{ display: "flex", justifyContent: "space-around" }}>
              <div>Transactions by Region</div>
            </div>
            {leftData > 0 ? (
              <ColumnChart cardOwnBettings={cardOwnBettings} />
            ) : (
              <Empty description="尚無資料" />
            )}
          </div>
        </div>
        {cardOwnBettings.length > 0 ? (
          <div className={styles.down}>
            <div className={styles.downStat}>
              <Statistic
                title="Active"
                value={ownInfo.active}
                precision={0}
                valueStyle={{ color: "#3f8600" }}
                prefix={<ArrowUpOutlined />}
                suffix="voters"
              />
            </div>
            <Divider type="vertical" />
            <div className={styles.downText}>Your Own Latest Hot bet</div>
            <Divider type="vertical" />
            <div className={styles.downDate}>
              <div className={styles.downDay}>
                {new Date(
                  cardOwnBettings.filter(
                    ({ lastBetTime }) => lastBetTime > new Date().getTime()
                  )[0].distributeTime
                ).getDate()}
              </div>
              <div className={styles.downMonth}>
                {
                  monthNames[
                    new Date(
                      cardOwnBettings.filter(
                        ({ lastBetTime }) => lastBetTime > new Date().getTime()
                      )[0].distributeTime
                    ).getMonth()
                  ]
                }
              </div>
            </div>
          </div>
        ) : (
          <div className={styles.down}>
            {" "}
            <Empty description="尚無資料" />
          </div>
        )}
      </div>
      <div className={styles.right}>
        <img src={cat} alt="cat" className={styles.image} />
        <div className={styles.icon}>
          <img src={memberships[ownInfo.member].nextLevel} alt="member" />
          <div style={{ padding: 4 }}>
            {memberships[ownInfo.member].tooltip}
          </div>
        </div>
        {cardOwnBettings.length > 0 ? (
          <div className={styles.rightUp}>
            <div className={styles.rightTextUp}>
              <div>Road to higher level</div>
              <div style={{ fontSize: 14, color: "#808080" }}>
                <div>You've won </div>
                <div style={{ fontSize: 20, color: "red" }}>
                  {memberships[ownInfo.member].people}%
                </div>
                <div>of the player</div>
              </div>
            </div>
            <Divider type="vertical" />
            <div className={styles.rightStatUp}>
              <div className={styles.rightSubTextUp}>
                {memberships[ownInfo.member].over - ownInfo.betAmount}
              </div>
              <div className={styles.rightCommentUp}>ways to</div>
              <img
                src={memberships[ownInfo.member].src}
                alt="member"
                className={styles.rightImageUp}
              />
            </div>
          </div>
        ) : (
          <div className={styles.rightUp}>
            <Empty description="尚無資料" />
          </div>
        )}
        {cardOwnBettings.length > 0 ? (
          <div className={styles.rightUp}>
            <div className={styles.rightStatUp}>
              <div className={styles.rightSubTextUp}>
                {ownInfo.betConstructed}
              </div>
              <div className={styles.rightCommentUp}>bets</div>
            </div>
            <Divider type="vertical" />
            <div className={styles.rightTextUp}>
              <div style={{ fontSize: 14, color: "#808080" }}>
                Becoming a master since
              </div>
              <div>
                {new Date(
                  cardOwnBettings
                    .map(({ distributeTime }) => distributeTime)
                    .sort(function (a, b) {
                      return a.distributeTime - b.distributeTime;
                    })[0]
                ).getMonth() + 1}
                /
                {new Date(
                  cardOwnBettings
                    .map(({ distributeTime }) => distributeTime)
                    .sort(function (a, b) {
                      return a.distributeTime - b.distributeTime;
                    })[0]
                ).getDate()}
              </div>
            </div>
          </div>
        ) : (
          <div className={styles.rightUp}>
            <Empty description="尚無資料" />
          </div>
        )}
        <div className={styles.buttonWrapper}>
          <Button className={styles.button} onClick={showModal}>
            查看所有賭局
          </Button>
        </div>

        <BetModal
          isModalVisible={isModalVisible}
          handleCancel={handleCancel}
          cardOwnBettings={cardOwnBettings}
        />
      </div>
    </div>
  );
}
