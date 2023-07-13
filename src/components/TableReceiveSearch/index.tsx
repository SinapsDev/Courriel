import React from "react";
import styles from "./index.module.css";
import { useTable, useFilters, usePagination } from "react-table";
import { makeDataDateToString } from "~/utils/makeDataDateToString";
import { sortData } from "~/utils/sortData";

interface Iprops {
  columns: any;
  data: any;
}

export const TableReceiveSearch = ({ columns, data }: Iprops) => {
  data = data ? data : [];
  const modifiedData = makeDataDateToString(data);
  const memoData = React.useMemo(() => modifiedData, []);
  const totalLength = data ? data.length : 0;
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
    canNextPage,
    // @ts-ignore
    canPreviousPage,
    // @ts-ignore,
    pageoptions,
    // @ts-ignore
    gotoPage,
  } = useTable(
    // @ts-ignore
    {
      columns,
      // @ts-ignore
      data: sortData(memoData),
      manualPagination: false,
      // @ts-ignore
      initialState: {
        // @ts-ignore
        pageIndex: 0,
        pageSize: 10,
      },
    },
    useFilters,
    usePagination
  );

  // @ts-ignore
  const { pageIndex, pageSize } = state;
  return (
    <>
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
      <div className={styles.naviguationButtons}>
        <span className={styles.pageIndex}>
          Page{" "}
          <strong>
            {pageIndex + 1} sur {Math.ceil(totalLength / pageSize)}
          </strong>
        </span>
        <span className={styles.gotoPage}>
          <span className={styles.separator}>|</span>
          Allez à la page:{" "}
          <input
            type="number"
            defaultValue={pageIndex + 1}
            value={pageIndex + 1}
            min={1}
            max={Math.ceil(totalLength / pageSize)}
            onChange={(e) => {
              if (e.target.value === "") return;
              const pageNumber = e.target.value
                ? Number(e.target.value) - 1
                : 0;
              if (pageNumber < 0) return;
              if (pageNumber >= Math.ceil(totalLength / pageSize)) return;

              gotoPage(pageNumber);
            }}
          />
        </span>
        <div className={styles.buttonsContainer}>
          <button
            onClick={() => {
              gotoPage(0);
            }}
            disabled={pageIndex === 0}
          >
            {"<<"}
          </button>
          <button
            disabled={!canPreviousPage}
            onClick={() => {
              if (pageIndex === 0) return;
              previousPage();
            }}
          >
            Précedent
          </button>
          <button
            disabled={!canNextPage}
            onClick={() => {
              if (pageIndex === Math.ceil(totalLength / pageSize - 1)) return;
              nextPage();
            }}
          >
            Suivant
          </button>
          <button
            onClick={() => {
              gotoPage(Math.ceil(totalLength / pageSize - 1));
            }}
            disabled={pageIndex === Math.ceil(totalLength / pageSize - 1)}
          >
            {">>"}
          </button>
        </div>
      </div>
    </>
  );
};
