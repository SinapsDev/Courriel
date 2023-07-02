import React from 'react'
import styles from './index.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

type MenuItemProps = {
    text: string;
    icon: any;
    onClick: () => void;
}

export const MenuItem = ({ text, icon, onClick }: MenuItemProps) => {
    return (
        <div className={styles.menuItem} onClick={onClick} >
            <div className={styles.menuItemIcon}>
                <FontAwesomeIcon icon={icon} />
            </div>
            <div className={styles.menuItemText}>{text}</div>
        </div>
    )
}