import React from "react";

// css
import styles from "../pages/Main/CardList.module.css";

// components
import Card from "../pages/Main/Card";
import { Row } from "antd";

export default function DashCards({ cards, type }) {
  return (
    <div className={styles.padding}>
      {cards &&
        cards.map(({ bet_id, title, lowerbound, token, upperbound }) => (
          <Row span={4} style={{ padding: 16, paddingTop: 48 }}>
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
