import React from "react";
// css
import styles from "../pages/Main/CardList.module.css";
// components
import { useHistory } from "react-router-dom";
import Card from "../pages/Main/Card";
import { Typography, Row, Col } from "antd";
import { useState } from "react";
const { Title, Text } = Typography;

export default function DashCards({ cards }) {
  // const [bettings, setBettings] = useState(cards);
  const history = useHistory();
  console.log(cards);
  return (
    <div className={styles.padding}>
      {cards &&
        cards.map(({ bet_id, title, lowerbound, token, upperbound }) => (
          <Row span={4} style={{ paddingBottom: 16 }}>
            <Card
              bet_id={bet_id}
              title={title}
              lowerbound={lowerbound}
              token={token}
              upperbound={upperbound}
            />
          </Row>
        ))}
    </div>
  );
}
