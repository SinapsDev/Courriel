import React, { useEffect, useState } from "react";
import styles from "./index.module.css";
import SideBar from "~/components/SideBar";
import { useForm } from "react-hook-form";
import { api } from "~/utils/api";
import { useRouter } from "next/router";
import { Spinner } from "~/components/Spinner";
import { useSession } from "next-auth/react";
import Image from "next/image";
import logo from "~/assets/logo.png";

const SearchPage = () => {
  const { data: sessionData } = useSession();
  const { data: userPermissions, isLoading: permissionsLoading } =
    api.user.getUserPermissions.useQuery({
      id: sessionData?.user?.id || "",
    });
  const [mailType, setMailType] = useState("ARRIVE");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const router = useRouter();

  const onSubmit = async (data: any) => {
    router.push({
      pathname: "/search/result",
      query: {
        data: JSON.stringify(data),
      },
    });
  };

  if (!sessionData) return null;
  if (permissionsLoading)
    return (
      <div className={styles.parentContainer}>
        <Spinner />
      </div>
    );

  if (
    (!userPermissions?.canAccess ||
      (!userPermissions?.canReadSent && !userPermissions?.canReadReceived)) &&
    !userPermissions?.isAdmin
  ) {
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
        <h1 className={styles.mainTitle}>
          RECHERCHER L'INTEGRALITE DE LA BASE DE DONNEE
        </h1>
        <form
          className={styles.mainContainer}
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className={styles.filterContainer}>
            <div className={styles.filterTitle}>
              Filtrer par type de couriel:
            </div>
            <div className={styles.filterInputs}>
              <select
                defaultValue={mailType}
                {...register("mailType")}
                onChange={(e) => setMailType(e.target.value)}
              >
                <option value="ARRIVE">1- ARRIVE</option>
                <option value="DEPART">2- DEPART</option>
              </select>
            </div>
          </div>
          <div className={styles.filterContainer}>
            <div className={styles.filterTitle}>
              Filtrer par Numero d'ordre:
            </div>
            <div className={styles.filterInputs}>
              <input type="text" {...register("orderNumber")} id="" />
            </div>
          </div>
          <div className={styles.filterContainer}>
            <div className={styles.filterTitle}>Filtrer par date:</div>
            <div className={styles.filterInputs}>
              Du:
              <input
                type="date"
                {...register("startDate")}
                className={styles.dateInput}
              />
              au:
              <input
                type="date"
                {...register("endDate")}
                className={styles.dateInput}
              />
            </div>
          </div>
          <div className={styles.filterContainer}>
            <div className={styles.filterTitle}>
              Filtrer par{" "}
              {mailType === "DEPART" ? "destinataire" : "expediteur"}:
            </div>
            <div className={styles.filterInputs}>
              <input
                type="text"
                {...register(mailType === "DEPART" ? "receiver" : "sender")}
              />
            </div>
          </div>
          <div className={styles.filterContainer}>
            <div className={styles.filterTitle}>Filtrer par objet:</div>
            <div className={styles.filterInputs}>
              <input type="text" {...register("object")} id="" />
            </div>
          </div>
          <button type={"submit"} className={styles.searchButton}>
            CHERCHER
          </button>
        </form>
      </div>
    </div>
  );
};

export default SearchPage;
