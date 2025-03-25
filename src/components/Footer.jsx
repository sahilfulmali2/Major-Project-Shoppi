import styles from "./Footer.module.css";
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";

function Footer() {
  return (
    <div className={styles.FooterContainer}>
     
      <div className={styles.Container}>
        <div className={styles.content}>
          <h1>Exclusive</h1>
          <p>Subscribe</p>
          <p>Get 15% off on your <br /> first order.</p>
        </div>

        <div className={styles.content}>
          <h1>Support</h1>
          <address>
            Samata Colony <br />
            Siddhyvinayak Nagar <br />
            Amravati
          </address>
          <a href="mailto:shoppi@gmail.com">shoppi@gmail.com</a>
        </div>

        <div className={styles.content}>
          <h1>Account</h1>
          <a href="#">My Account</a>
          <a href="#">Login</a>
          <a href="#">Cart</a>
          <a href="#">Shop</a>
        </div>

        <div className={styles.content}>
          <h1>Quick Links</h1>
          <a href="#">Privacy</a>
          <a href="#">Terms of Use</a>
          <a href="#">FAQ</a>
          <a href="#">Contact</a>
        </div>

        <div className={styles.content}>
          <h1>Follow Us</h1>
          <p>Get Rs.100 on following us on Social Media</p>
          <div className={styles.socialIcons}>
            <FaFacebook />
            <FaInstagram />
            <FaTwitter />
          </div>
        </div>
      </div>

      <div className={styles.foothead}>
        <h1>Developed by Sahil, Radha, Ashish</h1>
      </div>
    </div>
  );
}

export default Footer;
