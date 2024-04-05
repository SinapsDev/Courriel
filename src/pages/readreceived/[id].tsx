import React from "react";
import styles from "./mailData.module.css";
import SideBar from "~/components/SideBar";
import { api } from "~/utils/api";
import { Spinner } from "~/components/Spinner";
import Image from "next/image";
import logo from "~/assets/logo.png";

const MailData = ({ id }: any) => {
  let mailId = parseInt(id);
  const { data: mailData, isLoading } = api.receivedMail.getById.useQuery({
    id: mailId,
  });

  if (!mailData) return <Spinner />;

  const filesUrls = JSON.parse(mailData.filesUrls);

  return (
    <div className={styles.parentContainer}>
      <SideBar />
      <div className={styles.mainContainer}>
        <Image
          style={{
            margin: "3px auto",
          }}
          height={80}
          src={logo}
          alt="logo"
        />
        <h1 className={styles.mainTitle}>INFORMATIONS DU COURRIEL</h1>
        {isLoading || !mailData ? (
          <Spinner />
        ) : (
          <div className={styles.mailDataContainer}>
            <div className={styles.mailData}>
              <p className={styles.mailDataTitle}>NUMERO D'ORDRE:</p>
              <p className={styles.mailDataContent}>{mailData.orderNumber}</p>
            </div>
            <div className={styles.mailData}>
              <p className={styles.mailDataTitle}>DATE D'ARRIVEE:</p>
              <p className={styles.mailDataContent}>
                {new Date(mailData.date).toLocaleDateString()}
              </p>
            </div>
            <div className={styles.mailData}>
              <p className={styles.mailDataTitle}>EXPEDITEUR:</p>
              <p className={styles.mailDataContent}>{mailData.sender}</p>
            </div>
            <div className={styles.mailData}>
              <p className={styles.mailDataTitle}>OBJET:</p>
              <p className={styles.mailDataContent}>{mailData.object}</p>
            </div>
            <div className={styles.mailData}>
              <p className={styles.mailDataTitle}>IMPORTANCE:</p>
              <p className={styles.mailDataContent}>{mailData.importance}</p>
            </div>
            <div className={styles.files}>
              <p className={styles.filesTitle}>FICHIERS:</p>
              {filesUrls.map((file: any) => {
                return (
                  <a
                    className={styles.file}
                    href={file}
                    target="_blank"
                    rel="noreferrer"
                  >
                    CLICKER POUR VOIR LE(S) DOCUMENT(S)
                  </a>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MailData;

// get props from page url
export const getServerSideProps = async (context: any) => {
  const id = context.params.id;
  return {
    props: {
      id,
    },
  };
};
