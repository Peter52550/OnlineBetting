import React from "react";

// css
import "./SiftModal.css";

// component
import { Modal as AntModal, Slider, Input, Divider } from "antd";
import { CloseOutlined } from "@ant-design/icons";

export default function SiftModal({
  isModalVisible,
  handleCancel,
  handleLowerValueChange,
  lower,
  upper,
  title,
  handleUpperValueChange,
  handleTitleChange,
  handleSearch,
}) {
  return (
    <AntModal
      visible={isModalVisible}
      onOk={handleSearch}
      onCancel={handleCancel}
      closeIcon={<CloseOutlined className="close-icon" />}
      className="sift-modal"
      title={"篩選條件"}
      okText="查詢賭注"
      cancelText="取消"
    >
      <div className="title">最低下注金額</div>
      <Slider
        range
        min={0}
        max={1000000}
        onChange={(val) => handleLowerValueChange(val)}
        value={lower}
      />
      <div className="flex">
        <div className="box">
          <div>下限</div>
          <div className="number">
            <div>$</div>
            <Input
              //   min={0}
              //   max={1000000}
              //   style={{ margin: "0 16px" }}
              value={String(lower[0])}
              bordered={false}
              onChange={(e) => {
                handleLowerValueChange([
                  isNaN(e.target.value) ? 0 : Number(e.target.value),
                  Number(lower[1]),
                ]);
              }}
            />
          </div>
        </div>
        <div className="box">
          <div>上限</div>
          <div className="number">
            <div>$</div>
            <Input
              //   min={0}
              //   max={1000000}
              //   style={{ margin: "0 16px" }}
              value={String(lower[1])}
              bordered={false}
              onChange={(e) =>
                handleLowerValueChange([
                  Number(lower[0]),
                  isNaN(e.target.value) ? 0 : Number(e.target.value),
                ])
              }
            />
          </div>
        </div>
      </div>
      <Divider />
      <div className="title">賭注上限</div>
      <Slider
        range
        min={0}
        max={1000000}
        onChange={(val) => handleUpperValueChange(val)}
        value={upper}
      />
      <div className="flex">
        <div className="box">
          <div>下限</div>
          <div className="number">
            <div>$</div>
            <Input
              value={String(upper[0])}
              bordered={false}
              onChange={(e) => {
                handleUpperValueChange([
                  isNaN(e.target.value) ? 0 : Number(e.target.value),
                  Number(upper[1]),
                ]);
              }}
            />
          </div>
        </div>
        <div className="box">
          <div>上限</div>
          <div className="number">
            <div>$</div>
            <Input
              value={String(upper[1])}
              bordered={false}
              onChange={(e) =>
                handleUpperValueChange([
                  Number(upper[0]),
                  isNaN(e.target.value) ? 0 : Number(e.target.value),
                ])
              }
            />
          </div>
        </div>
      </div>
      <Divider />
      <div className="title">賭注標題</div>
      <Input
        value={title}
        // className="inputTitle"
        bordered={false}
        size="large"
        placeholder="輸入標題"
        onChange={(e) => handleTitleChange(e.target.value)}
      />
      <br />
      <br />
      <br />
    </AntModal>
  );
}
