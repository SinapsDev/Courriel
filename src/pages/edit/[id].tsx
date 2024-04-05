import React, { useState } from "react";
import styles from "./edit.module.css";
import SideBar from "~/components/SideBar";
import { useRouter } from "next/router";
import { Spinner } from "~/components/Spinner";
import { toast } from "react-hot-toast";
import { useUploadThing } from "~/utils/uploadthingHelper";
import { FieldValues, useForm } from "react-hook-form";
import { api } from "~/utils/api";
import { useSession } from "next-auth/react";
import Image from "next/image";
import logo from "~/assets/logo.png";

const EditPage = () => {
  const router = useRouter();
  const { mailType, id }: any = router.query;

  if (!mailType || !id) return null;

  const { data: sessionData } = useSession();
  const [files, setFiles] = useState<File[] | null>(null);
  const { data: userPermissions, isLoading: permissionsLoading } =
    api.user.getUserPermissions.useQuery({
      id: sessionData?.user?.id || "",
    });

  const { data: mailDataSent, isLoading: isMailDataSentLoading } =
    api.sentMail.getByOrderNumber.useQuery({
      orderNumber: id.replace("-", "/") as string,
    });
  const { data: receivedDataSent, isLoading: isMailDataReceivedLoading } =
    api.receivedMail.getByOrderNumber.useQuery({
      orderNumber: id.replace("-", "/") as string,
    });
  const sentMailMutation = api.sentMail.editMail.useMutation();
  const receivedMailMutation = api.receivedMail.editMail.useMutation();
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
      toast.success("Courriel modifié avec succes", { duration: 2000 });
      router.push("/edit");
    },
    onUploadError: (e) => {
      toast.error("error occurred while uploading", { duration: 2000 });
    },
  });

  const onSubmit = async (data: FieldValues) => {
    let filesUrls;
    if (mailType === "DEPART") {
      filesUrls = mailDataSent![0]!.filesUrls;
    } else {
      filesUrls = receivedDataSent![0]!.filesUrls;
    }
    if (files) {
      toast.loading("Envoi en cours...", { duration: 2000 });
      const returnedFiles = await startUpload(files);
      if (!(sessionData && sessionData.user) || !returnedFiles) return;
      filesUrls = JSON.stringify(returnedFiles.map((file) => file.fileUrl));
    }
    if (mailType === "DEPART") {
      sentMailMutation.mutate({
        id: mailDataSent![0]!.id,
        date: data.date,
        filesUrls: filesUrls,
        importance: data.importance,
        object: data.object,
        receiver: data.receiver,
        orderNumber: data.orderNumber,
      });
    } else {
      receivedMailMutation.mutate({
        id: receivedDataSent![0]!.id,
        date: data.date,
        filesUrls: filesUrls,
        importance: data.importance,
        object: data.object,
        sender: data.sender,
        orderNumber: data.orderNumber,
      });
    }
    if (!files) {
      toast.success("Courrier modifié avec succès", { duration: 2000 });
      router.push("/edit");
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
  if (
    permissionsLoading ||
    isMailDataSentLoading ||
    isMailDataReceivedLoading ||
    !mailDataSent ||
    !receivedDataSent
  )
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

  if (isMailDataSentLoading) return <Spinner />;
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
          MODIFIER LE COURRIER - {mailType} - {id.replace("-", "/")}
        </h1>
        <form
          className={styles.formContainer}
          onSubmit={handleSubmit(onSubmit)}
        >
          <label htmlFor="date">NUMERO D'ORDRE</label>
          <input
            className={styles.input}
            {...register("orderNumber")}
            type="text"
            defaultValue={
              mailType === "DEPART"
                ? mailDataSent[0]?.orderNumber
                : receivedDataSent[0]?.orderNumber
            }
          />
          <label htmlFor="date">DATE</label>
          <input
            defaultValue={
              mailType === "DEPART"
                ? mailDataSent[0]?.date
                    .toLocaleDateString()
                    .split("/")
                    .join("-")
                    .split("-")
                    .reverse()
                    .join("-")
                : receivedDataSent[0]?.date
                    .toLocaleDateString()
                    .split("/")
                    .join("-")
                    .split("-")
                    .reverse()
                    .join("-")
            }
            className={styles.input}
            {...register("date")}
            type="date"
          />
          {mailType === "DEPART" ? (
            <label htmlFor="destinateur">DESTINATAIRE</label>
          ) : (
            <label htmlFor="expediteur">EXPEDITEUR</label>
          )}
          <input
            className={styles.input}
            type="text"
            defaultValue={
              mailType === "DEPART"
                ? mailDataSent[0]?.receiver
                : receivedDataSent[0]?.sender
            }
            {...register(mailType === "DEPART" ? "receiver" : "sender")}
          />
          <label htmlFor="objet">OBJET DE LA CORRESPONDANCE</label>
          <input
            defaultValue={
              mailType === "DEPART"
                ? mailDataSent[0]?.object
                : receivedDataSent[0]?.object
            }
            className={styles.input}
            type="text"
            {...register("object")}
          />
          <select
            defaultValue={
              mailType === "DEPART"
                ? mailDataSent[0]?.importance
                : receivedDataSent[0]?.importance
            }
            className={styles.select}
            {...register("importance")}
          >
            <option value="IMPORTANT">1 - IMPORANT</option>
            <option value="MOYENEMENT IMPORTANT">
              2 - MOYENEMENT IMPORTANT
            </option>
          </select>
          <label className={styles.customFileUpload} htmlFor="fileupload">
            AJOUTER VOS FICHER(S) PDF (SEULMENT SI VOUS VOULLEZ LES MODIFIER)
          </label>
          <input
            className={styles.fileInput}
            {...register("files")}
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
            MODIFIER LE COURRIER
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditPage;
