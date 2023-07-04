import React, { useState } from "react";
import styles from "./index.module.css";
import SideBar from "~/components/SideBar";
import { type FieldValues, useForm } from "react-hook-form";
import toast from "react-hot-toast";

const AddPage = () => {
  const [mailType, setMailType] = useState("depart");
  const {
    register,
    handleSubmit,
    formState: { errors },
    clearErrors,
  } = useForm();

  const onSubmit = (data: FieldValues) => {
    console.log(data);
  };

  if (Object.keys(errors).length != 0) {
    Object.values(errors).forEach((error) => {
      console.log(error);
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
        <div className={styles.title}>AJOUTER UN COURRIEL</div>
        <form
          className={styles.formContainer}
          onSubmit={handleSubmit(onSubmit)}
        >
          <select
            {...register("mailType", {
              required: "Vous devez préciser le type du courriel!",
            })}
            id="type"
            value={mailType}
            onChange={(e) => setMailType(e.target.value)}
          >
            <option value="depart">DEPART</option>
            <option value="arrive">ARRIVEE</option>
          </select>
          <label htmlFor="date">DATE</label>
          <input
            {...register("date", {
              required: "Vous devez préciser la date du courriel!",
            })}
            type="date"
          />
          {mailType === "depart" ? (
            <label htmlFor="destinateur">DESTINATAIRE</label>
          ) : (
            <label htmlFor="expediteur">EXPEDITEUR</label>
          )}
          <input
            type="text"
            {...register(mailType === "depart" ? "receiver" : "sender", {
              required:
                mailType === "depart"
                  ? "Vous devez préciser le destinataire!"
                  : "Vous devez préciser le l'éxpediteur!",
            })}
          />
          <label htmlFor="adresse">ADRESSE</label>
          <input
            type="text"
            {...register("address", {
              required: "Vous devez préciser l'adresse du courriel!",
            })}
          />
          <label htmlFor="objet">OBJET DE LA CORRESPONDANCE</label>
          <input
            type="text"
            {...register("object", {
              required: "Vous devez préciser l'objet du courriel!",
            })}
          />
          <label htmlFor="transmission">TRANSMISSION</label>
          <input
            type="text"
            {...register("transmission", {
              required: "Vous devez préciser la transmission!",
            })}
          />
          <select
            {...register("importance", {
              required: "Vous devez préciser l'importance du courriel!",
            })}
          >
            <option value="important">1 - IMPORANT</option>
            <option value="nonImportant">2 - MOYENEMENT IMPORTANT</option>
          </select>
          <button type="submit">AJOUTER LE COURRIEL AU REGISTRE</button>
        </form>
      </div>
    </div>
  );
};

export default AddPage;
