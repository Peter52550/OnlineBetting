import React, { useState } from "react";
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

const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;

export default function MainPage({ cardUserBettings, cardOwnBettings }) {
  const history = useHistory();
  const [loading, setLoading] = useState(false);

  const enterLoading = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      history.push("/createbet");
    }, 400);
  };
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
            >
              <SubMenu key="news" icon={<UserOutlined />} title="news">
                <Menu.Item key="1">寶島</Menu.Item>
                <Menu.Item key="2">支那</Menu.Item>
                <Menu.Item key="3">美國</Menu.Item>
                <Menu.Item key="4">歐洲</Menu.Item>
              </SubMenu>
              <SubMenu
                key="politics"
                icon={<LaptopOutlined />}
                title="politics"
              >
                <Menu.Item key="5">寶島</Menu.Item>
                <Menu.Item key="6">支那</Menu.Item>
                <Menu.Item key="7">美國</Menu.Item>
                <Menu.Item key="8">歐洲</Menu.Item>
              </SubMenu>
              <SubMenu
                key="sport"
                icon={<NotificationOutlined />}
                title="sport"
              >
                <Menu.Item key="9">籃球</Menu.Item>
                <Menu.Item key="10">棒球</Menu.Item>
                <Menu.Item key="11">保齡球</Menu.Item>
                <Menu.Item key="12">獄囚</Menu.Item>
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
            </Content>
          </Layout>
        </Layout>
      </Layout>
      ,
    </div>
  );
}
