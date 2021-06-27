import React, { useState } from "react";

// router
import { useHistory } from "react-router-dom";

// css
import styles from "./CardList.module.css";

// components
import Cards from "./Card";
import { Row, Col } from "antd";

export default function CardList({ cards, ownInfo, stat }) {
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
          cards.map(
            ({
              bet_id,
              title,
              lowerbound,
              token,
              upperbound,
              area,
              category,
              isAnswerSet,
              publishTime,
            }) => (
              <Col key={bet_id} span={8} style={{ marginBottom: 48 }}>
                <Cards
                  bet_id={bet_id}
                  title={title}
                  lowerbound={lowerbound}
                  token={token}
                  upperbound={upperbound}
                  area={area}
                  category={category}
                  ownInfo={ownInfo}
                  isAnswerSet={isAnswerSet}
                  publishTime={publishTime}
                  stat={stat}
                />
              </Col>
            )
          )}
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
