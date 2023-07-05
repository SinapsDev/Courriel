import React from "react";
import styles from "./index.module.css";
import SideBar from "~/components/SideBar";
import { api } from "~/utils/api";
import { TableSent } from "~/components/TableSent";
import { columns } from "~/utils/columns";

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
        <h1 className={styles.mainTitle}>REGISTRE DE DEPART</h1>
        <div className={styles.tableContainer}>
          <TableSent columns={columns} totalLength={sentMailLenth} />
        </div>
      </div>
    </div>
  );
};

export default ReadPage;
