import { IonButton, IonItem, IonLabel, IonList } from "@ionic/react";

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
