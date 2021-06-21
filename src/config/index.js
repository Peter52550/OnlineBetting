import none from "../icons/none.svg";
import cop from "../icons/copper.png";
import gold from "../icons/golden.svg";
import diam from "../icons/diamond.svg";

export const memberships = {
  none: {
    src: none,
    tooltip: "尚無會員",
  },
  copper: {
    src: cop,
    tooltip: "古銅會員",
  },
  golden: {
    src: gold,
    tooltip: "黃金會員",
  },
  diamond: {
    src: diam,
    tooltip: "鑽石會員",
  },
};
export const areas = [
  "Taiwan",
  "China",
  "USA",
  "UK",
  "Japan",
  "Korea",
  "Canada",
  "Egypt",
  "Spain",
  "Italy",
];
export const categories = [
  "news",
  "politics",
  "sports",
  "music",
  "meme",
  "art",
  "bitcoin",
  "school",
  "tech",
  "car",
];
export const status = [0, 1, 2, 3];
export const paths = {
  news: [
    {
      name: "寶島",
      bets: [],
    },
    {
      name: "支那",
      bets: [],
    },
    {
      name: "美國",
      bets: [],
    },
    {
      name: "歐洲",
      bets: [],
    },
  ],
  politics: [
    {
      name: "寶島",
      bets: [],
    },
    {
      name: "支那",
      bets: [],
    },
    {
      name: "美國",
      bets: [],
    },
    {
      name: "歐洲",
      bets: [],
    },
  ],
  sports: [
    {
      name: "籃球",
      bets: [],
    },
    {
      name: "棒球",
      bets: [],
    },
    {
      name: "保齡球",
      bets: [],
    },
    {
      name: "獄囚",
      bets: [],
    },
  ],
};
export const cardUserBetting = [
  {
    user_id: "ahf8we7fojewo",
    bet_id: "77777",
    title: "明天確診人數會破600嗎",
    lowerbound: 10,
    token: [20, 3],
    upperbound: 100,
    publishTime: "2021-05-30 00:56:30",
    lastBetTime: "2021-05-30 00:56:30",
    betType: "trueFalse",
    options: [true, false],
    status: 1,
  },
  {
    user_id: "shfi69wefo0021",
    bet_id: "88888",
    title: "下一任台北4漲",
    lowerbound: 0,
    token: [60, 20, 2],
    upperbound: 100,
    publishTime: "2021-05-30 00:56:30",
    lastBetTime: "2021-05-30 00:56:30",
    betType: "multipleChoice",
    options: ["雞排妹", "柯p", "冰鳥"],
    status: 1,
  },
];
export const publicCards = [
  { ...cardUserBetting },
  {
    user_id: "ahf8we7fojewo",
    bet_id: "444",
    title: "我明天會吃得到炸雞嗎",
    lowerbound: 10,
    token: [20, 3],
    upperbound: 100,
    publishTime: "2021-05-30 00:56:30",
    lastBetTime: "2021-05-30 00:56:30",
    betType: "trueFalse",
    options: ["會", "不會"],
    status: 2,
  },
  {
    user_id: "shfi69wefo0021",
    bet_id: "11111",
    title: "什麼時候可以出去玩啊QQ",
    lowerbound: 0,
    token: [60, 20, 2],
    upperbound: 100,
    publishTime: "2021-05-30 00:56:30",
    lastBetTime: "2021-05-30 00:56:30",
    betType: "multipleChoice",
    options: ["等一下", "你沒有妹妹", "再等一百年"],
    status: 2,
  },
];
