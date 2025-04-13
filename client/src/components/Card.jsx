import styles from "./Card.module.css";
import { Link } from "react-router-dom";

const Card = ({ product }) => {
  
  return (
    <div className={styles.Card}>
      <div className={styles.imgbox}>
        <img src={`http://localhost:5000${product.image}`} alt={product.name} />
      </div>
      <Link to={`/products/${product._id}`}>
        <div>
          <h4>{product.name}</h4>
          <h5>₹{product.price}</h5>
        </div>
      </Link>
    </div>
  );
};

export default Card;
