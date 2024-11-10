import Image from 'next/image';
import Link from 'next/link';
import styles from './Navbar.module.css';

export default function Navbar() {
  return (
    <nav className={styles.navbar}>
      <div className={styles.navContainer}>
        <Link href="/" className={styles.navItem}>HOME</Link>
        <Link href="/about" className={styles.navItem}>ABOUT US</Link>
        <div className={styles.logoContainer}>
          <Image 
            src="https://mayra.majetics.com/wp-content/uploads/2024/09/logo-removebg_edited_edited.png"
            alt="Logo"
            width={205}
            height={93}
            className={styles.logo}
          />
        </div>
        <Link href="/products" className={styles.navItem}>PRODUCTS</Link>
        <Link href="/book" className={styles.navItem}>BOOK NOW</Link>
      </div>
    </nav>
  );
}
