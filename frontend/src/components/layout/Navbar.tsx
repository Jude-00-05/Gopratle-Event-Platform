import Link from 'next/link';
import styles from './Navbar.module.css';

export const Navbar: React.FC = () => {
  return (
    <header className={styles.navbar}>
      <div className={styles.container}>
        <Link href="/requirements" className={styles.brand}>
          <div className={styles.logoBadge}>GP</div>
          <span className={styles.brandName}>GoPratle</span>
          <span className={styles.tag}>Events</span>
        </Link>
        <nav className={styles.navLinks}>
          <Link href="/requirements" className={styles.navLink}>
            Browse Requirements
          </Link>
          <Link href="/requirements/new" className={styles.postBtn}>
            + Post Requirement
          </Link>
        </nav>
      </div>
    </header>
  );
};
