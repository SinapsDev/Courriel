import React from 'react'
import styles from './index.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

type MenuItemProps = {
    text: string;
    icon: any;
}

export const MenuItem = ({ text, icon }: MenuItemProps) => {
    return (
        <div className={styles.menuItem}>
            <div className={styles.menuItemIcon}>
                <FontAwesomeIcon icon={icon} />
            </div>
            <div className={styles.menuItemText}>{text}</div>
        </div>
    )
}