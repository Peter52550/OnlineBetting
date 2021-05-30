import React, { useState } from "react";
// router
import { useHistory } from "react-router-dom";
// css
import styles from "./index.module.css";
// components
import { Button } from "antd";
import { PoweroffOutlined } from "@ant-design/icons";
// import Title from "./Title";
import CardList from "./CardList";
import DemoLine from "./DemoLine";

export default function MainPage({ cardUserBettings, cardOwnBettings }) {
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  //   const titleConfig = testTitle;
  //   const cards = testCards
  //   const others = testOthers;

  const enterLoading = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      history.push("/createbet");
    }, 400);
  };
  return (
    <div style={{ backgroundColor: "#fdfdfd" }}>
      <div
        style={{
          width: "60%",
          height: "20%",
          marginLeft: "20%",
        }}
      >
        <DemoLine />
      </div>
      <div style={{ display: "flex" }}>
        <div className={styles.title}>您所創建的賭局</div>
        <Button
          type="primary"
          className={styles.button}
          icon={<PoweroffOutlined />}
          loading={loading}
          onClick={() => enterLoading()}
        >
          發布賭局
        </Button>
      </div>
      {cardOwnBettings.length === 0 ? (
        <div className={styles.text}>您尚未創建賭局喔</div>
      ) : (
        <CardList cards={cardOwnBettings} />
      )}
      <br />
      <div className={styles.title}>熱門賭局</div>
      <CardList cards={cardUserBettings} />
    </div>
  );
}
