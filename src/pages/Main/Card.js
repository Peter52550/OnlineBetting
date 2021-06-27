import React from "react";
import clsx from "clsx";

// router
import { useHistory } from "react-router-dom";

// css
import styles from "./Card.module.css";
import "./Card.css";

//images
import titan from "../../images/titan.jpeg";
import ramen from "../../images/ramen.jpg";
import ahong from "../../images/ahong.jpg";
import bonk from "../../images/bonk.jpg";

// components
import { AimOutlined, CodeOutlined } from "@ant-design/icons";
import { Card, Badge } from "antd";
import { Typography, Progress } from "antd";

const { Text } = Typography;

export default function Cards({
  bet_id,
  title,
  lowerbound,
  token,
  upperbound,
  area,
  category,
  handleClick,
  isAnswerSet,
  publishTime,
  stat,
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
    history.push(`/home/${bet_id}`);
  };
  const total = token.reduce(
    (acc, curValue) => Number(acc) + Number(curValue),
    0
  );
  const haveReward =
    typeof Number(upperbound) === "number" && typeof total === "number";

  const distance = ` $ ${
    Math.round(Math.max(Number(upperbound) - total, 0) * 100) / 100
  }`;
  const accumulate = ` $ ${Math.round(total * 100) / 100}`;
  const percentage =
    (total * 100) / (Number(upperbound) === 0 ? 1 : Number(upperbound));
  const max_acc = Math.max.apply(Math, token) / Number(upperbound);
  const src = stat === "全部" ? ahong : bonk;
  return (
    <Badge
      count={!isAnswerSet && publishTime < new Date().getTime() ? 1 : 0}
      showZero={false}
    >
      <div>
        <Card
          hoverable
          style={{ width: 350 }}
          className="cover"
          cover={<img alt="example" src={src} />}
          onClick={handleCardClick}
        >
          {/*<Meta
      // title={title}
      // description=""
      // className="ant-card-meta-title"
      // style={{ color: "#858585", fontSize: 35 }}
      />*/}
          <div style={{ display: "flex" }}>
            <div className={styles.title}>{title}</div>
            <div className={styles.flex}>
              <AimOutlined className={styles.icon} />
              <div className={styles.icon_word}>
                {area} {category}
              </div>
            </div>
          </div>
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
            success={{ percent: Number(max_acc) * 100, strokeColor: "#e29871" }}
            // status="active"
            strokeColor="#0058A3"
            trailColor="#D2D7DC"
          />
        </Card>
      </div>
    </Badge>
  );
}

// <div className={styles.container} onClick={handleCardClick}>
//   {/*<Image
//     className={styles.image}
//     src={image}
//     preview={{
//       visible: false,
//       maskClassName: clsx(styles.image, styles.image_mask),
//       mask: (
//         <Space direction="vertical" align="center">
//           {name}
//         </Space>
//       ),
//     }}
// />*/}
