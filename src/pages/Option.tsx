import { IonButton, IonItem, IonLabel, IonList } from "@ionic/react";
import { SplatNet2Props } from "./Home";
import { SplatNet2 } from "./SignIn";

const Option: React.FC<SplatNet2Props> = ({ account, setAccount }) => {
  function signOut() {
    const account = JSON.parse("{}") as SplatNet2;
    localStorage.setItem("account", JSON.stringify(account));
    setAccount(account);
  }

  return (
    <IonList>
      <IonItem>
        <IonLabel slot="start">このサイトについて</IonLabel>
        <IonButton slot="end" routerLink="developer">
          情報
        </IonButton>
      </IonItem>
      <IonItem>
        <IonLabel slot="start">ログアウト</IonLabel>
        <IonButton slot="end" onClick={signOut}>
          ログアウトする
        </IonButton>
      </IonItem>
    </IonList>
  );
};

export default Option;
