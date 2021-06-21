// components
import { Menu, Dropdown, message } from "antd";
import { DownOutlined } from "@ant-design/icons";

const onClick = (e) => {
  message.info(`Click on item ${e.domEvent.target.outerText}`);
};

export default function DropdownMenu({ type, value, handleClick }) {
  const onClick = (e) => {
    message.info(`Click on item ${e.domEvent.target.outerText}`);
    handleClick(e.domEvent.target.outerText);
  };
  const areas = () => (
    <Menu onClick={onClick}>
      <Menu.Item key="1">寶島</Menu.Item>
      <Menu.Item key="2">支那</Menu.Item>
      <Menu.Item key="3">美國</Menu.Item>
      <Menu.Item key="4">歐洲</Menu.Item>
    </Menu>
  );
  const categories = () => (
    <Menu onClick={onClick}>
      <Menu.Item key="1">news</Menu.Item>
      <Menu.Item key="2">politics</Menu.Item>
      <Menu.Item key="3">sports</Menu.Item>
    </Menu>
  );
  const overlay = type === "areas" ? areas : categories;
  const text =
    value === "" ? (type === "areas" ? "選擇地區" : "選擇類別") : value;

  return (
    <Dropdown overlay={overlay}>
      <div
        style={{
          color: "white",
          marginLeft: 20,
          marginTop: "-2px",
          width: 100,
          padding: "5px 4px 4px 20px",
          fontSize: 14,
          border: "1px solid white",
          borderRadius: 20,
        }}
      >
        {text}
        <DownOutlined style={{ marginLeft: 8 }} />
      </div>
    </Dropdown>
  );
}
