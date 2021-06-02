import React, { useState } from "react";
import clsx from "clsx";
// router
import { useHistory } from "react-router-dom";
// css
import styles from "./Card.module.css";
// components

import { Typography, Image, Space, Progress, Tooltip } from "antd";
const { Title, Text } = Typography;

/**
 * Card contains Card name and Card Picture in CardTrackAccount
 */
export default function Card({
  bet_id,
  title,
  lowerbound,
  token,
  upperbound,
  handleClick,
}) {
  const history = useHistory();
  const handleCardClick = () => {
    // handleClick({
    //   bet_id: bet_id,
    //   title: title,
    //   lowerbound: lowerbound,
    //   token: token,
    //   upperbound: upperbound,
    // });
    history.push(`/${bet_id}`);
  };
  const total = token.reduce((acc, curValue) => acc + curValue, 0);
  const haveReward =
    typeof upperbound === "number" && typeof total === "number";

  const distance = ` $ ${
    Math.round(Math.max(upperbound - total, 0) * 100) / 100
  }`;
  const accumulate = ` $ ${Math.round(total * 100) / 100}`;
  const percentage = (total * 100) / (upperbound === 0 ? 1 : upperbound);
  const max_acc = Math.max.apply(Math, token);
  return (
    <div
      className={styles.container}
      // onClick={() => history.push(`/accountrecords/${card_id}`)}
      onClick={handleCardClick}
    >
      {/*<Image
        className={styles.image}
        src={image}
        preview={{
          visible: false,
          maskClassName: clsx(styles.image, styles.image_mask),
          mask: (
            <Space direction="vertical" align="center">
              {name}
            </Space>
          ),
        }}
    />*/}
      <div className={styles.title}>{title}</div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div>
          <Text className={clsx(styles.card_account, styles.gray)}>
            累積賭注
          </Text>
          <Text className={clsx(styles.card_account, styles.blue)}>
            {haveReward && accumulate}
          </Text>
        </div>
        {upperbound === 0 ? (
          <Text className={clsx(styles.card_account, styles.gray)}>
            金額無上限
          </Text>
        ) : (
          <div>
            <Text className={clsx(styles.card_account, styles.gray)}>
              距離頂金
            </Text>
            <Text className={clsx(styles.card_account, styles.blue)}>
              {haveReward && distance}
            </Text>
          </div>
        )}
      </div>
      <Progress
        percent={percentage}
        showInfo={false}
        success={{ percent: Number(max_acc), strokeColor: "#e29871" }}
        // status="active"
        strokeColor="#0058A3"
        trailColor="#D2D7DC"
      />
      <br />
    </div>
  );
}
