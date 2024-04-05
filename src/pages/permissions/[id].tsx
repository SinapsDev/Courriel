import React, { useEffect, useState } from "react";
import styles from "./user.module.css";
import SideBar from "~/components/SideBar";
import { api } from "~/utils/api";
import { Spinner } from "~/components/Spinner";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import Image from "next/image";
import logo from "~/assets/logo.png";

const UserPermissionPage = ({ id }: { id: string }) => {
  const { data: userData, isLoading } = api.user.getById.useQuery({
    id,
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const updatePermissionsMutation =
    api.permission.updatePermissions.useMutation();
  const router = useRouter();
  const userPermissions = userData?.UserPermission[0];
  const mutation = api.permission.createDefaultPermissions.useMutation();
  const defaultImageUrl =
    "https://cdn.discordapp.com/attachments/830772844019449876/1124723956440629368/profile.png";
  const [checked, setChecked] = useState({
    canAdd: false,
    canDel: false,
    canEdit: false,
    canReadSent: false,
    canReadReceived: false,
    canAccess: false,
    isAdmin: false,
  });

  const onSubmit = () => {
    updatePermissionsMutation.mutate({
      canAdd: checked.canAdd,
      canDel: checked.canDel,
      canEdit: checked.canEdit,
      canReadSent: checked.canReadSent,
      canReadReceived: checked.canReadReceived,
      isAdmin: checked.isAdmin,
      canAccess: checked.canAccess,
      userId: id,
    });
    router.push("/permissions");
  };

  useEffect(() => {
    if (!isLoading) {
      if (!userPermissions) {
        mutation.mutate({ userId: id });
      } else {
        setChecked({
          canAdd: userPermissions?.canAdd,
          canDel: userPermissions?.canDel,
          canEdit: userPermissions?.canEdit,
          canReadSent: userPermissions?.canReadSent,
          canReadReceived: userPermissions?.canReadReceived,
          isAdmin: userPermissions?.isAdmin,
          canAccess: userPermissions?.canAccess,
        });
      }
    }
  }, [isLoading, userPermissions]);

  return (
    <div className={styles.parentContainer}>
      <SideBar />
      {isLoading && !userData ? (
        <Spinner />
      ) : (
        <div className={styles.mainContainer}>
          <Image
            style={{
              margin: "3px auto",
            }}
            height={80}
            src={logo}
            alt="logo"
          />
          <h1 className={styles.mainTitle}>
            GESTION DES PERMISSIONS DE {userData?.name?.toLocaleUpperCase()}:
          </h1>
          <div className={styles.userContainer}>
            <div className={styles.userInfo}>
              <div className={styles.profileImage}>
                <img
                  src={userData?.image || defaultImageUrl}
                  alt="Profile Image"
                />
              </div>
              <div className={styles.profileNameEmail}>
                <div className={styles.profileName}>
                  {userData?.name?.toLocaleUpperCase()}
                </div>
                <div className={styles.profileEmail}>{userData?.email}</div>
              </div>
            </div>
            <div className={styles.userRole}>
              {userData?.UserPermission[0]?.isAdmin
                ? "AMDINISTRATEUR"
                : "UTILISATEUR"}
            </div>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className={styles.permissionsContainer}
          >
            <div className={styles.checkBoxContainer}>
              <label htmlFor="">ACCEDER A L'APPLICATION:</label>
              <input
                checked={checked.canAccess}
                type="checkbox"
                {...register("canAccess")}
                id=""
                onChange={(e) =>
                  setChecked({ ...checked, canAccess: e.target.checked })
                }
              />
            </div>
            <div className={styles.checkBoxContainer}>
              <label htmlFor="">AJOUTER UN COURRIEL:</label>
              <input
                checked={checked.canAdd}
                type="checkbox"
                {...register("canAdd")}
                id=""
                onChange={(e) =>
                  setChecked({ ...checked, canAdd: e.target.checked })
                }
              />
            </div>
            <div className={styles.checkBoxContainer}>
              <label htmlFor="">MODIFIER UN COURRIEL:</label>
              <input
                checked={checked.canEdit}
                type="checkbox"
                {...register("canEdit")}
                id=""
                onChange={(e) =>
                  setChecked({ ...checked, canEdit: e.target.checked })
                }
              />
            </div>
            <div className={styles.checkBoxContainer}>
              <label htmlFor="">SUPPRIMER UN COURRIEL:</label>
              <input
                checked={checked.canDel}
                type="checkbox"
                {...register("canDel")}
                id=""
                onChange={(e) =>
                  setChecked({ ...checked, canDel: e.target.checked })
                }
              />
            </div>
            <div className={styles.checkBoxContainer}>
              <label htmlFor="">VOIR Registre Électronique de Départ:</label>
              <input
                checked={checked.canReadSent}
                type="checkbox"
                {...register("canReadSent")}
                id=""
                onChange={(e) =>
                  setChecked({ ...checked, canReadSent: e.target.checked })
                }
              />
            </div>
            <div className={styles.checkBoxContainer}>
              <label htmlFor="">VOIR Registre Électronique D'arrivée:</label>
              <input
                checked={checked.canReadReceived}
                type="checkbox"
                {...register("canReadReceived")}
                id=""
                onChange={(e) =>
                  setChecked({ ...checked, canReadReceived: e.target.checked })
                }
              />
            </div>
            <div className={styles.checkBoxContainer}>
              <label htmlFor="">ADMINISTRATEUR (TOUT POUVOIR):</label>
              <input
                checked={checked.isAdmin}
                type="checkbox"
                {...register("isAdmin")}
                id=""
                onChange={(e) =>
                  setChecked({ ...checked, isAdmin: e.target.checked })
                }
              />
            </div>

            <button type={"submit"}>ENREGISTRER</button>
          </form>
        </div>
      )}
    </div>
  );
};

export const getServerSideProps = async (context: {
  params: { id: string };
}) => {
  const id: string = context.params.id;
  return {
    props: {
      id,
    },
  };
};

export default UserPermissionPage;
