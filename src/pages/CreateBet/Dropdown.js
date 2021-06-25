// components
import { Menu, Dropdown, message } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { areas, categories } from "../../config";
import { Area } from "@ant-design/charts";

const onClick = (e) => {
  message.info(`Click on item ${e.domEvent.target.outerText}`);
};

export default function DropdownMenu({ type, value, handleClick }) {
  const onClick = (e) => {
    message.info(`Click on item ${e.domEvent.target.outerText}`);
    handleClick(e.domEvent.target.outerText);
  };
  const areaMenu = () => (
    <Menu onClick={onClick}>
      {areas.map((area) => (
        <Menu.Item key={area}>{area}</Menu.Item>
      ))}
    </Menu>
  );
  const categoryMenu = () => (
    <Menu onClick={onClick}>
      {categories.map((category) => (
        <Menu.Item key={category}>{category}</Menu.Item>
      ))}
    </Menu>
  );
  const overlay = type === "areas" ? areaMenu : categoryMenu;
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
