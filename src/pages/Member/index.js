import { Button, Card, Popconfirm, message } from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";
import styles from "./index.module.css";

// api
import { AdderAPI } from "../../api";

export default function Member({
  ownInfo,
  setOwnInfo,
  contract,
  accounts,
  web3,
}) {
  const confirm = async () => {
    let info = ownInfo;
    info.member = "copper";
    setOwnInfo(info);
    await AdderAPI.setVIP(contract, accounts, web3);
    message.info("恭喜您成功加入會員!");
  };

  return (
    <div className={styles.root}>
      <Card size="small" bordered={false} className={styles.cardWrapper}>
        <h2>會員注意事項</h2>
        <p>1. 成為會員僅需按下下方按鈕即可</p>
        <p>
          2.
          會員分三級，古銅、黃金、鑽石，以您的投注總金額為標準，達到黃金需要10000，達到鑽石需要30000哈哈幣
        </p>
        <p>3. 成為會員才能開盤、抽獎以及下注，越高的會員中獎機率越高</p>
        <p>4. 成為一般會員僅需支付500哈哈幣</p>
      </Card>
      <Popconfirm
        title="確定加入會員嗎？"
        okText="加爆啦"
        cancelText="我..再考慮一下"
        icon={<QuestionCircleOutlined style={{ color: "red" }} />}
        onConfirm={confirm}
      >
        <div className={styles.buttonWrapper}>
          <Button className={styles.button}>加入會員</Button>
        </div>
      </Popconfirm>
    </div>
  );
}
