import React from 'react'
import styles from './index.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHouse, faPlus, faSearch, faUser } from '@fortawesome/free-solid-svg-icons'
import { useSession } from 'next-auth/react'
import { MenuItem } from '../MenuItem'

export const SideBar = () => {
    const { data: sessionData } = useSession();
    const user = sessionData?.user;
    const defaultImageUrl = 'https://cdn.discordapp.com/attachments/830772844019449876/1124723956440629368/profile.png';

    if (!user) return null;

    let profileName = user.name?.toLocaleUpperCase();   

    return ( 
        <div className={styles.mainContainer}>
            <div className={styles.profileContainer}>
                <div className={styles.profileImage}>
                    <img src={user.image || defaultImageUrl} alt="Avatar" />
                </div>
                <div className="profileInfo">
                    <div className={styles.profileName}>{profileName}</div>
                    <div className={styles.profileRole}><em>Administrateur</em></div>
                </div>
            </div>
            <div className={styles.menuContainer}>
                <MenuItem text="Accueil" icon={faHouse} link='/' />
                <MenuItem text="Ajouter un couriel" icon={faPlus} link='/add' />
                <MenuItem text="Chercher dans le registre" icon={faSearch} link='/search' />
                <MenuItem text="Gestion des permissions" icon={faUser} link='/permissions' />
            </div>
        </div>
    )
}

export default SideBar;