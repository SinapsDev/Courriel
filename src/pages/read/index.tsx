import React from "react";
import styles from "./index.module.css";
import SideBar from "~/components/SideBar";
import { api } from "~/utils/api";
import { Table } from "~/components/Table";
import { ColumnFilter } from "~/components/Table/ColumnFilter";
import { makeDataDateToString } from "../../utils/makeDataDateToString";

const ReadPage = () => {
  const { data: fetchedData, isLoading } = api.sentMail.getAll.useQuery({
    skip: 0,
    take: 10,
  });
  const { data: sentMailLenth, isLoading: isLengthLoading } =
    api.sentMail.getTotal.useQuery();

  const columns = [
    {
      Header: "Numero d'ordre",
      accessor: "id",
      disableFilters: true,
    },
    {
      Header: "Adresse",
      accessor: "address",
      Filter: ColumnFilter,
    },
    {
      Header: "Date",
      accessor: "date",
      Filter: ColumnFilter,
    },
    {
      Header: "Objet de la correspondance",
      accessor: "object",
      Filter: ColumnFilter,
    },
    {
      Header: "Destinataire",
      accessor: "receiver",
      Filter: ColumnFilter,
    },
    {
      Header: "Importance",
      accessor: "importance",
      Filter: ColumnFilter,
    },
    {
      Header: "Transmission",
      accessor: "transmission",
      Filter: ColumnFilter,
    },
  ];

  const data = makeDataDateToString(fetchedData);
  const tableData = React.useMemo(() => data, [data]);
  if (isLoading || !data || isLengthLoading || !sentMailLenth)
    return <div>loading...</div>;

  return (
    <div className={styles.parentContainer}>
      <SideBar />
      <div className={styles.mainContainer}>
        <h1 className={styles.mainTitle}>REGISTRE BUREAU D'ORDRE</h1>
        {!isLoading && (
          <div className={styles.tableContainer}>
            <Table
              fetchedData={tableData}
              columns={columns}
              totalLength={sentMailLenth}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ReadPage;
