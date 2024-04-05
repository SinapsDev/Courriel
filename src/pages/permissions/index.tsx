import React from "react";
import styles from "./index.module.css";
import SideBar from "~/components/SideBar";
import { api } from "~/utils/api";
import { Spinner } from "~/components/Spinner";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import Image from "next/image";
import logo from "~/assets/logo.png";

const PermissionsPage = () => {
  const { data: allUsers, isLoading: isLoadingUsers } =
    api.user.getAll.useQuery();
  const { data: sessionData } = useSession();
  const { data: userPermissions, isLoading: permissionsLoading } =
    api.user.getUserPermissions.useQuery({
      id: sessionData?.user?.id || "",
    });

  const router = useRouter();
  if (!sessionData) return null;
  if (permissionsLoading)
    return (
      <div className={styles.parentContainer}>
        <Spinner />
      </div>
    );

  if (!userPermissions?.isAdmin) {
    return (
      <div className={styles.parentContainer}>
        <SideBar />
        <div
          className={styles.mainContainer}
          style={{
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          VOUS N'AVEZ PAS LA PERMISSION D'ACCEDER A CETTE PAGE
        </div>
      </div>
    );
  }
  return (
    <div className={styles.parentContainer}>
      <SideBar />
      <div className={styles.mainContainer}>
        <Image
          style={{
            margin: "3px auto",
          }}
          height={80}
          src={logo}
          alt="logo"
        />
        <h1 className={styles.mainTitle}>GESTION DES PERMISSIONS</h1>
        <div className={styles.usersContainer}>
          <h2 className={styles.usersTitle}>Liste des utilisateurs:</h2>
          <div className={styles.usersList}>
            {isLoadingUsers ? (
              <div className={styles.spinnerContainer}>
                <Spinner />
              </div>
            ) : (
              allUsers?.map((user) => (
                <div className={styles.userContainer} key={user.id}>
                  <div className={styles.userInfos}>
                    <p>Nom: {user.name}</p>
                    <span> | </span>
                    <p>Email: {user.email}</p>
                  </div>
                  <button
                    className={styles.button}
                    onClick={() => {
                      router.push(`/permissions/${user.id}`);
                    }}
                  >
                    Gérer les permissions
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PermissionsPage;
