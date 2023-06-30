import React from 'react';
import styles from './index.module.css';

export const InfoBox = ({ title, value }: { title: any, value: any }) => {
    return (
        <div className={styles.mainContainer}>
            <div className={styles.title}>{title}</div>
            <div className={styles.value}>{value}</div>
        </div>
    )
}