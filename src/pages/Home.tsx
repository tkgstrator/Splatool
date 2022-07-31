import {
  IonContent,
  IonHeader,
  IonList,
  IonListHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import Option from "./Option";
import SignIn from "./SignIn";
import User from "./User";

const Home: React.FC = () => {
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
          <User />
          <IonListHeader>ログイン</IonListHeader>
          <SignIn />
          <IonListHeader>オプション</IonListHeader>
          <Option />
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Home;
