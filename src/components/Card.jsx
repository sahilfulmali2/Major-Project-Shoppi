import styles from "./Card.module.css";
import img from "../assets/Login/cloth.webp";

const Card = () => {
  return (
    <>
      <div className={styles.Card}>
        <div className={styles.imgbox}>
          <img src={img} alt="Product Img" />
        </div>
        <a href="">
        <div>
          <h4>Product_Name</h4>
          <h5>Current Bid</h5>
        </div>
        </a>
        
      </div>
    </>
  );
};

export default Card;
