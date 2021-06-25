import React, { useState } from "react";

// css
import styles from "./index.module.css";

// components
import DropMenu from "./DropMenu";
import PieChart from "./PieChart";
import ColumnChart from "./ColumnChart";
import BetModal from "./BetModal";
import { Statistic, Divider, Button } from "antd";
import { ArrowUpOutlined } from "@ant-design/icons";

// images
import cat from "../../images/cat.jpeg";

// config
import { memberships } from "../../config";

export default function Account({ ownInfo, cardOwnBettings }) {
  console.log(ownInfo);
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
  return (
    <div className={styles.root}>
      <div className={styles.left}>
        <h1 className={styles.title}>EE首家線上賭場上線啦</h1>
        <div className={styles.subleft}>
          <div className={styles.bigCard}>
            <div style={{ display: "flex", justifyContent: "space-around" }}>
              <div>Transactions by Category</div>
              <DropMenu />
            </div>
            <PieChart />
          </div>

          <div className={styles.bigCard} style={{ marginLeft: 40 }}>
            <div style={{ display: "flex", justifyContent: "space-around" }}>
              <div>Transactions by Category</div>
              <DropMenu />
            </div>
            <ColumnChart />
          </div>
        </div>
        <div className={styles.down}>
          <div className={styles.downStat}>
            <Statistic
              title="Active"
              value={11.28}
              precision={2}
              valueStyle={{ color: "#3f8600" }}
              prefix={<ArrowUpOutlined />}
              suffix="%"
            />
          </div>
          <Divider type="vertical" />
          <div className={styles.downText}>Your Own Latest Hot bet</div>
          <Divider type="vertical" />
          <div className={styles.downDate}>
            <div className={styles.downDay}>{new Date().getDate()}</div>
            <div className={styles.downMonth}>
              {monthNames[new Date().getMonth()]}
            </div>
          </div>
        </div>
      </div>
      <div className={styles.right}>
        <img src={cat} alt="cat" className={styles.image} />
        <div className={styles.icon}>
          <img src={memberships[ownInfo.member].src} alt="member" />
          <div style={{ padding: 4 }}>
            {memberships[ownInfo.member].tooltip}
          </div>
        </div>
        <div className={styles.rightUp}>
          <div className={styles.rightTextUp}>
            <div>Road to higher level</div>
            <div style={{ fontSize: 14, color: "#808080" }}>
              <div>You've won </div>
              <div style={{ fontSize: 20, color: "red" }}>50%</div>
              <div>of the player</div>
            </div>
          </div>
          <Divider type="vertical" />
          <div className={styles.rightStatUp}>
            <div className={styles.rightSubTextUp}>{24}</div>
            <div className={styles.rightCommentUp}>ways to</div>
            <img
              src={memberships[ownInfo.member].src}
              alt="member"
              className={styles.rightImageUp}
            />
          </div>
        </div>
        <div className={styles.rightUp}>
          <div className={styles.rightStatUp}>
            <div className={styles.rightSubTextUp}>{30}</div>
            <div className={styles.rightCommentUp}>bets</div>
          </div>
          <Divider type="vertical" />
          <div className={styles.rightTextUp}>
            <div style={{ fontSize: 14, color: "#808080" }}>
              Becoming a master since
            </div>
            <div>
              {new Date().getMonth()}/{new Date().getDate()}
            </div>
          </div>
        </div>
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
