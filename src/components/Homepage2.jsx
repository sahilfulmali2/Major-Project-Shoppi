import styles from "./Homepage2.module.css";
import LoginImage from '../assets/Login/Login.webp'; 
import Card from "./Card.jsx";

function Homepage2() {
  return (
    <div className={styles.Home2Container}>
      
      <div className={styles.Container1}>
        <h1>Best Selling Product</h1>
        <button className={styles.button}>View All</button>
      </div>

      <div className={styles.productContainer}>
        <Card></Card>
        <Card></Card>
        <Card></Card>
        <Card></Card>
        <Card></Card>
        <Card></Card>
      </div>

    </div>
  );
}

export default Homepage2;
