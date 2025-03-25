import styles from "./Homepage.module.css";
import LoginImage from '../assets/Login/Login.webp';

function Homepage() {
  return (
    <div className={styles.HomeContainer}>
      <div className={styles.Category}>
        <ul className={styles.categorylist}>
          <li>
            <a href="#">Vehicles</a>
          </li>
          <li>
            <a href="#">Clothing</a>
          </li>
          <li>
            <a href="#">Accessories</a>
          </li>
          <li>
            <a href="#">Electronics</a>
          </li>
          <li>
            <a href="#">Home & Lifestyle</a>
          </li>

        </ul>
      </div>

      <div className={styles.image}>
        <img src={LoginImage} alt="Hey Buddy" />
      </div>

    </div>
  );
}

export default Homepage;


