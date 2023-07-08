import React from "react";
import styles from "./index.module.css";
import SideBar from "~/components/SideBar";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { api } from "~/utils/api";

const RemovePage = () => {
  const {
    handleSubmit,
    register,
    formState: { errors },
    clearErrors,
    reset,
  } = useForm();

  const sentMutation = api.sentMail.deleteMail.useMutation();
  const receivedMutation = api.sentMail.deleteMail.useMutation();

  const onSumbit = (data: any) => {
    if (data.mailType === "ARRIVEE") {
      receivedMutation.mutate({
        id: parseInt(data.id),
      });
    } else {
      sentMutation.mutate({
        id: parseInt(data.id),
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

  return (
    <div className={styles.parentContainer}>
      <SideBar />
      <div className={styles.mainContainer}>
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
            <option value="DEPART">1- DEPART</option>
            <option value="ARRIVEE">2- ARRIVEE</option>
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
