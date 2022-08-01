import {
  IonButton,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  useIonToast,
} from "@ionic/react";
import axios, { AxiosError } from "axios";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { SplatNet2Props } from "./Home";

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

const SignIn: React.FC<SplatNet2Props> = ({ setAccount }) => {
  const { t } = useTranslation();
  const [present] = useIonToast();
  const verifier = useRef<string>();
  const session_token_code = useRef<string>();
  const [isDisabled, toggleValue] = useState<boolean>(false);

  async function getOAuthURL() {
    const url = `${process.env.REACT_APP_SERVER_URL}/authorize`;
    const { session_token_verifier, oauthURL } = (await (
      await fetch(url)
    ).json()) as OAuth;
    verifier.current = session_token_verifier;
    const newPage = window.open()!;
    newPage.location.href = oauthURL;
  }

  async function getCookie() {
    toggleValue(true);
    const url = `${process.env.REACT_APP_SERVER_URL}/login`;
    const parameters = {
      session_token_code_verifier: verifier.current,
      session_token_code: session_token_code.current,
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
      toggleValue(false);
    } catch (error) {
      const { error_description, errorMessage } = (error as AxiosError).response
        ?.data as APIError;
      // エラーメッセージを翻訳して表示
      const message = t(error_description || errorMessage);
      present({
        message: message,
        duration: 3000,
      });
      toggleValue(false);
    }
  }

  return (
    <IonList>
      <IonItem>
        <IonLabel slot="start">イカリング2</IonLabel>
        <IonButton slot="end" onClick={getOAuthURL}>
          リンクを開く
        </IonButton>
      </IonItem>
      <IonItem>
        <IonInput
          type="password"
          value={session_token_code.current}
          placeholder="URLをここに貼り付けてください"
          onIonChange={(e) => (session_token_code.current = e.detail.value!)}
        ></IonInput>
        <IonButton slot="end" onClick={getCookie} disabled={isDisabled}>
          連携
        </IonButton>
      </IonItem>
    </IonList>
  );
};

export default SignIn;
