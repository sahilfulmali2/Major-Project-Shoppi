import styles from "./Navbar.module.css";
import { Link } from "react-router-dom";
function Navbar() {
  return (
    <nav className={styles.navbarContainer}>
      <div className={styles.logo}>Shoppi</div>

      <ul className={styles.navLinks}>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/register">Account</Link>
        </li>
        <li>
          <Link to="/products">Products</Link>
        </li>
        <li>
          <Link to="/contact">Contact Us</Link>
        </li>
      </ul>

      <div className={styles.icons}>
        <span>🔔</span>
        <span>🛒</span>
      </div>
    </nav>
  );
}

export default Navbar;
