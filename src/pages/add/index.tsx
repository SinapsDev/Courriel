import React, { useState } from "react";
import styles from "./index.module.css";
import SideBar from "~/components/SideBar";
import { type FieldValues, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useUploadThing } from "~/utils/uploadthingHelper";
import { api } from "~/utils/api";
import { useSession } from "next-auth/react";

const AddPage = () => {
  const { data: sessionData } = useSession();
  const [mailType, setMailType] = useState("depart");
  const [files, setFiles] = useState<File[] | null>(null);
  const sentMailMutation = api.sentMail.createMail.useMutation();
  const receivedMailMutation = api.receivedMail.createMail.useMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
    clearErrors,
    reset,
  } = useForm();

  const { startUpload, isUploading, permittedFileInfo } = useUploadThing(
    "fileUploader",
    {
      onClientUploadComplete: (data) => {
        if (!data) return;
        toast.success("uploaded successfully!", { duration: 2000 });
      },
      onUploadError: (e) => {
        console.log("error", e);
        toast.error("error occurred while uploading", { duration: 2000 });
      },
    }
  );

  const onSubmit = async (data: FieldValues) => {
    if (!files) return;
    const returnedFiles = await startUpload(files);
    if (!(sessionData && sessionData.user) || !returnedFiles) return;
    const filesUrls = JSON.stringify(returnedFiles.map((file) => file.fileUrl));

    if (mailType === "depart") {
      sentMailMutation.mutate({
        address: data.address,
        date: data.date,
        filesUrls: filesUrls,
        importance: data.importance,
        object: data.object,
        receiver: data.receiver,
        transmission: data.transmission,
        userId: sessionData.user.id,
      });
    } else {
      receivedMailMutation.mutate({
        address: data.address,
        date: data.date,
        filesUrls: filesUrls,
        importance: data.importance,
        object: data.object,
        sender: data.sender,
        transmission: data.transmission,
        userId: sessionData.user.id,
      });
    }
    reset();
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = event.target.files; // FileList

    if (fileList) {
      const fileArray = Array.from(fileList); // Convert FileList to array
      setFiles(fileArray);
    } else {
      setFiles(null);
    }
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
            className={styles.input}
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
            className={styles.input}
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
            className={styles.input}
            type="text"
            {...register("address", {
              required: "Vous devez préciser l'adresse du courriel!",
            })}
          />
          <label htmlFor="objet">OBJET DE LA CORRESPONDANCE</label>
          <input
            className={styles.input}
            type="text"
            {...register("object", {
              required: "Vous devez préciser l'objet du courriel!",
            })}
          />
          <label htmlFor="transmission">TRANSMISSION</label>
          <input
            className={styles.input}
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
          <label className={styles.customFileUpload} htmlFor="fileupload">
            AJOUTER VOS FICHER(S) PDF
          </label>
          <input
            className={styles.fileInput}
            {...register("files", {
              required: "Vous devez ajouter au moins un fichier!",
            })}
            type="file"
            id="fileupload"
            multiple
            onChange={handleFileUpload}
          />
          {files && (
            <div className={styles.fileNames}>
              {Array.from(files).map((file) => (
                <div key={file.name}>{file.name}</div>
              ))}
            </div>
          )}
          <button type="submit">AJOUTER LE COURRIEL AU REGISTRE</button>
        </form>
      </div>
    </div>
  );
};

export default AddPage;
