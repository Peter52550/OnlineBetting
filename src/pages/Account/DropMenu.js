// components
import { Menu, Dropdown } from "antd";
import { DownOutlined } from "@ant-design/icons";

export default function DropMenu({ menuText, setMenuText }) {
  const items = ["1小時以內", "12小時以內", "24小時以內", "24小時以前"];
  const menu = (
    <Menu>
      {items.map((item) => (
        <Menu.Item key={item} onClick={() => setMenuText(item)}>
          {item}
        </Menu.Item>
      ))}
    </Menu>
  );
  return (
    <Dropdown overlay={menu}>
      <div>
        {menuText}
        <DownOutlined />
      </div>
    </Dropdown>
  );
}
