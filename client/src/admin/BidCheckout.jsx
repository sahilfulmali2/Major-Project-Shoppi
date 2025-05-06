import React, { useEffect, useState } from "react";
import styles from "./BidCheckout.module.css";
import axios from "axios";
import { io } from "socket.io-client";


export default function BidCheckout() {
  const [products, setProducts] = useState([]);
  
  useEffect(() => {
    const fetchProducts = async () => {
      const res = await axios.get(`http://localhost:5000/api/products`);
      setProducts(res.data);
    };
    fetchProducts();
    const socket = io("http://localhost:5000");

    // ✅ Setup socket listener
    socket.on("bidUpdated", ({ productId, latestBid }) => {
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product._id === productId
            ? { ...product, highestBid: latestBid }
            : product
        )
      );
    });

    // ✅ Clean up when component unmounts
    return () => {
      socket.off("bidUpdated");
    };
  }, []);

  const handleSell = async (
    productId,
    highestBidderEmail,
    bidAmount,
    biddername,
  ) => {
    try {
      const res = await axios.post(
        `http://localhost:5000/api/sell/${productId}`,
        {
          name: biddername,
          username: highestBidderEmail,
          bidAmount: bidAmount,
        }
      );
      alert(res.data.message);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Bid Status</h2>
      <div className={styles.productList}>
        {products.map((product) => (
          <div key={product._id} className={styles.productCard}>
            <img
              src={`http://localhost:5000${product.image}`}
              alt={product.name}
              className={styles.productImage}
            />
            <h3>{product.name}</h3>

            <p>Base Price: ₹{product.price}</p>
            <p>
              Status:{" "}
              <span
                className={
                  product.status === "Sold" ? styles.sold : styles.available
                }
              >
                {product.status}
              </span>
            </p>
            {product.highestBid ? (
              <div className={styles.bidInfo}>
                <p>
                  <strong>Highest Bid:</strong> ₹{product.highestBid.amount}
                </p>
                <p>
                  <strong>Bidder:</strong> {product.highestBid.name}
                </p>
              </div>
            ) : (
              <p>No bids yet</p>
            )}
            {product.status === "Available" && product.highestBid && (
              <button
                onClick={() =>
                  handleSell(
                    product._id,
                    product.highestBid.username,
                    product.highestBid.amount,
                    product.highestBid.name
                  )
                }
                className={styles.sellButton}
              >
                Sell
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
