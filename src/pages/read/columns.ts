import { ColumnFilter } from "~/components/Table/ColumnFilter";

export const columns = [
    {
      Header: "Numero d'ordre",
      accessor: "id",
      Filter: ColumnFilter,
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