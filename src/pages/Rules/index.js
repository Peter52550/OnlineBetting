import { Card } from "antd";
import styles from "./index.module.css";

export default function Rules() {
  return (
    <div className={styles.root}>
      <Card size="small" bordered={false} className={styles.cardWrapper}>
        <h2>會員注意事項</h2>
        <p>1. 成為會員僅需按下下方按鈕即可</p>
        <p>
          2.
          會員分三級，古銅、黃金、鑽石，以您的投注總金額為標準，達到黃金需要100，達到鑽石需要1000
        </p>
        <p>3. 成為會員才能開盤、抽獎以及下注，越高的會員中獎機率越高</p>
        <p>4. 成為一般會員僅需支付500哈哈幣</p>
      </Card>
    </div>
  );
}
