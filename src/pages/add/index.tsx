import React, { useState } from "react";
import styles from "./index.module.css";
import SideBar from "~/components/SideBar";
import { type FieldValues, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useUploadThing } from "~/utils/uploadthingHelper";
import { api } from "~/utils/api";
import { useSession } from "next-auth/react";
import { Spinner } from "~/components/Spinner";
import Image from "next/image";
import logo from "~/assets/logo.png";

const AddPage = () => {
  const { data: sessionData } = useSession();
  const [mailType, setMailType] = useState("depart");
  const [files, setFiles] = useState<File[] | null>(null);
  const { data: userPermissions, isLoading: permissionsLoading } =
    api.user.getUserPermissions.useQuery({
      id: sessionData?.user?.id || "",
    });
  const sentMailMutation = api.sentMail.createMail.useMutation();
  const receivedMailMutation = api.receivedMail.createMail.useMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
    clearErrors,
    reset,
  } = useForm();

  const { startUpload, isUploading } = useUploadThing("fileUploader", {
    onClientUploadComplete: (data) => {
      if (!data) return;
      toast.success("uploaded successfully!", { duration: 2000 });
    },
    onUploadError: (e) => {
      toast.error("error occurred while uploading", { duration: 2000 });
    },
  });

  const onSubmit = async (data: FieldValues) => {
    if (!files) return;
    toast.loading("Envoi en cours...", { duration: 2000 });
    const returnedFiles = await startUpload(files);
    if (!(sessionData && sessionData.user) || !returnedFiles) return;
    const filesUrls = JSON.stringify(returnedFiles.map((file) => file.fileUrl));

    if (mailType === "depart") {
      sentMailMutation.mutate({
        date: data.date,
        filesUrls: filesUrls,
        importance: data.importance,
        object: data.object,
        receiver: data.receiver,
        userId: sessionData.user.id,
        orderNumber: data.orderNumber,
      });
    } else {
      receivedMailMutation.mutate({
        date: data.date,
        filesUrls: filesUrls,
        importance: data.importance,
        object: data.object,
        sender: data.sender,
        userId: sessionData.user.id,
        orderNumber: data.orderNumber,
      });
    }
    reset();
    setFiles(null);
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

  if (!sessionData) return null;
  if (permissionsLoading)
    return (
      <div className={styles.parentContainer}>
        <SideBar />
        <Spinner />
      </div>
    );

  if (
    (!userPermissions?.canAccess || !userPermissions?.canAdd) &&
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
        <Image
          style={{
            margin: "3px auto",
          }}
          height={80}
          src={logo}
          alt="logo"
        />
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
          <label htmlFor="date">NUMERO D'ORDRE</label>
          <input
            className={styles.input}
            {...register("orderNumber", {
              required: "Vous devez préciser la numero d'ordre!",
            })}
            type="text"
          />
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
          <label htmlFor="objet">OBJET DE LA CORRESPONDANCE</label>
          <input
            className={styles.input}
            type="text"
            {...register("object", {
              required: "Vous devez préciser l'objet du courriel!",
            })}
          />
          <select
            {...register("importance", {
              required: "Vous devez préciser l'importance du courriel!",
            })}
          >
            <option value="IMPORTANT">1 - IMPORANT</option>
            <option value="MOYENEMENT IMPORTANT">
              2 - MOYENEMENT IMPORTANT
            </option>
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
          <button disabled={isUploading} type="submit">
            AJOUTER LE COURRIEL AU REGISTRE
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddPage;
