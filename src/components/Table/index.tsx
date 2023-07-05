import React from "react";
import {
  useTable,
  useGlobalFilter,
  useFilters,
  usePagination,
} from "react-table";
import { GlobalFilter } from "./GlobalFilter";
import { api } from "~/utils/api";
import { makeDataDateToString } from "~/utils/makeDataDateToString";

interface Iprops {
  columns: any;
  totalLength: number;
}

export const Table = ({ columns, totalLength }: Iprops) => {
  const [controller, setController] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const { data: fetchedData, isLoading } = api.sentMail.getAll.useQuery({
    skip: Math.abs(controller.pageIndex * controller.pageSize),
    take: controller.pageSize,
  });

  const modifiedData = makeDataDateToString(fetchedData);
  const tableData = React.useMemo(() => modifiedData, [modifiedData]);
  const [data, setData] = React.useState(tableData);
  // @ts-ignore
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    // @ts-ignore
    page,
    prepareRow,
    state,
    // @ts-ignore
    nextPage,
    // @ts-ignore
    previousPage,
    // @ts-ignore
    setGlobalFilter,
    // @ts-ignore
    canNextPage,
    // @ts-ignore
    canPreviousPage,
    // @ts-ignore
    pageOptions,
    // @ts-ignore
    gotoPage,
    // @ts-ignore
    pageCount,
  } = useTable(
    // @ts-ignore
    {
      columns,
      // @ts-ignore
      data,
      // @ts-ignore
      manualPagination: true,
      initialState: {
        // @ts-ignore
        pageIndex: 0,
        pageSize: 10,
      },
    },
    useFilters,
    useGlobalFilter,
    usePagination
  );

  // @ts-ignore
  const { globalFilter, pageIndex, pageSize } = state;

  React.useEffect(() => {
    if (isLoading) return;
    setData(tableData);
  }, [pageIndex, pageSize, fetchedData]);

  if (isLoading || !data) return <div>loading...</div>;
  return (
    <>
      <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} />
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => {
            return (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  // @ts-ignore
                  <th {...column.getHeaderProps()}>
                    {column.render("Header")}
                    <div>
                      {
                        // @ts-ignore
                        column.canFilter ? column.render("Filter") : null
                      }
                    </div>
                    {/* <span>
                      {
                        // @ts-ignore
                        column.isSorted
                          ? // @ts-ignore
                            column.isSortedDesc
                            ? " 🔽"
                            : " 🔼"
                          : ""
                      }
                    </span> */}
                  </th>
                ))}
              </tr>
            );
          })}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row: any) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell: any) => (
                  <td {...cell.getCellProps()}> {cell.render("Cell")} </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
      <div>
        <span>
          Page{" "}
          <strong>
            {controller.pageIndex + 1} of {totalLength}
          </strong>
        </span>
        <span>
          | Go to page:{" "}
          <input
            type="number"
            defaultValue={controller.pageIndex + 1}
            onChange={(e) => {
              const pageNumber = e.target.value
                ? Number(e.target.value) - 1
                : 0;
              gotoPage(pageNumber);
            }}
          />
        </span>
        <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
          {"<<"}
        </button>
        <button
          onClick={() => {
            previousPage();
            setController({
              ...controller,
              pageIndex: controller.pageIndex - 1,
            });
          }}
        >
          Précedent
        </button>
        <button
          onClick={() => {
            nextPage();
            setController({
              ...controller,
              pageIndex: controller.pageIndex + 1,
            });
          }}
        >
          Suivant
        </button>
        <button
          onClick={() => gotoPage(totalLength - 1)}
          disabled={!canNextPage}
        >
          {">>"}
        </button>
      </div>
    </>
  );
};
