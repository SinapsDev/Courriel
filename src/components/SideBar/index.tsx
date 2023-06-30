import React from 'react'
import styles from './index.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHouse } from '@fortawesome/free-solid-svg-icons'

export const SideBar = ({ user }: any) => {
    return (
        <div className={styles.mainContainer}>
            <div className={styles.profileContainer}>
                <div className={styles.profileImage}>
                    <img src={user.image} alt="Avatar" />
                </div>
                <div className={styles.profileName}>{user.name}</div>
            </div>
            <div className={styles.menuContainer}>
                <div className={styles.menuItem}>
                    <div className={styles.menuItemIcon}>
                        <FontAwesomeIcon icon={faHouse} />
                    </div>
                    <div className={styles.menuItemText}>Acceuil</div>
                </div>
            </div>
        </div>
    )
}

export default SideBar;