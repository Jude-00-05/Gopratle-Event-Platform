import React from 'react';
import styles from './Navbar.module.css';

export const Navbar: React.FC = () => {
  return (
    <header className={styles.navbar}>
      <div className={styles.container}>
        <div className={styles.brand}>
          <div className={styles.logoBadge}>GP</div>
          <span className={styles.brandName}>GoPratle</span>
          <span className={styles.tag}>Events</span>
        </div>
        <div className={styles.badge}>
          <span className={styles.dot}></span>
          Requirement Portal
        </div>
      </div>
    </header>
  );
};
