import React, { useState, useEffect } from "react";
import moment from "moment";
import clsx from "clsx";
import { PlusCircleTwoTone, MinusCircleTwoTone } from "@ant-design/icons";
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
  Radio,
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
  formBetType,
  formBetOptions,
  handleTitleNameChange,
  handleLowerBoundChange,
  handleUpperBoundChange,
  handlePublishTimeChange,
  handleLastBetTimeChange,
  handleBetTypeChange,
  handleBetOptionsChange,
  amountDisable = false,
  titleNameDisable = false,
  addClick,
  removeClick,
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
      <Row className={styles.vertical_spacing}>
        <Col span={4} className={styles.blue}>
          賭注類別{" "}
        </Col>
        <Radio.Group
          className={styles.toggle}
          onChange={handleBetTypeChange}
          value={formBetType}
        >
          <Radio
            value={"trueFalse"}
            size="large"
            onChange={(e) => handleBetTypeChange(e)}
          >
            是非(兩個選項)
          </Radio>
          <Radio
            value={"multipleChoice"}
            size="large"
            onChange={(e) => handleBetTypeChange(e)}
          >
            多重選項
          </Radio>
        </Radio.Group>
      </Row>
      <Row className={styles.vertical_spacing}>
        <Col span={4} className={styles.blue}>
          賭注選項{" "}
        </Col>
      </Row>
      {formBetOptions.map((option, i) => (
        <Row className={styles.vertical_spacing} key={`option_${i}`}>
          {i == 0 ? (
            <PlusCircleTwoTone
              twoToneColor="#eb2f96"
              onClick={addClick}
              style={{
                fontSize: "28px",
                marginLeft: "-49px",
                paddingRight: 20,
                paddingTop: 3,
              }}
            />
          ) : (
            <MinusCircleTwoTone
              twoToneColor="#eb2f96"
              onClick={() => removeClick(i)}
              style={{
                fontSize: "28px",
                marginLeft: "-49px",
                paddingRight: 20,
                paddingTop: 3,
              }}
            />
          )}
          <Col span={4} className={styles.blue}>
            選項一{" "}
          </Col>
          <Col span={10}>
            <Input
              className={styles.input}
              placeholder="請輸入選項"
              size="large"
              value={option}
              disabled={titleNameDisable}
              onChange={(e) => handleBetOptionsChange(e, i)}
            />
          </Col>
        </Row>
      ))}
    </div>
  );
}
