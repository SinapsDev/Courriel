import React from "react";
import styles from "./index.module.css";

export const InfoBox = ({
  title,
  value,
  important,
}: {
  title: string;
  value: string | number;
  important: number | string;
}) => {
  return (
    <div className={styles.mainContainer}>
      <div className={styles.title}>{title}</div>
      <div className={styles.borderDiv}></div>

      <>
        <div className={styles.valuesContainer}>
          <div className={styles.value}>{value}</div>
          <div className={styles.importantValue}>{important} IMPORTANT</div>
        </div>
      </>
    </div>
  );
};
