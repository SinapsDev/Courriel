import React from "react";
import styles from "./index.module.css";
import { useSession } from "next-auth/react";
import { api } from "~/utils/api";
import SideBar from "~/components/SideBar";
import { InfoBox } from "~/components/InfoBox";

const HomePage = () => {
  const { data: sessionData } = useSession();
  const { data: receivedMailDataToday, isLoading: isLoading1 } =
    api.receivedMail.getNumberOfMailsInDetailsForToday.useQuery();
  const { data: receivedMailDataWeek, isLoading: isLoading2 } =
    api.receivedMail.getNumberOfMailsInDetailsForThisWeek.useQuery();
  const { data: sentMailDataToday, isLoading: isLoading3 } =
    api.sentMail.getNumberOfMailsInDetailsForToday.useQuery();
  const { data: sentMailDataWeek, isLoading: isLoading4 } =
    api.sentMail.getNumberOfMailsInDetailsForThisWeek.useQuery();
  if (!sessionData) return null;

  return (
    <div className={styles.parentContainer}>
      <SideBar />
      <div className={styles.homeContainer}>
        <h1 className={styles.mainTitle}>REGISTRE BUREAU D&apos;ORDRE</h1>
        <div className={styles.infoContainer}>
          <InfoBox
            title="Nombre de courriel envoyé aujourd'hui"
            value={sentMailDataToday?.total || 0}
            important={sentMailDataToday?.important || 0}
          />
          <InfoBox
            title="Nombre de courriel recu aujourd'hui"
            value={receivedMailDataToday?.total || 0}
            important={receivedMailDataToday?.important || 0}
          />
          <InfoBox
            title="Nombre de courriel envoyé cette semaine"
            value={sentMailDataWeek?.total || 0}
            important={sentMailDataWeek?.important || 0}
          />
          <InfoBox
            title="Nombre de courriel recu cette semaine"
            value={receivedMailDataWeek?.total || 0}
            important={receivedMailDataWeek?.important || 0}
          />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
