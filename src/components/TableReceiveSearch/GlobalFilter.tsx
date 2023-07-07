import React, { useState } from "react";
import { useAsyncDebounce } from "react-table";
import styles from "./index.module.css";

export const GlobalFilter = ({ filter, setFilter }: any) => {
  const [value, setValue] = useState(filter);

  const onChange = useAsyncDebounce((value) => {
    setFilter(value || undefined);
  }, 200);

  return (
    <div className={styles.globalFilterContainer}>
      <div className={styles.text}>Filtrer globalement: </div>
      <input
        className={styles.filterInput}
        value={value || ""}
        onChange={(e) => {
          setValue(e.target.value);
          onChange(e.target.value);
        }}
      />
    </div>
  );
};
