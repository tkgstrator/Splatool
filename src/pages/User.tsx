import {
  IonAvatar,
  IonButton,
  IonContent,
  IonHeader,
  IonImg,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonTitle,
  IonToolbar,
  useIonToast,
  useIonViewWillEnter,
} from "@ionic/react";
import "./User.css";
import { APIError, SplatNet2 } from "./SignIn";
import { Buffer } from "buffer";
import axios, { AxiosError } from "axios";
import dayjs from "dayjs";
import { useState } from "react";

const User: React.FC = () => {
  const [inProcess, setValue] = useState<boolean>();
  const [present, dismiss] = useIonToast();

  const [account, setAccount] = useState(() => {
    return JSON.parse(localStorage.getItem("account") ?? "{}") as SplatNet2;
  });

  function getResult() {
    const token = Buffer.from(account.iksm_session).toString("base64");
    const url = `https://splatool.net/analytics/?iksm=${token}`;
    window.open(url);
  }

  async function getCookie() {
    try {
      setValue(true);
      const url = `${process.env.REACT_APP_SERVER_URL}/cookie`;
      const parameters = {
        session_token: account.session_token,
      };
      const response = (await axios.post(url, parameters)).data as SplatNet2;
      localStorage.setItem("account", JSON.stringify(response));
      setAccount(response);
      present({
        message: "トークン更新成功しました",
        duration: 3000,
      });
    } catch (error) {
      const response = (error as AxiosError).response?.data as APIError;
      present({
        message: response.error_description,
        duration: 3000,
      });
    }
    setValue(false);
  }

  useIonViewWillEnter(() => {
    setValue(false);
    setAccount(
      JSON.parse(localStorage.getItem("account") ?? "{}") as SplatNet2
    );
  });

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>User</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">User</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonList>
          <IonItem>
            <IonAvatar>
              <IonImg src={account.thumbnail_url}></IonImg>
            </IonAvatar>
            <IonLabel slot="end">{account.nickname}</IonLabel>
          </IonItem>
          <IonItem>
            <IonLabel>有効期限</IonLabel>
            <IonLabel slot="end">
              {dayjs.unix(account.expires_in).format("YYYY/MM/DD HH:mm:ss")}
            </IonLabel>
          </IonItem>
          <IonItem>
            <IonLabel>トークン更新</IonLabel>
            <IonButton onClick={getCookie} disabled={inProcess}>
              更新
            </IonButton>
          </IonItem>
          <IonItem>
            <IonLabel>リザルト登録</IonLabel>
            <IonButton onClick={getResult}>ウェブサイトを開く</IonButton>
          </IonItem>
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default User;
