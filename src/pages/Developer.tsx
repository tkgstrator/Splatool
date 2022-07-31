import {
  IonAvatar,
  IonContent,
  IonHeader,
  IonImg,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import "./Developer.css";

const Developer: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Developer</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Developer</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonList>
          <IonItem>
            <IonAvatar>
              <IonImg src="https://pbs.twimg.com/profile_images/1546752929637421056/BJ2TeHIl_400x400.jpg"></IonImg>
            </IonAvatar>
            <IonLabel slot="end">@tkgling</IonLabel>
          </IonItem>
          <IonItem>
            <IonLabel>Ionic CLI</IonLabel>
            <IonLabel slot="end">6.20.1</IonLabel>
          </IonItem>
          <IonItem>
            <IonLabel>Ionic Framework</IonLabel>
            <IonLabel slot="end">@ionic/react 6.2.0</IonLabel>
          </IonItem>
          <IonItem>
            <IonLabel>NodeJS</IonLabel>
            <IonLabel slot="end">v17.9.1</IonLabel>
          </IonItem>
          <IonItem>
            <IonLabel>Capacitor CLI</IonLabel>
            <IonLabel slot="end">4.0.1</IonLabel>
          </IonItem>
          <IonItem>
            <IonLabel>cordova-res</IonLabel>
            <IonLabel slot="end">0.15.4</IonLabel>
          </IonItem>
          <IonItem>
            <IonLabel>native-run</IonLabel>
            <IonLabel slot="end">1.6.0</IonLabel>
          </IonItem>
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Developer;
