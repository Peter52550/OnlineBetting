import { Checkbox } from "antd";
import { useHistory } from "react-router-dom";
import styles from "./index.module.css";
import Plx from "react-plx";
import Explosion from "./Explosion";
export default function Rules({ setLoading, finish }) {
  const history = useHistory();
  const redirect = () => {
    if (finish) {
      setLoading(false);
    } else {
      setLoading(true);
    }
    history.push("/home");
  };
  const titleData = [
    {
      start: ".title",
      startOffset: 50,
      duration: 220,
      properties: [
        {
          startValue: 1,
          endValue: -360,
          property: "rotate",
        },
        {
          startValue: "#e34e47",
          endValue: "#995eb2",
          property: "color",
        },
        {
          startValue: 1,
          endValue: 0,
          property: "scale",
        },
      ],
    },
  ];
  return (
    <div className={styles.root}>
      <div style={{ height: 700 }}>
        <Plx
          tagName="h1"
          className={styles.title}
          parallaxData={titleData}
          style={{ fontSize: 60 }}
          // onPlxStart={() => console.log("Plx - onPlxStart callback ")}
          // onPlxEnd={() => console.log("Plx - onPlxEnd callback")}
        >
          <div className={styles.center}>The Best Online Betting Game</div>
        </Plx>
      </div>
      <div style={{ height: 400, paddingLeft: 200, display: "flex" }}>
        <div>
          <Plx
            tagName="h1"
            className={styles.rule1}
            parallaxData={textData}
            style={{ fontSize: 70 }}
          >
            <div>Be</div>
            <div>A</div>
            <div>Master</div>
          </Plx>
        </div>
        <div>
          <Plx
            tagName="h1"
            className={styles.ruleTop}
            parallaxData={textData}
            style={{ fontSize: 70 }}
          >
            <div>Rule 1</div>
          </Plx>
        </div>
      </div>
      <div style={{ display: "flex" }}>
        <div style={{ height: 300, zIndex: 100 }}>
          <Plx
            tagName="h1"
            className={styles.rule2}
            parallaxData={textData2}
            style={{ fontSize: 70 }}
          >
            <div>Rule 2 </div>
            <div>Smallest Unit </div>
            <div>0.001Ether</div>
          </Plx>
        </div>
        <Explosion />
      </div>
      <div
        style={{
          height: 800,
          paddingLeft: 300,
          display: "flex",
        }}
      >
        <div>
          <Plx
            tagName="h1"
            className={styles.rule3}
            style={{ borderRadius: 20 }}
            parallaxData={textData3}
          >
            <div>Ready to Go </div>
          </Plx>
        </div>
        <div>
          <Plx
            tagName="h1"
            className={styles.rule4}
            parallaxData={textData4}
            style={{ fontSize: 70 }}
          >
            <div>Rule 3 </div>
            <div>Bet as much </div>
            <div>as you can </div>
          </Plx>
        </div>
      </div>
      <Plx tagName="h1" className={styles.rule5} parallaxData={textData5}>
        <div
          className={styles.center}
          style={{ fontSize: 70, cursor: "pointer", color: "#dddddd" }}
          onClick={redirect}
        >
          Enter the Game
        </div>
      </Plx>
    </div>
  );
}
const textData5 = [
  {
    start: "self",
    duration: "80vh",
    properties: [
      {
        startValue: 0,
        endValue: 2,
        property: "scale",
      },
    ],
  },
];
const textData4 = [
  {
    start: "self",
    duration: "70vh",
    properties: [
      {
        startValue: 70,
        endValue: 0,
        unit: "vh",
        property: "translateX",
      },
      {
        startValue: 1,
        endValue: 0.5,
        property: "opacity",
      },
    ],
  },
];
const textData3 = [
  {
    start: "self",
    startOffset: "20vh",
    duration: "60vh",
    properties: [
      {
        startValue: -90,
        endValue: 0,
        property: "rotate",
      },
      {
        startValue: 1,
        endValue: 1.5,
        property: "scale",
      },
      {
        startValue: 1,
        endValue: 0.75,
        property: "opacity",
      },
    ],
  },
  {
    start: "self",
    duration: "100vh",
    // startOffset: "60vh",
    properties: [
      {
        startValue: "#3cb99c",
        endValue: "rgba(50,50,200,0.8)",
        property: "backgroundColor",
      },
      {
        startValue: 0,
        endValue: 60,
        unit: "vh",
        property: "translateY",
      },
      {
        startValue: 0.75,
        endValue: 1,
        property: "opacity",
      },
    ],
  },
];
const textData2 = [
  {
    start: "self",
    duration: "70vh",
    properties: [
      {
        startValue: 0,
        endValue: 40,
        unit: "vh",
        property: "translateX",
      },
      {
        startValue: 0,
        endValue: 1,
        property: "opacity",
      },
    ],
  },
  {
    start: "self",
    startOffset: "50vh",
    duration: "50vh",
    properties: [
      {
        startValue: 40,
        endValue: 100,
        unit: "vh",
        property: "translateX",
      },
      {
        startValue: 1,
        endValue: 0,
        property: "opacity",
      },
    ],
  },
];
const textData = [
  {
    start: "self",
    duration: "30vh",
    properties: [
      {
        startValue: 0,
        endValue: -40,
        unit: "vh",
        property: "translateY",
      },
      {
        startValue: 0,
        endValue: 1,
        property: "opacity",
      },
    ],
  },
  {
    start: "self",
    startOffset: "40vh",
    duration: "30vh",
    properties: [
      {
        startValue: -40,
        endValue: -60,
        unit: "vh",
        property: "translateY",
      },
      {
        startValue: 1,
        endValue: 0,
        property: "opacity",
      },
    ],
  },
];
