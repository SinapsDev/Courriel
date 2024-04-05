import React from "react";
import styles from "./index.module.css";
import {
  faEdit,
  faEye,
  faHouse,
  faInbox,
  faPlus,
  faSearch,
  faTrash,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { useSession } from "next-auth/react";
import { MenuItem } from "../MenuItem";
import Image from "next/image";
import { api } from "~/utils/api";

export const SideBar = () => {
  const { data: sessionData } = useSession();
  const user = sessionData?.user;
  const { data: userPermissions, isLoading } =
    api.user.getUserPermissions.useQuery({
      id: user?.id || "",
    });
  const defaultImageUrl =
    "https://cdn.discordapp.com/attachments/830772844019449876/1124723956440629368/profile.png";

  if (!user) return null;

  const profileName = user.name?.toLocaleUpperCase();

  return (
    <div className={styles.mainContainer}>
      <div className={styles.profileContainer}>
        <div className={styles.profileImage}>
          <Image
            src={user.image || defaultImageUrl}
            alt="Avatar"
            width={100}
            height={100}
          />
        </div>
        <div className="profileInfo">
          <div className={styles.profileName}>{profileName}</div>
          <div className={styles.profileRole}>
            <em>
              {isLoading ? "Chargement..." : ""}
              {!isLoading && userPermissions?.isAdmin ? "Administrateur" : ""}
              {!isLoading && !userPermissions?.isAdmin ? "Utilisateur" : ""}
            </em>
          </div>
        </div>
      </div>
      <div className={styles.menuContainer}>
        <MenuItem text="Accueil" icon={faHouse} link="/home" />
        <MenuItem text="Ajouter un courriel" icon={faPlus} link="/add" />
        <MenuItem text="Modifier un courriel" icon={faEdit} link="/edit" />
        <MenuItem text="Supprimer un courriel" icon={faTrash} link="/remove" />
        <MenuItem
          text="Voir le registre de départ"
          icon={faEye}
          link="/readsent"
        />
        <MenuItem
          text="Voir le registre d'arrivée"
          icon={faInbox}
          link="/readreceived"
        />
        <MenuItem
          text="Chercher la base de donnée"
          icon={faSearch}
          link="/search"
        />
        <MenuItem
          text="Gestion des permissions"
          icon={faUser}
          link="/permissions"
        />
      </div>
    </div>
  );
};

// make the componenet redendred on the server side

export default SideBar;
