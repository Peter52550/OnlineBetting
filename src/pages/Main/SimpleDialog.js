// router
import { useHistory } from "react-router-dom";

// css
import styles from "./SimpleDialog.module.css";

// components
import Dialog from "@material-ui/core/Dialog";
import { ArrowLeftOutlined } from "@ant-design/icons";

export default function SimpleDialog(props) {
  const { onClose, selectedValue, open } = props;
  const history = useHistory();
  const handleClose = () => {
    onClose();
  };
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullScreen={true}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <div
        style={{ marginLeft: 20, width: "300px", display: "flex" }}
        onClick={handleClose}
      >
        <ArrowLeftOutlined
          style={{ fontSize: "30px", color: "#08c" }}
          //   theme="outlined"
          className={styles.arrow}
        />
        <div className={styles.text}>查看賭博</div>
      </div>
      <div style={{ marginLeft: 550, fontSize: 30 }}>
        賭局標題：{selectedValue.title}
      </div>
      <div style={{ marginLeft: 550, fontSize: 30 }}>
        每次下注最小金額：{selectedValue.lowerbound}
      </div>
      <div style={{ marginLeft: 550, fontSize: 30 }}>
        目前下賭金額：{selectedValue.token}
      </div>
      <div style={{ marginLeft: 550, fontSize: 30 }}>
        上限金額：
        {selectedValue.upperbound}
      </div>
      <div style={{ marginLeft: 550, fontSize: 30 }}>下注金額：</div>
    </Dialog>
  );
}
