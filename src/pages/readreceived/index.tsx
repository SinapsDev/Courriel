import React from "react";
import styles from "./index.module.css";
import SideBar from "~/components/SideBar";
import { api } from "~/utils/api";
import { columns } from "./columns";
import { TableReceived } from "~/components/TableReceived";

const ReadPageReceived = () => {
  const { isLoading } = api.receivedMail.getAll.useQuery({
    skip: 0,
    take: 10,
  });
  const { data: receivedMailLenth, isLoading: isLengthLoading } =
    api.receivedMail.getTotal.useQuery();

  if (isLengthLoading || isLoading || !receivedMailLenth)
    return <div>loading...</div>;

  return (
    <div className={styles.parentContainer}>
      <SideBar />
      <div className={styles.mainContainer}>
        <h1 className={styles.mainTitle}>REGISTRE D'ARRIVEE</h1>
        <div className={styles.tableContainer}>
          <TableReceived columns={columns} totalLength={receivedMailLenth} />
        </div>
      </div>
    </div>
  );
};

export default ReadPageReceived;
