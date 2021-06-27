import { Card } from "antd";
import styles from "./index.module.css";

export default function Rules() {
  return (
    <div className={styles.root}>
      <Card size="small" bordered={false} className={styles.cardWrapper}>
        <h2>会場のルール</h2>
        <p>1. 成為會員才可下注、開賭盤和抽獎</p>
        <p>2. 本賭場貨幣最小單位為哈哈幣，為 0.001 ether</p>
        <p>3. 每個賭注會有最小賭注金額，是下注的下限</p>
        <p>
          4.
          每個賭注會有兩個時間，最後下注時間之前可以下注，過了需要等待答案公布，且只有開盤者可以設定答案
        </p>
        <p>
          5.
          公佈完答案後，若您的選項符合答案，您可以去您的錢包看一下有沒有新增的錢，我們會依您投注的比例分配
        </p>
        <p>6. 抽獎需要支付100哈哈幣才能進行</p>
        <p>
          7.
          會員採等級制，尚無、古銅、黃金、鑽石，依會員等級不同，能開設的賭局上限也將不同
          <div style={{ marginLeft: 20 }}>
            古銅、黃金和鑽石上限分別為2500/8000/20000個哈哈幣
          </div>
          <div style={{ marginLeft: 20 }}>
            達到黃金和鑽石所需的賭注為分別為10000/30000個哈哈幣
          </div>
        </p>
        <p>
          8.
          每個賭局下方可以留言及星星評價，皆為匿名，請各位尊重友善包容，也歡迎各位支持我們的賭場，Airwaves
          <div style={{ marginLeft: 20 }}>深呼吸，放手去做</div>
        </p>
      </Card>
    </div>
  );
}
