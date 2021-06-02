import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { Typography, PageHeader } from "antd";
import { useHistory } from "react-router-dom";
import { ArrowLeftOutlined } from "@ant-design/icons";
import styles from "./SimpleDialog.module.css";

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
