import styles from "./Contact.module.css";
import image from "../assets/ContactUs.webp";

const Contact = () => {
  return (
    <div className={styles.container}>
      <div className={styles.infobox}>
        <h2>Contact Us</h2>

        <div className={styles.infoItem}>
          <h4>Address:</h4>
          <p>
            <a
              href="https://maps.app.goo.gl/obTLirTcGyD7Mwmf8"
              target="_blank"
              rel="noopener noreferrer"
            >
              Government College of Engineering,
              Amravati, Maharashtra, 444604
            </a>
          </p>
        </div>

        <div className={styles.infoItem}>
          <h4>Mobile Number:</h4>
          <p>
            <a href="tel:+918669598813">+91 8669598813</a>
          </p>
        </div>

        <div className={styles.infoItem}>
          <h4>Email Id:</h4>
          <p>
            <a href="mailto:sfulmali2907n@gmail.com">sfulmali2907n@gmail.com</a>
          </p>
        </div>
      </div>
      <div className={styles.imgbox}>
        <img src={image} alt="Contact Us" />
      </div>
    </div>
  );
};


export default Contact;
