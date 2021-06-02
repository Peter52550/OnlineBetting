import React, { useState, useEffect } from "react";
import moment from "moment";
import clsx from "clsx";
// css
import styles from "./BetForm.module.css";
// components
import { Input, InputNumber, DatePicker, Row, Col, Image, Space } from "antd";

const dateFormat = "YYYY/MM/DD";

/**
 * form template for accounting record add and update
 */
export default function BetForm({
  formAmount,
  amountDisable = false,
  formDate,
  dateDisable = false,
  formStoreName,
  storeNameDisable = false,
  formCardID,
  formMobilepayID,
  cards,
  mobilepays,
  handleAmountChange,
  handleDateChange,
  handleStoreNameChange,
  handleMobilepayChange,
  handleCardChange,
}) {
  // handle form
  // TODO: Error display
  const [payMethod, setPayMethod] = useState("");
  useEffect(() => {
    // parse paymethod
    const cardName = cards.find(({ card_id }) => card_id === formCardID)?.name;
    const mobilepayName = mobilepays.find(
      ({ mobilepay_id }) => mobilepay_id === formMobilepayID
    )?.name;
    let displayString = "";
    if (cardName && mobilepayName)
      displayString = `${cardName} + ${mobilepayName}`;
    else if (cardName) displayString = cardName;
    else if (mobilepayName) displayString = mobilepayName;
    else displayString = "*請在底下選擇支付工具*";
    setPayMethod(displayString);
  }, [payMethod, formCardID, formMobilepayID]);

  return (
    <div className={styles.container}>
      <Row className={styles.vertical_spacing}>
        <Col span={8} className={styles.blue}>
          消費金額{" "}
        </Col>
        <Col span={16}>
          <InputNumber
            className={styles.input}
            size="small"
            placeholder="請輸入消費金額"
            min={0}
            value={formAmount}
            disabled={amountDisable}
            onChange={handleAmountChange}
          />
        </Col>
      </Row>
      <Row className={styles.vertical_spacing}>
        <Col span={8} className={styles.blue}>
          消費日期{" "}
        </Col>
        <Col span={16}>
          <DatePicker
            className={styles.input}
            size="small"
            format={dateFormat}
            value={moment(formDate)}
            disabled={dateDisable}
            onChange={handleDateChange}
          />
        </Col>
      </Row>
      <Row className={styles.vertical_spacing}>
        <Col span={8} className={styles.blue}>
          消費店家{" "}
        </Col>
        <Col span={16}>
          <Input
            className={styles.input}
            placeholder="請輸入消費店家"
            size="small"
            value={formStoreName}
            disabled={storeNameDisable}
            onChange={handleStoreNameChange}
          />
        </Col>
      </Row>
      <Row className={styles.vertical_spacing}>
        <Col span={8} className={styles.blue}>
          消費方式{" "}
        </Col>
        <Col span={16}>
          <span className={styles.reminder}>{payMethod}</span>
        </Col>
      </Row>
      <div className={styles.vertical_spacing}>
        <Row>
          <Col span={8}>電子支付</Col>
        </Row>
        <Row gutter={8} wrap={false} className={styles.payment}>
          {mobilepays.map(({ url, mobilepay_id }) => (
            <Col span={4} key={mobilepay_id}>
              <Image
                src={url}
                className={styles.image}
                preview={
                  mobilepay_id === formMobilepayID && {
                    visible: false,
                    maskClassName: clsx(styles.image, styles.image_mask),
                    mask: (
                      <Space direction="vertical" align="center">
                        v
                      </Space>
                    ),
                  }
                }
                onClick={() => handleMobilepayChange(mobilepay_id)}
              />
            </Col>
          ))}
        </Row>
      </div>
      <div className={styles.vertical_spacing}>
        <Row>
          <Col span={8}>信用卡</Col>
        </Row>
        <Row gutter={8} wrap={false} className={styles.payment}>
          {cards.map(({ url, card_id }) => (
            <Col span={7} key={card_id}>
              <Image
                src={url}
                className={styles.image}
                preview={
                  card_id === formCardID && {
                    visible: false,
                    maskClassName: clsx(styles.image, styles.image_mask),
                    mask: (
                      <Space direction="vertical" align="center">
                        v
                      </Space>
                    ),
                  }
                }
                onClick={() => handleCardChange(card_id)}
              />
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
}
