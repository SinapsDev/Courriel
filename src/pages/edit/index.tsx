import React from "react";
import styles from "./index.module.css";
import SideBar from "~/components/SideBar";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { api } from "~/utils/api";
import { toast } from "react-hot-toast";
import { Spinner } from "~/components/Spinner";
import { useRouter } from "next/router";
import Image from "next/image";
import logo from "~/assets/logo.png";

const EditPage = () => {
  const router = useRouter();
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

  const onSumbit = (data: any) => {
    router.push({
      pathname: `/edit/${data.id.replace("/", "-")}`,
      query: { id: data.id, mailType: data.mailType },
    });
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
    (!userPermissions?.canAccess || !userPermissions?.canEdit) &&
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
        <h1 className={styles.mainTitle}>MODIFIER UN COURRIEL</h1>
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
          <button type={"submit"}>MODIFIER</button>
        </form>
      </div>
    </div>
  );
};

export default EditPage;
