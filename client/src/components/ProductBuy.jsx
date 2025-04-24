import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styles from "./ProductBuy.module.css";
import { useNavigate } from "react-router-dom";
const ProductBuy = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [selectedQty, setSelectedQty] = useState("1");
  const [showMessage, setShowMessage] = useState(false);


  useEffect(() => {
    fetch(`http://localhost:5000/buy/products/${id}`)
      .then((res) => res.json())
      .then((data) => setProduct(data));
  }, [id]);

  const handleQtyChange = (e) => {
    const value = e.target.value;
    if (value === "") {
      setSelectedQty("");
      return;
    }
    if (value >= 1 && value <= product.quantity) {
      setSelectedQty(value);
    }
  };

  const handleBuy = () => {
    const qty = selectedQty;
    if (isNaN(qty) || qty < 1) {
      alert("Please enter a valid quantity.");
      return;
    }
    // alert(`Redirecting to Checkout Page`);

    const productDetails = {
      name: product.name,
      price: product.price,
      quantity: qty,
    };

    setShowMessage(true);
    setTimeout(() => {
      navigate("/checkout", { state: { product: productDetails } });
    }, 3500);
  };

  if (!product) return <p className={styles.loading}>Loading...</p>;

  return (
    

    <div className={styles.container}>
      <div className={styles.imageSection}>
        <img
          src={`http://localhost:5000${product.images}`}
          alt={product.name}
          className={styles.productImage}
        />
      </div>
      <div className={styles.infoSection}>
        <h2 className={styles.name}>{product.name}</h2>
        <p className={styles.description}>{product.description}</p>
        <p className={styles.price}>Price: ₹{product.price}</p>
        <p className={styles.availableQty}>Available: {product.quantity}</p>

        <div className={styles.qtySection}>
          <label htmlFor="qty">Quantity: </label>
          <input
            type="number"
            id="qty"
            min="1"
            max={product.quantity}
            value={selectedQty}
            onChange={handleQtyChange}
            className={styles.qtyInput}
          />
        </div>

        <button className={styles.buyButton} onClick={handleBuy}>
          Buy Now
        </button>
      </div>

      {showMessage && (
  <div className={styles.popup}>
    Redirecting to Checkout Page...
  </div>
)}


    </div>
  );
};

export default ProductBuy;
