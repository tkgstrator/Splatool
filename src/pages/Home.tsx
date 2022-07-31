import {
  IonContent,
  IonHeader,
  IonList,
  IonListHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  useIonViewWillEnter,
} from "@ionic/react";
import { Dispatch, SetStateAction, useState } from "react";
import Option from "./Option";
import SignIn, { SplatNet2 } from "./SignIn";
import User from "./User";

export interface SplatNet2Props {
  account: SplatNet2;
  setAccount: Dispatch<SetStateAction<SplatNet2>>;
}

const Home: React.FC = () => {
  const [account, setAccount] = useState(() => {
    return JSON.parse(localStorage.getItem("account") ?? "{}") as SplatNet2;
  });

  useIonViewWillEnter(() => {});

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Splatool</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonList>
          <IonListHeader>アカウント</IonListHeader>
          <User account={account} setAccount={setAccount} />
          <IonListHeader>ログイン</IonListHeader>
          <SignIn account={account} setAccount={setAccount} />
          <IonListHeader>オプション</IonListHeader>
          <Option account={account} setAccount={setAccount} />
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Home;
