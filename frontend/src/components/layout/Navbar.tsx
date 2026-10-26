import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import styles from './Navbar.module.css';

export const Navbar: React.FC = () => {
  return (
    <header className={styles.navbar}>
      <div className={styles.container}>
        <Link href="/" className={styles.brand}>
          <div className={styles.logoBadge} aria-hidden="true">G</div>
          <span className={styles.brandName}>GoPratle</span>
          <span className={styles.tag}>Events</span>
        </Link>
        <nav className={styles.navLinks}>
          <Link href="/requirements" className={styles.navLink}>
            Browse events
          </Link>
          <Link href="/requirements/new" className={styles.postBtn}>
            Post an event <ArrowUpRight size={15} aria-hidden="true" />
          </Link>
        </nav>
      </div>
    </header>
  );
};
