import React from "react";
import styles from "./index.module.css";
import SideBar from "~/components/SideBar";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { api } from "~/utils/api";
import { useSession } from "next-auth/react";
import { Spinner } from "~/components/Spinner";
import Image from "next/image";
import logo from "~/assets/logo.png";

const RemovePage = () => {
  const {
    handleSubmit,
    register,
    formState: { errors },
    clearErrors,
    reset,
  } = useForm();

  const { data: sessionData } = useSession();
  const { data: userPermissions, isLoading: permissionsLoading } =
    api.user.getUserPermissions.useQuery({
      id: sessionData?.user?.id || "",
    });
  const sentMutation = api.sentMail.deleteByOrderNumber.useMutation();
  const receivedMutation = api.receivedMail.deleteByOrderNumber.useMutation();

  const onSumbit = (data: any) => {
    if (data.mailType === "ARRIVEE") {
      receivedMutation.mutate({
        id: data.id,
      });
    } else {
      sentMutation.mutate({
        id: data.id,
      });
    }
    toast.success("Courriel supprimé avec succès!", { duration: 2000 });
    reset();
  };
  if (Object.keys(errors).length != 0) {
    Object.values(errors).forEach((error) => {
      if (error && error.message && typeof error.message === "string") {
        toast.error(error.message, { duration: 2000 });
      }
    });
    clearErrors();
  }

  if (!sessionData) return null;
  if (permissionsLoading)
    return (
      <div className={styles.parentContainer}>
        <Spinner />
      </div>
    );

  if (
    (!userPermissions?.canAccess || !userPermissions?.canDel) &&
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
        <h1 className={styles.mainTitle}>SUPPRIMER UN COURRIEL (ATTENTION!)</h1>
        <form
          onSubmit={handleSubmit(onSumbit)}
          className={styles.formContainer}
        >
          <select
            defaultValue={"ARRIVEE"}
            {...register("mailType", {
              required: "Vous devez préciser le type du courriel!",
            })}
          >
            <option value="ARRIVEE">1- ARRIVEE</option>
            <option value="DEPART">2- DEPART</option>
          </select>
          <label>Numero d'ordre du courriel:</label>
          <input
            {...register("id", {
              required: "Vous devez préciser le numero d'ordre du courriel!",
            })}
            type="text"
          />
          <button type={"submit"}>SUPPRIMER</button>
        </form>
      </div>
    </div>
  );
};

export default RemovePage;
