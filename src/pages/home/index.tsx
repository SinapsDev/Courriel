import React, { useEffect } from "react";
import styles from "./index.module.css";
import { useSession } from "next-auth/react";
import { api } from "~/utils/api";
import SideBar from "~/components/SideBar";
import { InfoBox } from "~/components/InfoBox";
import { Spinner } from "~/components/Spinner";
import Image from "next/image";
import logo from '../../assets/logo.png'

const HomePage = () => {
  const { data: sessionData } = useSession();
  const { data: userPermissions, isLoading: permissionsLoading } =
    api.user.getUserPermissions.useQuery({
      id: sessionData?.user?.id || "",
    });
  const { data: receivedMailDataToday, isLoading: isLoading1 } =
    api.receivedMail.getNumberOfMailsInDetailsForToday.useQuery();
  const { data: receivedMailDataWeek, isLoading: isLoading2 } =
    api.receivedMail.getNumberOfMailsInDetailsForThisWeek.useQuery();
  const { data: sentMailDataToday, isLoading: isLoading3 } =
    api.sentMail.getNumberOfMailsInDetailsForToday.useQuery();
  const { data: sentMailDataWeek, isLoading: isLoading4 } =
    api.sentMail.getNumberOfMailsInDetailsForThisWeek.useQuery();
  const mutation = api.permission.createDefaultPermissions.useMutation();

  useEffect(() => {
    if (!permissionsLoading) {
      if (!userPermissions) {
        mutation.mutate({ userId: sessionData?.user.id || "" });
      }
    }
  }, [permissionsLoading, userPermissions]);

  if (!sessionData) return null;
  if (permissionsLoading)
    return (
      <div className={styles.parentContainer}>
        <Spinner />
      </div>
    );

  if (!userPermissions?.canAccess && !userPermissions?.isAdmin) {
    return (
      <div className={styles.parentContainer}>
        VOUS N'AVEZ PAS LA PERMISSION D'ACCEDER A CETTE PAGE
      </div>
    );
  }

  return (
    <div className={styles.parentContainer}>
      {isLoading1 ||
      isLoading2 ||
      isLoading3 ||
      isLoading4 ||
      permissionsLoading ? (
        <Spinner />
      ) : (
        <>
          <SideBar />
          <div className={styles.homeContainer}>
            <Image style={{
              margin: '3px auto'
            }} height={80} src={logo} alt="logo" />
            <h1 className={styles.mainTitle}>Gestion Électronique du Courrier</h1>
            <div className={styles.infoContainer}>
              <InfoBox
                title="Nombre de courriel envoyé aujourd'hui"
                value={sentMailDataToday?.total || 0}
                important={sentMailDataToday?.important || 0}
              />
              <InfoBox
                title="Nombre de courriel reçu aujourd'hui"
                value={receivedMailDataToday?.total || 0}
                important={receivedMailDataToday?.important || 0}
              />
              <InfoBox
                title="Nombre de courriel envoyé cette semaine"
                value={sentMailDataWeek?.total || 0}
                important={sentMailDataWeek?.important || 0}
              />
              <InfoBox
                title="Nombre de courriel reçu cette semaine"
                value={receivedMailDataWeek?.total || 0}
                important={receivedMailDataWeek?.important || 0}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default HomePage;
