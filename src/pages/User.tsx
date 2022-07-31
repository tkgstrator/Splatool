import {
  IonAvatar,
  IonButton,
  IonImg,
  IonItem,
  IonItemGroup,
  IonLabel,
  IonList,
  useIonToast,
  useIonViewDidEnter,
  useIonViewWillEnter,
} from "@ionic/react";
import "./User.css";
import { Buffer } from "buffer";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
import { SplatNet2Props } from "./Home";
import { useState } from "react";
import axios, { AxiosError } from "axios";
import { APIError, SplatNet2 } from "./SignIn";

enum StateType {
  Valid,
  Undefined,
  Expired,
}

const User: React.FC<SplatNet2Props> = ({ account, setAccount }) => {
  const { t } = useTranslation();
  const [present] = useIonToast();
  const [isDisabled, setToggle] = useState<boolean>(true);

  const [state, setState] = useState<StateType>(StateType.Undefined);
  const [expiredTime, setExpiredTime] = useState<string>();

  useIonViewDidEnter(() => {
    // アカウントがログイン済みであれば更新ボタンを押せるようにする
    setToggle(account.session_token === undefined);
    // トークンが有効かどうかのチェック
    if (account.session_token === undefined) {
      setState(StateType.Undefined);
    } else if (account.expires_in >= dayjs().unix()) {
      setState(StateType.Valid);
    } else {
      setState(StateType.Expired);
    }
    // 期限が切れる時間の表示
    setExpiredTime(
      dayjs.unix(account.expires_in).format("YYYY/MM/DD HH:mm:ss")
    );
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

  function getButtonText(message: string) {
    switch (state) {
      case StateType.Valid:
        return message;
      case StateType.Expired:
        return "トークン更新してください";
      case StateType.Undefined:
        return "アカウント連携してください";
    }
  }

  async function getCookie() {
    setToggle(true);
    const url = `${process.env.REACT_APP_SERVER_URL}/cookie`;
    const parameters = {
      session_token: account.session_token,
    };
    try {
      // 取得したデータを文字列化
      const response = JSON.stringify((await axios.post(url, parameters)).data);
      // ローカルに保存
      localStorage.setItem("account", response);
      // オブジェクトに変換して保存
      const account = JSON.parse(response) as SplatNet2;
      setAccount(account);
      present({
        message: account.nickname + "でログインしました",
        duration: 3000,
      });
      setExpiredTime(
        dayjs.unix(account.expires_in).format("YYYY/MM/DD HH:mm:ss")
      );
      setToggle(false);
    } catch (error) {
      const { error_description, errorMessage } = (error as AxiosError).response
        ?.data as APIError;
      // エラーメッセージを翻訳して表示
      const message = t(error_description || errorMessage);
      present({
        message: message,
        duration: 3000,
      });
      setToggle(false);
    }
  }

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
          <IonLabel slot="end">{expiredTime}</IonLabel>
        </IonItem>
        <IonItem>
          <IonLabel>認証トークン</IonLabel>
          <IonButton onClick={getCookie} disabled={isDisabled}>
            更新
          </IonButton>
        </IonItem>
        <IonItem>
          <IonLabel>対戦分析ツール</IonLabel>
          <IonButton
            onClick={getResult}
            disabled={!(state === StateType.Valid)}
          >
            {getButtonText("分析する")}
          </IonButton>
        </IonItem>
        <IonItem>
          <IonLabel>対戦記録ツール</IonLabel>
          <IonButton
            onClick={getRecord}
            disabled={!(state === StateType.Valid)}
          >
            {getButtonText("記録をみる")}
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
