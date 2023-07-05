import React from "react";
import styles from "./index.module.css";
import SideBar from "~/components/SideBar";
import { api } from "~/utils/api";
import { Table } from "~/components/Table";
import { columns } from "./columns";

const ReadPage = () => {
  const { isLoading } = api.sentMail.getAll.useQuery({
    skip: 0,
    take: 10,
  });
  const { data: sentMailLenth, isLoading: isLengthLoading } =
    api.sentMail.getTotal.useQuery();

  if (isLengthLoading || isLoading || !sentMailLenth)
    return <div>loading...</div>;

  return (
    <div className={styles.parentContainer}>
      <SideBar />
      <div className={styles.mainContainer}>
        <h1 className={styles.mainTitle}>REGISTRE BUREAU D'ORDRE</h1>
        <div className={styles.tableContainer}>
          <Table columns={columns} totalLength={sentMailLenth} />
        </div>
      </div>
    </div>
  );
};

export default ReadPage;
