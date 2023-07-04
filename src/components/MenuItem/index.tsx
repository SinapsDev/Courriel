import React from 'react'
import styles from './index.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Link from 'next/link';

type MenuItemProps = {
    text: string;
    icon: any;
    link: string;
}

export const MenuItem = ({ text, icon, link }: MenuItemProps) => {
    return (
        <Link href={link}>
            <div className={styles.menuItem} >
                <div className={styles.menuItemIcon}>
                    <FontAwesomeIcon icon={icon} />
                </div>
                <div className={styles.menuItemText}>{text}</div>
            </div>
        </Link>
    )
}