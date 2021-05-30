import React, { useState, useEffect } from "react";
import moment from "moment";
import clsx from "clsx";
// css
import styles from "./BetForm.module.css";
// components
import {
  Input,
  InputNumber,
  DatePicker,
  TimePicker,
  Row,
  Col,
  Image,
  Space,
} from "antd";

const dateFormat = "YYYY-MM-DD HH:mm:ss";
function disabledDate(current) {
  // Can not select days before today and today
  return current && current < moment().endOf("day");
}
function disabledDateTime() {
  return {
    disabledHours: () => range(0, 24).splice(4, 20),
    disabledMinutes: () => range(30, 60),
    disabledSeconds: () => [55, 56],
  };
}
function range(start, end) {
  const result = [];
  for (let i = start; i < end; i++) {
    result.push(i);
  }
  return result;
}
/**
 * form template for accounting record add and update
 */
export default function BetForm({
  formTitleName,
  formLowerBound,
  formUpperBound,
  formPublishTime,
  formLastBetTime,
  //   dateDisable = false,
  amountDisable = false,
  titleNameDisable = false,

  handleTitleNameChange,
  handleLowerBoundChange,
  handleUpperBoundChange,
  handlePublishTimeChange,
  handleLastBetTimeChange,
}) {
  // handle form
  // TODO: Error display
  return (
    <div className={styles.container}>
      <Row className={styles.vertical_spacing}>
        <Col span={4} className={styles.blue}>
          賭局標題{" "}
        </Col>
        <Col span={10}>
          <Input
            className={styles.input}
            placeholder="請輸入標題"
            size="large"
            value={formTitleName}
            disabled={titleNameDisable}
            onChange={handleTitleNameChange}
          />
        </Col>
      </Row>
      <Row className={styles.vertical_spacing}>
        <Col span={4} className={styles.blue}>
          下賭最小額度{" "}
        </Col>
        <Col span={10}>
          <InputNumber
            className={styles.input}
            size="large"
            placeholder="請輸入下賭金額"
            min={0}
            value={formLowerBound}
            disabled={amountDisable}
            onChange={handleLowerBoundChange}
          />
        </Col>
      </Row>
      <Row className={styles.vertical_spacing}>
        <Col span={4} className={styles.blue}>
          下賭上限{" "}
        </Col>
        <Col span={10}>
          <InputNumber
            className={styles.input}
            size="large"
            placeholder="請輸入上限金額"
            min={0}
            value={formUpperBound}
            disabled={amountDisable}
            onChange={handleUpperBoundChange}
          />
        </Col>
      </Row>
      <Row className={styles.vertical_spacing}>
        <Col span={4} className={styles.blue}>
          結果公開時間{" "}
        </Col>
        <Col span={10}>
          <DatePicker
            className={styles.input}
            size="large"
            format={dateFormat}
            value={moment(formPublishTime)}
            onChange={handlePublishTimeChange}
            disabledDate={disabledDate}
            disabledTime={disabledDateTime}
            showTime={{ defaultValue: moment("00:00:00", "HH:mm:ss") }}
          />
        </Col>
      </Row>
      <Row className={styles.vertical_spacing}>
        <Col span={4} className={styles.blue}>
          最後下注時間{" "}
        </Col>
        <Col span={10}>
          <DatePicker
            className={styles.input}
            size="large"
            format={dateFormat}
            value={moment(formLastBetTime)}
            onChange={handleLastBetTimeChange}
            disabledDate={disabledDate}
            disabledTime={disabledDateTime}
            showTime={{ defaultValue: moment("00:00:00", "HH:mm:ss") }}
          />
        </Col>
      </Row>
    </div>
  );
}
