import styles from './Navbar.module.css';

function Navbar() {
  return (
    <nav className={styles.navbarContainer}>
      
      <div className={styles.logo}>Shoppi</div>

      
      <ul className={styles.navLinks}>
        <li><a href="#">Home</a></li>
        <li><a href="#">Account</a></li>
        <li><a href="#">Products</a></li>
        <li><a href="#">Contact Us</a></li>
      </ul>

      
      <div className={styles.icons}>
        <span>🔔</span> 
        <span>🛒</span> 
      </div>
    </nav>
  );
}

export default Navbar;
