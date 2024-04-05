import React from "react";
import styles from "./result.module.css";
import SideBar from "~/components/SideBar";
import { columns as receivedColumns } from "~/utils/receivedColumns";
import { columns as sentColumnds } from "~/utils/sentColumns";
import { useRouter } from "next/router";
import { Spinner } from "~/components/Spinner";
import { TableReceiveSearch } from "~/components/TableReceiveSearch";
import { TableSentSearch } from "~/components/TableSentSearch";
import { api } from "~/utils/api";

const ResultPage = () => {
  const router = useRouter();
  let { data }: any = router.query;
  let formData = "{}";
  if (data) {
    formData = data;
  }

  const parsedData = JSON.parse(formData);
  const { data: sentFetchedData, isLoading: isSentLoading } =
    api.sentMail.getByFilter.useQuery(parsedData);
  const { data: receivedFetchedData, isLoading: isReceivedLoading } =
    api.receivedMail.getByFilter.useQuery(parsedData);

  return (
    <div className={styles.parentContainer}>
      <SideBar />
      <div className={styles.mainContainer}>
        <h1 className={styles.mainTitle}>RESULTAT DE LA RECHERCHE</h1>
        {(isSentLoading || isReceivedLoading) && <Spinner />}
        {!isReceivedLoading && parsedData.mailType === "ARRIVE" && (
          <TableReceiveSearch
            columns={receivedColumns}
            data={receivedFetchedData}
          />
        )}
        {!isSentLoading && parsedData.mailType === "DEPART" && (
          <TableSentSearch columns={sentColumnds} data={sentFetchedData} />
        )}
      </div>
    </div>
  );
};

export default ResultPage;
