import {
  IonAvatar,
  IonButton,
  IonContent,
  IonHeader,
  IonImg,
  IonItem,
  IonItemGroup,
  IonLabel,
  IonList,
  IonListHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  useIonToast,
  useIonViewWillEnter,
} from "@ionic/react";
import "./User.css";
import { Buffer } from "buffer";
import axios, { AxiosError } from "axios";
import dayjs from "dayjs";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import SignIn from "./SignIn";

interface OAuth {
  oauthURL: string;
  session_token_verifier: string;
}

export interface SplatNet2 {
  nickname: string;
  nsaid: string;
  session_token: string;
  iksm_session: string;
  thumbnail_url: string;
  expires_in: number;
}

export interface APIError {
  error: string;
  error_description: string;
  errorMessage: string;
}

const User: React.FC = () => {
  const { t } = useTranslation();
  const [sessionTokenCode, setCode] = useState<string>();
  const [sessionTokenCodeVerifier, setVerifier] = useState<string>();
  const [inProcess, setValue] = useState<boolean>();
  const [present, dismiss] = useIonToast();
  const [isAvailable, setToggle] = useState<boolean>();
  const [account, setAccount] = useState(() => {
    return JSON.parse(localStorage.getItem("account") ?? "{}") as SplatNet2;
  });

  function getRecord() {
    const token = Buffer.from(account.iksm_session).toString("base64");
    const url = `https://splatool.net/records/?iksm=${token}`;
    window.open(url);
  }

  function getResult() {
    const token = Buffer.from(account.iksm_session).toString("base64");
    const url = `https://splatool.net/analytics/?iksm=${token}`;
    window.open(url);
  }

  async function expired() {
    account.expires_in = 0;
    localStorage.setItem("account", JSON.stringify(account));
    setAccount(account);
    setToggle(false);
  }

  async function activate() {
    account.expires_in = dayjs(new Date()).unix() + 86400;
    localStorage.setItem("account", JSON.stringify(account));
    setAccount(account);
    setToggle(true);
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
      setToggle(true);
    } catch (error) {
      const response = (error as AxiosError).response?.data as APIError;
      const error_description =
        response.error_description ?? response.errorMessage;
      present({
        message: t(error_description),
        duration: 3000,
      });
    }
    setValue(false);
  }

  useIonViewWillEnter(() => {
    setToggle(dayjs(new Date()).unix() <= account.expires_in);
    setValue(false);
    setAccount(
      JSON.parse(localStorage.getItem("account") ?? "{}") as SplatNet2
    );
  });

  return (
    <IonList>
      <IonItemGroup>
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
          <IonLabel>認証トークン</IonLabel>
          <IonButton onClick={getCookie} disabled={inProcess}>
            更新
          </IonButton>
        </IonItem>
        <IonItem>
          <IonLabel>対戦分析ツール</IonLabel>
          <IonButton onClick={getResult} disabled={!isAvailable}>
            {isAvailable ? "分析する" : "トークンを更新してください"}
          </IonButton>
        </IonItem>
        <IonItem>
          <IonLabel>対戦記録ツール</IonLabel>
          <IonButton onClick={getRecord} disabled={!isAvailable}>
            {isAvailable ? "記録する" : "トークンを更新してください"}
          </IonButton>
        </IonItem>
      </IonItemGroup>
      {/* <IonItem>
        <IonLabel>初期化</IonLabel>
        <IonButton onClick={expired}>有効期限初期化</IonButton>
      </IonItem>
      <IonItem>
        <IonLabel>初期化</IonLabel>
        <IonButton onClick={activate}>有効期限復活</IonButton>
      </IonItem> */}
    </IonList>
  );
};

export default User;
