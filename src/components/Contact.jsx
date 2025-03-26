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
              href="https://www.google.com/maps?q=123+ABC+Street,+XYZ+City,+456789"
              target="_blank"
              rel="noopener noreferrer"
            >
              123, ABC Street, XYZ City, 456789
            </a>
          </p>
        </div>

        <div className={styles.infoItem}>
          <h4>Mobile Number:</h4>
          <p>
            <a href="tel:+919876543210">+91 98765 43210</a>
          </p>
        </div>

        <div className={styles.infoItem}>
          <h4>Email Id:</h4>
          <p>
            <a href="mailto:contact@example.com">contact@example.com</a>
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
