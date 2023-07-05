import React from "react";
import styles from "./index.module.css";

export const ColumnFilter = ({ column }: any) => {
  const { filterValue, setFilter } = column;

  return (
    <input
      className={styles.columnFilterInput}
      value={filterValue || ""}
      onChange={(e) => setFilter(e.target.value)}
    />
  );
};
