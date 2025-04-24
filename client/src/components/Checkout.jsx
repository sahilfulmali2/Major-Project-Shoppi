import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import styles from "./Checkout.module.css";
import { useNavigate } from "react-router-dom";

const Checkout = () => {
  const location = useLocation();
  const { product } = location.state || {};
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setemail] = useState("");
  const navigate = useNavigate();

  if (!product) {
    return <p className={styles.loading}>No product.</p>;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const orderData = {
      name: name,
      address: address,
      mobile: mobile,
      productName: product.name,
      price: product.price,
      email: email,
      quantity: product.quantity,
      total: product.price * product.quantity,
      date: new Date().toISOString(),
    };

    try {
      const res = await fetch("http://localhost:5000/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      if (res.ok) {
        console.log("Order Done");
        alert("Order Placed Sucessfully")
        navigate("/", { state: { product, success: true } });
      } else {
        alert("Failed to place order. Please try again.");
      }
    } catch (err) {
      console.error("Error submitting order:", err);
      alert("Something went wrong!");
    }
  };

  return (
    <div className={styles.checkoutContainer}>
      <h2>Checkout</h2>

      <div className={styles.productSection}>
        <h3>{product.name}</h3>
        <p>Quantity: {product.quantity}</p>
        <p className={styles.price}>
          Total: ₹{product.price * product.quantity}
        </p>
      </div>

      <div className={styles.checkoutForm}>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label>Name:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label>Email:</label>
            <input
              value={email}
              onChange={(e) => setemail(e.target.value)}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label>Address:</label>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </div>
         


          <div className={styles.formGroup}>
            <label>Mobile Number:</label>
            <input
              type="text"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              required
            />
          </div>

          <button type="submit">Place Order</button>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
