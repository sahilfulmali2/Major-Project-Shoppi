import styles from "./Sale.module.css";
import Speaker from "../assets/Login/Speaker.jpg";
function Sale() {
  return (
    <div className={styles.SaleContainer}>
      <div className={styles.Container1}>
        <div className={styles.content}>
          <h1>MUSIC</h1>
          <p>Enhance your <br />Music Experience</p>
          <button className={styles.button}>Buy Now</button>
        </div>
      </div>
    </div>
  );
}

export default Sale;
