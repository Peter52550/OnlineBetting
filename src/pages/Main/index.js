import React, { useState, useEffect } from "react";
// router
import { useHistory } from "react-router-dom";
// css
import styles from "./index.module.css";
// components
import { Button, Layout, Menu, Breadcrumb } from "antd";
import {
  PoweroffOutlined,
  UserOutlined,
  LaptopOutlined,
  NotificationOutlined,
} from "@ant-design/icons";

import CardList from "./CardList";
import DemoLine from "./DemoLine";
import DashCards from "../../components/DashCards";
import paths from "../../router/path";

const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;

const publicCards = [
  {
    user_id: "ahf8we7fojewo",
    bet_id: "77777",
    title: "我明天會交女朋友嗎",
    lowerbound: 10,
    token: [20, 3],
    upperbound: 100,
    publishTime: "2021-05-30 00:56:30",
    lastBetTime: "2021-05-30 00:56:30",
    betType: "trueFalse",
    options: ["會", "不會"],
  },
  {
    user_id: "shfi69wefo0021",
    bet_id: "88888",
    title: "什麼時候可以出去玩啊QQ",
    lowerbound: 0,
    token: [60, 20, 2],
    upperbound: 100,
    publishTime: "2021-05-30 00:56:30",
    lastBetTime: "2021-05-30 00:56:30",
    betType: "multipleChoice",
    options: ["等一下", "你沒有妹妹", "再等一百年"],
  },
];
export default function MainPage({
  cardUserBettings,
  cardOwnBettings,
  cardAllBets,
}) {
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [currentBet, setCurrentBet] = useState({});

  const enterLoading = (url) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      history.push(`/${url}`);
    }, 400);
  };

  const handleMenuClick = (key, subMenuType) => {
    subMenuType === "main"
      ? setCurrentBet({})
      : setCurrentBet(cardAllBets[subMenuType][key - 1]);
  };
  // console.log(currentBet);
  return (
    <div style={{ backgroundColor: "#fdfdfd" }}>
      {/*<div
        style={{
          width: "60%",
          height: "20%",
          marginLeft: "20%",
        }}
      >
        <DemoLine />
      </div>*/}
      <Layout>
        <Header className="header">
          <div className="logo" />
          <Menu theme="dark" mode="horizontal" defaultSelectedKeys={["1"]}>
            <Menu.Item key="1">Market</Menu.Item>
            <Menu.Item key="2">Account</Menu.Item>
          </Menu>
        </Header>
        <Layout>
          <Sider width={200} className="site-layout-background">
            <Menu
              mode="inline"
              // defaultSelectedKeys={["1"]}
              // defaultOpenKeys={["sub1"]}
              style={{
                height: "200%",
                borderRight: 0,
                backgroundColor: "#800080",
                color: "#FFFFFF",
              }}
              // onClick={(e) => console.log(e.keyPath)}
            >
              <Menu.Item key="1" onClick={() => handleMenuClick(1, "main")}>
                首頁
              </Menu.Item>

              <SubMenu key="news" icon={<UserOutlined />} title="news">
                <Menu.Item
                  key="1"
                  onClick={({ keyPath: [key, value] }) =>
                    handleMenuClick(key, value)
                  }
                >
                  寶島
                </Menu.Item>
                <Menu.Item
                  key="2"
                  onClick={({ keyPath: [key, value] }) =>
                    handleMenuClick(key, value)
                  }
                >
                  支那
                </Menu.Item>
                <Menu.Item
                  key="3"
                  onClick={({ keyPath: [key, value] }) =>
                    handleMenuClick(key, value)
                  }
                >
                  美國
                </Menu.Item>
                <Menu.Item
                  key="4"
                  onClick={({ keyPath: [key, value] }) =>
                    handleMenuClick(key, value)
                  }
                >
                  歐洲
                </Menu.Item>
              </SubMenu>
              <SubMenu
                key="politics"
                icon={<LaptopOutlined />}
                title="politics"
              >
                <Menu.Item
                  key="1"
                  onClick={({ keyPath: [key, value] }) =>
                    handleMenuClick(key, value)
                  }
                >
                  寶島
                </Menu.Item>
                <Menu.Item
                  key="2"
                  onClick={({ keyPath: [key, value] }) =>
                    handleMenuClick(key, value)
                  }
                >
                  支那
                </Menu.Item>
                <Menu.Item
                  key="3"
                  onClick={({ keyPath: [key, value] }) =>
                    handleMenuClick(key, value)
                  }
                >
                  美國
                </Menu.Item>
                <Menu.Item
                  key="4"
                  onClick={({ keyPath: [key, value] }) =>
                    handleMenuClick(key, value)
                  }
                >
                  歐洲
                </Menu.Item>
              </SubMenu>
              <SubMenu
                key="sports"
                icon={<NotificationOutlined />}
                title="sports"
              >
                <Menu.Item
                  key="1"
                  onClick={({ keyPath: [key, value] }) =>
                    handleMenuClick(key, value)
                  }
                >
                  籃球
                </Menu.Item>
                <Menu.Item
                  key="2"
                  onClick={({ keyPath: [key, value] }) =>
                    handleMenuClick(key, value)
                  }
                >
                  棒球
                </Menu.Item>
                <Menu.Item
                  key="3"
                  onClick={({ keyPath: [key, value] }) =>
                    handleMenuClick(key, value)
                  }
                >
                  保齡球
                </Menu.Item>
                <Menu.Item
                  key="4"
                  onClick={({ keyPath: [key, value] }) =>
                    handleMenuClick(key, value)
                  }
                >
                  獄囚
                </Menu.Item>
              </SubMenu>
            </Menu>
          </Sider>
          <Layout
            style={{ padding: "0 24px 24px", backgroundColor: "#FFFFFF" }}
          >
            {/*<Breadcrumb style={{ margin: "16px 0" }}>
              <Breadcrumb.Item>Home</Breadcrumb.Item>
              <Breadcrumb.Item>List</Breadcrumb.Item>
              <Breadcrumb.Item>App</Breadcrumb.Item>
    </Breadcrumb>*/}
            <Content
              className="site-layout-background"
              style={{
                padding: 24,
                margin: 0,
                minHeight: 280,
              }}
            >
              {Object.keys(currentBet).length === 0 &&
              currentBet.constructor === Object ? (
                <>
                  <div style={{ display: "flex" }}>
                    <div className={styles.title}>您所創建的賭局</div>
                    <Button
                      type="primary"
                      className={styles.button}
                      icon={<PoweroffOutlined />}
                      loading={loading}
                      onClick={() => enterLoading("createbet")}
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
                  <Button
                    type="primary"
                    className={styles.button}
                    icon={<PoweroffOutlined />}
                    loading={loading}
                    onClick={() => enterLoading("wheel")}
                  >
                    進入轉盤
                  </Button>
                </>
              ) : (
                <DashCards cards={currentBet.bets} />
              )}
            </Content>
          </Layout>
        </Layout>
      </Layout>
      ,
    </div>
  );
}
