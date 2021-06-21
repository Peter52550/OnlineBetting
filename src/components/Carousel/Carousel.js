import { useRef } from "react";

// css
import styles from "./Carousel.module.css";

// components
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { Button } from "antd";

// config
import { areas, categories } from "../../config";

const offSet = 420;

export default function Carousel({
  backToMain,
  handleMenuClick,
  cardOwnBettings,
  cardAllBettings,
}) {
  const ref = useRef(null);

  const scroll = (scrollOffset) => {
    ref.current.scrollLeft += scrollOffset;
  };
  const filteredAreas = cardAllBettings.map(({ area }) => area);
  const filteredCategories = cardAllBettings.map(({ category }) => category);
  const filtered = filteredAreas.concat(filteredCategories);

  const compare = (a, b) => {
    if (filtered.includes(a) && !filtered.includes(b)) return -1;
    else if (filtered.includes(b) && !filtered.includes(a)) return 1;
    else return 0;
  };

  return (
    <div className={styles.container}>
      <span className={styles.direction} onClick={() => scroll(-offSet)}>
        <LeftOutlined />
      </span>
      <div className={styles.overflow} ref={ref}>
        <Button className={styles.nav}>
          <div onClick={backToMain}>全部</div>
        </Button>
        {areas
          .concat(categories)
          .sort(compare)
          .map((area) => (
            <Button className={styles.nav}>
              <div onClick={(e) => handleMenuClick(e.target.outerText, 1)}>
                {area}
              </div>
            </Button>
          ))}
      </div>
      <span className={styles.direction} onClick={() => scroll(offSet)}>
        <RightOutlined />
      </span>
    </div>
  );
}
