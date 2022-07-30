import {
  IonButton,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonTitle,
  IonToolbar,
  useIonToast,
  useIonViewWillEnter,
} from "@ionic/react";
import { useRef, useState } from "react";
import "./SignIn.css";
import axios, { AxiosError } from "axios";

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
}

const SignIn: React.FC = () => {
  const [inProcess, setValue] = useState<boolean>();
  const [sessionTokenCode, setCode] = useState<string>();
  const [sessionTokenCodeVerifier, setVerifier] = useState<string>();
  const [present, dismiss] = useIonToast();

  async function getOAuthURL() {
    const url = `${process.env.REACT_APP_SERVER_URL}/authorize`;
    const response = (await (await fetch(url)).json()) as OAuth;
    const verifier = response.session_token_verifier;
    setVerifier(verifier);
    window.open(response.oauthURL, "_blank");
  }

  useIonViewWillEnter(() => {
    setValue(false);
  });

  async function getCookie() {
    try {
      setValue(true);
      const url = `${process.env.REACT_APP_SERVER_URL}/login`;
      const parameters = {
        session_token_code: sessionTokenCode,
        session_token_code_verifier: sessionTokenCodeVerifier,
      };
      const response = (await axios.post(url, parameters)).data as SplatNet2;
      localStorage.setItem("account", JSON.stringify(response));
      present({
        message: response.nickname + "さんにログインしました",
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

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>SignIn</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">SignIn</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonList>
          <IonItem>
            <IonLabel slot="start">イカリング2</IonLabel>
            <IonButton slot="end" onClick={getOAuthURL}>
              リンクを開く
            </IonButton>
          </IonItem>
          <IonItem>
            <IonLabel slot="start">URL入力</IonLabel>
            <IonInput
              type="password"
              value={sessionTokenCode}
              onIonChange={(e) => setCode(e.detail.value!)}
            ></IonInput>
          </IonItem>
          <IonItem>
            <IonLabel slot="start">ログイン</IonLabel>
            <IonButton slot="end" onClick={getCookie} disabled={inProcess}>
              連携
            </IonButton>
          </IonItem>
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default SignIn;
