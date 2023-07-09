import { ColumnFilter } from "~/components/TableSent/ColumnFilter";

export const columns = [
  {
    Header: "Numero d'ordre",
    accessor: "orderNumber",
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
    Header: "Pieces Jointes",
    accessor: "attachments",
    Cell: (props: any) => {
      const rowData = props.cell.row.original;
      return (
        <a
          href={`/readsent/${rowData.id}`}
          style={{
            textDecoration: "none",
            color: "#000",
          }}
        >
          Appuyez pour voir
        </a>
      );
    },
    disableFilters: true,
  },
];
