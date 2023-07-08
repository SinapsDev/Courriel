import { ColumnFilter } from "~/components/TableReceived/ColumnFilter";

export const columns = [
  {
    Header: "Numero d'ordre",
    accessor: "id",
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
    Header: "Expéditeur",
    accessor: "receiver",
    Filter: ColumnFilter,
  },
  {
    Header: "Importance",
    accessor: "importance",
    Filter: ColumnFilter,
  },
  {
    Header: "Pieces Jointes",
    accessor: "attachments",
    Cell: (props: any) => {
      const rowData = props.cell.row.original;
      return (
        <a
          href={`/readreceived/${rowData.id}`}
          style={{
            textDecoration: "none",
            color: "white",
          }}
        >
          Appuyez pour voir
        </a>
      );
    },
    disableFilters: true,
  },
];
