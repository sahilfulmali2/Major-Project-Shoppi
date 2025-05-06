import styles from "./Navbar.module.css";
import { Link } from "react-router-dom";
import { useEffect ,useState} from "react";

function Navbar() {
  const [loggedInUser, setLoggedInUser] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const name = localStorage.getItem("name");
    if (name ) {
      setLoggedInUser(name);
    }
    else {9
      setLoggedInUser("");
    }
  }, []);

  return (
    <nav className={styles.navbarContainer}>
      <div className={styles.logo}>Shoppi</div>

      <ul className={styles.navLinks}>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/register">Register</Link>
        </li>
        <li>
          <Link to="/items">Products</Link>
        </li>
        <li>
          <Link to="/contact">Contact Us</Link>
        </li>
      </ul>

      <div className={styles.icons}>
        <span>🔔</span>
        <span>🛒</span>
        <Link to="/login" className={styles.link}>
          <button className={styles.button}>{loggedInUser ? loggedInUser : "Login"}</button>

        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
