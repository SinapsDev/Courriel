import React from "react";
import styles from "./index.module.css";
import SideBar from "~/components/SideBar";
import { api } from "~/utils/api";
import { columns } from "../../utils/receivedColumns";
import { TableReceived } from "~/components/TableReceived";
import { Spinner } from "~/components/Spinner";
import { useSession } from "next-auth/react";
import Image from "next/image";
import logo from "~/assets/logo.png";

const ReadPageReceived = () => {
  const { isLoading } = api.receivedMail.getAll.useQuery({
    skip: 0,
    take: 10,
  });
  const { data: sessionData } = useSession();
  const { data: userPermissions, isLoading: permissionsLoading } =
    api.user.getUserPermissions.useQuery({
      id: sessionData?.user?.id || "",
    });
  const { data: receivedMailLenth, isLoading: isLengthLoading } =
    api.receivedMail.getTotal.useQuery();

  if (!sessionData) return null;
  if (permissionsLoading)
    return (
      <div className={styles.parentContainer}>
        <Spinner />
      </div>
    );

  if (
    (!userPermissions?.canAccess || !userPermissions?.canReadReceived) &&
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
        <h1 className={styles.mainTitle}>Registre Électronique D'arrivée</h1>
        <div className={styles.tableContainer}>
          {isLengthLoading || isLoading || !receivedMailLenth ? (
            <Spinner />
          ) : (
            <TableReceived columns={columns} totalLength={receivedMailLenth} />
          )}
        </div>
      </div>
    </div>
  );
};

export default ReadPageReceived;
