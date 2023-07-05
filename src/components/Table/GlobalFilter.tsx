import React from "react";
import styles from "./index.module.css";

export const GlobalFilter = ({ filter, setFilter }: any) => {
  return (
    <div className={styles.globalFilterContainer}>
      <div className={styles.text}>Filtrer globalement: </div>
      <input
        className={styles.filterInput}
        value={filter || ""}
        onChange={(e) => setFilter(e.target.value)}
      />
    </div>
  );
};
