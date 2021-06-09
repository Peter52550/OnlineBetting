import { Checkbox } from "antd";
import { useHistory } from "react-router-dom";
import styles from "./index.module.css";
import { InfoAPI, AdderAPI } from "../../api";
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
  return (
    <div>
      <h1>規則說明</h1>
      <div>
        小交警走上前來，給司機敬了一個標準的軍禮：〝同志，你違反交通規則，請下車接受處罰。〞
        「我是市局的。」司機傲慢地說。
        〝不管是什麼地方的，違反交通規則都要接受處罰。〞
        司機哼了一聲，向後擺頭：「王局長在車裏。」
        小交警向車後跨了一步，敬了個軍禮。
        「行了，」司機不耐煩地說：「局長要到局裏開個緊急會議，趕時間，所以才......行了你，放行吧。」
        小交警一轉身急跨兩步，站在車前：〝不行，不管是誰，違反了交通規則都要接受處罰。〞
        「你......」司機火了，「我說你怎麼這麼不給面子呢？」
        小交警仍然是那麼平靜：〝執行法律是我的職責。〞
        「你是哪個隊的，叫什麼名字？」司機大聲問。
        〝我是三大隊的，名叫王小鵬。〞 「你們大隊長的電話號碼是多少？」
        〝你是問他辦公室的電話？還是問他家的電話，還是他的手機？〞
        「好好好。」司機沒法，只好下車，「你罰吧。」
        小交警掏出票據，開罰款單，又在司機扔過來的駕駛證上扣了兩分，然後抬起頭：〝同志，作為司機，要嚴格遵守交通規則，
        尤其作為員警更應模範遵守交通規則。不能因為你是局裏的甚至是局長就可以違反交通規則；我們交警也不能因為你是局裏的，
        甚至是局長而不處罰你違反交通規則的行為。法律是給所有的人定的，沒有特殊公民。為了您和他人的安全，希望您這是最後一次違規。〞
        說著，將罰款收據和駕駛證雙手遞給司機，〝請到農行交罰款。〞
        說完，他向旁邊跨了一步，讓開路。
        司機一頭紮進駕駛室，砰地關上車門，又一扭頭狠狠地瞪了小交警一眼：「行，我記住你了。」
        王局長到了局裏，直奔會議室，會議室裏開會的人員都已到齊。
        “同志們，”王局長坐下後嚴肅地說：“我今天來晚了，因為什麼來晚了呢，因為我被一名小交警截住了；
        因為什麼截住了呢？因為趕時間，我要司機違反交通規則駕車上了人行道。”
        這名小交警知道我是局長，知道我要開會，可沒給面子，堅持進行了處罰。
        局長一拍桌子，“好，因為他懂得法律法規面前人人平等，因為他知道自己的職責所在？他不畏官、不怕權，好樣的。
        我擔任局長四年來，曾多次違反交通規則，如為趕時間超速行駛、闖紅燈，可都沒有受到處罰，有些交警看到是我的車反而還給我敬禮。
        只有這次我受到了處罰，罰得好。如果我們的交警都能像這名小交警，他叫......噢，他是三大隊的，叫王小鵬。
        要是我們的交警都像他那樣嚴格執法，我市的交通秩序一定會有很大的變化；
        如果我們的幹部能像他那樣，我們的交警隊伍就會出現一大批嚴格執法的榜樣。”
        王局長激動地站了起來，“我們就要用這樣的幹部，三大隊尚缺一名副大隊長，我們提議，把這名小交警破格提拔為副大隊長。”
        說著，王局長第一個舉起了右手，環顧四座，所有的人都舉起了右手。
        晚上王局長回家，開門的正是白天截他車的那名小交警王小鵬。
        〝怎麼樣？〞王小鵬有些緊張地問。
        “通過了。”王局長笑著把公事包遞給王小鵬。
        王小鵬一下抱住了王局長：〝三叔，你這招實在是高呀。〞
      </div>
      <div className={styles.center}>
        <Checkbox onClick={redirect}>已詳閱此此地規則，進入遊戲</Checkbox>
      </div>
    </div>
  );
}
