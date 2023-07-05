import React from "react";
import styles from "./index.module.css";
import SideBar from "~/components/SideBar";
import { useReactTable } from "@tanstack/react-table";

const SearchPage = () => {
  return (
    <div className={styles.parentContainer}>
      <SideBar />
      <div className={styles.mainContainer}></div>
    </div>
  );
};

export default SearchPage;
