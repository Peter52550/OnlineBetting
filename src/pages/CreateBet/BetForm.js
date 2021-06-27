import React, { useState, useEffect } from "react";
import moment from "moment";

// css
import styles from "./BetForm.module.css";
import "./BetForm.css";

// components
import {
  PlusCircleTwoTone,
  MinusCircleTwoTone,
  PlusCircleOutlined,
  MinusCircleOutlined,
} from "@ant-design/icons";
import { Input, InputNumber, DatePicker, Row, Col } from "antd";
import DropdownMenu from "./Dropdown";

const dateFormat = "YYYY-MM-DD HH:mm:ss";
function disabledDate(current) {
  // Can not select days before today and today
  return current < moment().startOf("day");
}
function disabledDateTime() {
  return {
    // disabledHours: () => range(0, 24).splice(4, 20),
    // disabledMinutes: () => range(30, 60),
    // disabledSeconds: () => [55, 56],
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
  formArea,
  formCategory,
  formBetType,
  formBetOptions,
  handleTitleNameChange,
  handleLowerBoundChange,
  handleUpperBoundChange,
  handlePublishTimeChange,
  handleLastBetTimeChange,
  handleAreaChange,
  handleCategoryChange,
  handleBetTypeChange,
  handleBetOptionsChange,
  amountDisable = false,
  titleNameDisable = false,
  addClick,
  removeClick,
}) {
  const leftSpan = 6;
  const rightSpan = 10;

  const [click1, setClick1] = useState(false);
  const [click2, setClick2] = useState(false);
  return (
    <div className={styles.container}>
      <div className={styles.title}>賭局資訊</div>
      <Row className={styles.vertical_spacing}>
        {/*<Col span={leftSpan} className={styles.blue}>
          賭局標題{" "}
  </Col>*/}
        <Col span={rightSpan}>
          <Input
            className={styles.input}
            bordered={false}
            placeholder="請輸入賭局標題"
            size="large"
            value={formTitleName}
            disabled={titleNameDisable}
            onChange={handleTitleNameChange}
          />
        </Col>
      </Row>
      <Row className={styles.vertical_spacing}>
        {/*<Col span={leftSpan} className={styles.blue}>
          下賭最小額度{" "}
</Col>*/}
        <Col span={rightSpan}>
          <InputNumber
            className={styles.input}
            style={{ paddingTop: 10 }}
            bordered={false}
            size="large"
            placeholder="請輸入每人下賭最小額度"
            min={0}
            value={formLowerBound}
            disabled={amountDisable}
            onChange={handleLowerBoundChange}
          />
        </Col>
      </Row>
      <Row className={styles.vertical_spacing}>
        {/*<Col span={leftSpan} className={styles.blue}>
          下賭上限{" "}
</Col>*/}
        <Col span={rightSpan}>
          <InputNumber
            className={styles.input}
            style={{ paddingTop: 10 }}
            bordered={false}
            size="large"
            placeholder="您想要這盤賭到最高多少"
            min={0}
            value={formUpperBound}
            disabled={amountDisable}
            onChange={handleUpperBoundChange}
          />
        </Col>
      </Row>

      <Row className={styles.vertical_spacing}>
        {/*<Col span={leftSpan} className={styles.blue}>
          最後下注時間{" "}
</Col>*/}
        <Col span={rightSpan} className="date-wrapper">
          <DatePicker
            suffixIcon
            // className={styles.input}
            style={{ width: "138%" }}
            placeholder="請點選最後下注時間"
            bordered={false}
            size="large"
            format={dateFormat}
            // value={moment(formLastBetTime)}
            // value={placeholder ? placeholder : moment(formLastBetTime)}
            onChange={handleLastBetTimeChange}
            disabledDate={disabledDate}
            disabledTime={disabledDateTime}
            showTime={{ defaultValue: moment("00:00:00", "HH:mm:ss") }}
          />
        </Col>
      </Row>
      <Row className={styles.vertical_spacing}>
        {/*<Col span={leftSpan} className={styles.blue}>
          結果公開時間{" "}
</Col>*/}
        <Col span={rightSpan} className="date-wrapper">
          <DatePicker
            // className={styles.input}
            style={{ width: "142%" }}
            bordered={false}
            placeholder="請點選結果公開時間"
            size="large"
            format={dateFormat}
            // value={moment(formPublishTime)}
            onChange={handlePublishTimeChange}
            disabledDate={disabledDate}
            disabledTime={disabledDateTime}
            showTime={{ defaultValue: moment("00:00:00", "HH:mm:ss") }}
          />
        </Col>
      </Row>
      <Row className={styles.vertical_spacing} style={{ width: 500 }}>
        {/*<Col span={leftSpan} className={styles.blue}>
          賭注類別{" "}
</Col>*/}
        <button
          className={styles.glow}
          style={{
            marginRight: 20,
            backgroundColor: click1 ? "rgb(0, 140, 255)" : "",
          }}
          onClick={(e) => {
            handleBetTypeChange(e.target.outerText);
            setClick1(true);
            setClick2(false);
          }}
        >
          是非
        </button>
        <button
          className={styles.glow}
          style={{ backgroundColor: click2 ? "rgb(0, 140, 255)" : "" }}
          onClick={(e) => {
            handleBetTypeChange(e.target.outerText);
            setClick2(true);
            setClick1(false);
          }}
        >
          多選
        </button>
        <DropdownMenu
          type="areas"
          value={formArea}
          handleClick={handleAreaChange}
        />
        <DropdownMenu
          type="categories"
          value={formCategory}
          handleClick={handleCategoryChange}
        />
        {/*<Radio.Group
          className={styles.toggle}
          onChange={handleBetTypeChange}
          value={formBetType}
        >
          <Radio
            value={"trueFalse"}
            size="large"
            onChange={(e) => handleBetTypeChange(e)}
            style={{ color: "white", fontSize: 14 }}
          >
            是非(兩個選項)
          </Radio>
          <Radio
            value={"multipleChoice"}
            size="large"
            onChange={(e) => handleBetTypeChange(e)}
            style={{ color: "white", fontSize: 14 }}
          >
            多重選項
          </Radio>
        </Radio.Group>*/}
      </Row>
      {/*<Row className={styles.vertical_spacing}>
        <Col span={leftSpan} className={styles.blue}>
          賭注選項{" "}
        </Col>
      </Row>*/}
      {formBetOptions.map((option, i) => (
        <Row className={styles.vertical_spacing} key={`option_${i}`}>
          {formBetType === "multipleChoice" && i === 1 ? (
            <PlusCircleOutlined
              // twoToneColor="#eb2f96"
              // twoToneColor="white"
              onClick={addClick}
              className={styles.icon}
            />
          ) : formBetType === "multipleChoice" && i > 1 ? (
            <MinusCircleOutlined
              // twoToneColor="#eb2f96"
              // twoToneColor="white"
              onClick={() => removeClick(i)}
              className={styles.icon}
            />
          ) : (
            ""
          )}
          {/*<Col span={leftSpan} className={styles.blue}>
            選項一{" "}
            </Col>*/}
          <Col span={rightSpan}>
            <Input
              className={styles.input}
              bordered={false}
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
