import styles from "./Card.module.css";
import { Link } from "react-router-dom";

const Card2 = ({ product }) => {
  return (
    <div className={styles.Card}>
      <div className={styles.imgbox}>
        <img src={`http://localhost:5000${product.images}`} alt={product.name} />
      </div>
      <Link to={`buy/products/${product._id}`}>
        <div>
          <h4>{product.name}</h4>
          <h5>₹{product.price}</h5>
          <h5>Quantity: {product.quantity}</h5>
        </div>
      </Link>
    </div>
  );
};

export default Card2;
