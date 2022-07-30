import "./PlayerContainer.css";
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonItem,
  IonLabel,
  IonList,
  IonText,
  IonAvatar,
  IonThumbnail,
  IonButton,
  IonIcon,
  IonDatetime,
  IonSelect,
  IonSelectOption,
  IonToggle,
  IonInput,
  IonCheckbox,
  IonRange,
  IonNote,
} from "@ionic/react";

interface Player {
  nsaid: string;
  iksm_session: string;
  thumbnail_url: string;
  nickname: string;
  session_token: string;
}

interface ContainerProps {
  player: Player;
}

const ExploreContainer: React.FC<ContainerProps> = ({ player }) => {
  return <IonItem>{player.nsaid}</IonItem>;
};

export default ExploreContainer;
