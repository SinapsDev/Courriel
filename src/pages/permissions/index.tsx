import React from "react";
import styles from "./index.module.css";
import SideBar from "~/components/SideBar";
import { api } from "~/utils/api";
import { Spinner } from "~/components/Spinner";
import { useRouter } from "next/router";

const PermissionsPage = () => {
  const { data: allUsers, isLoading: isLoadingUsers } =
    api.user.getAll.useQuery();

  const router = useRouter();
  return (
    <div className={styles.parentContainer}>
      <SideBar />
      <div className={styles.mainContainer}>
        <h1 className={styles.mainTitle}>GESTION DES PERMISSIONS</h1>
        <div className={styles.usersContainer}>
          <h2 className={styles.usersTitle}>Liste des utilisateurs:</h2>
          <div className={styles.usersList}>
            {isLoadingUsers ? (
              <Spinner />
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
