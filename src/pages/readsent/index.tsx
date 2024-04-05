import React from "react";
import styles from "./index.module.css";
import SideBar from "~/components/SideBar";
import { api } from "~/utils/api";
import { TableSent } from "~/components/TableSent";
import { columns } from "~/utils/sentColumns";
import { Spinner } from "~/components/Spinner";
import { useSession } from "next-auth/react";
import Image from "next/image";
import logo from "~/assets/logo.png";

const ReadPage = () => {
  const { isLoading } = api.sentMail.getAll.useQuery({
    skip: 0,
    take: 10,
  });
  const { data: sessionData } = useSession();
  const { data: userPermissions, isLoading: permissionsLoading } =
    api.user.getUserPermissions.useQuery({
      id: sessionData?.user?.id || "",
    });
  const { data: sentMailLenth, isLoading: isLengthLoading } =
    api.sentMail.getTotal.useQuery();

  if (!sessionData) return null;
  if (permissionsLoading)
    return (
      <div className={styles.parentContainer}>
        <Spinner />
      </div>
    );

  if (
    (!userPermissions?.canAccess || !userPermissions?.canReadSent) &&
    !userPermissions?.isAdmin
  ) {
    return (
      <div className={styles.parentContainer}>
        <SideBar />
        <div className={styles.mainContainer}>
          VOUS N'AVEZ PAS LA PERMISSION D'ACCEDER A CETTE PAGE
        </div>
      </div>
    );
  }

  return (
    <div className={styles.parentContainer}>
      <SideBar />
      <div className={styles.mainContainer}>
        {/* <Image
          style={{
            margin: "3px auto",
          }}
          height={80}
          src={logo}
          alt="logo"
        /> */}
        <h1 className={styles.mainTitle}>Registre Électronique de Départ</h1>
        <div className={styles.tableContainer}>
          {isLoading || isLengthLoading || !sentMailLenth ? (
            <Spinner />
          ) : (
            <TableSent columns={columns} totalLength={sentMailLenth} />
          )}
        </div>
      </div>
    </div>
  );
};

export default ReadPage;
