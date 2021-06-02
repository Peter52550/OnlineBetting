import React from "react";
// css
import styles from "./CardList.module.css";
// components
import { useHistory } from "react-router-dom";
import Card from "./Card";
import { Typography, Row, Col } from "antd";
import SimpleDialog from "./SimpleDialog";
import { useState } from "react";
const { Title, Text } = Typography;

export default function CardList({ cards }) {
  const [selectedValue, setSelectedValue] = useState("");
  const [open, setOpen] = useState(false);
  // const [bettings, setBettings] = useState(cards);
  const history = useHistory();
  const handleClose = () => {
    setOpen(false);
  };
  return (
    <div className={styles.padding}>
      {/*<Title level={5} style={{ color: "#858585" }}>
        賭金
  </Title>*/}
      <Row>
        {cards &&
          cards.map(({ bet_id, title, lowerbound, token, upperbound }) => (
            <Col key={bet_id} span={8}>
              <Card
                bet_id={bet_id}
                title={title}
                lowerbound={lowerbound}
                token={token}
                upperbound={upperbound}
              />
            </Col>
          ))}
      </Row>
      {/*<SimpleDialog
        selectedValue={selectedValue}
        open={open}
        onClose={handleClose}
        updateBettings={updateBettings}
          />*/}
    </div>
  );
}
