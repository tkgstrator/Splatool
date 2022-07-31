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
import { useTranslation } from "react-i18next";

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

const Option: React.FC = () => {
  return (
    <IonList>
      <IonItem>
        <IonLabel slot="start">このサイトについて</IonLabel>
        <IonButton slot="end" routerLink="developer">
          情報
        </IonButton>
      </IonItem>
    </IonList>
  );
};

export default Option;
