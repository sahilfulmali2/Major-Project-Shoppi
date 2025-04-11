import styles from "./ProductPage.module.css";
import { useEffect, useState } from "react";
import Footer from "./Footer.jsx";
import { useParams } from "react-router-dom";
import axios from "axios";
import { io } from "socket.io-client";

const ProductPage = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [bidAmount, setBidAmount] = useState("");
  const [bids, setBids] = useState([]);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const newSocket = io("http://localhost:5000", { auth: { token } });
    
    newSocket.on("connect", () => {
      console.log("Socket connected:", newSocket.id);
    });

    setSocket(newSocket);

    return () => newSocket.disconnect();
  }, []);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/products`);
        const found = res.data.find((prod) => prod._id === productId);
        setProduct(found);
        setBids(found?.bids || []);
      } catch (err) {
        console.error("Error fetching product:", err);
      }
    };

    fetchProduct();
  }, [productId]);

  useEffect(() => {
    if (!socket) return;

    socket.on("bidUpdated", ({ productId: updatedId, latestBid }) => {
      if (updatedId === productId) {
        setBids((prev) => [latestBid, ...prev]);
      }
    });

    socket.on("bidRejected", ({ reason }) => {
      console.log("reject hogya tu")
      alert(`❌ Bid Rejected: ${reason}`);
    });

    return () => {
      socket.off("bidUpdated");
      socket.off("bidRejected");
    };
  }, [socket, productId]);

  const handlePlaceBid = async () => {
    const token = localStorage.getItem("token");
    console.log("Retrieved token from front end", token); 

    if (!token || !socket || !bidAmount) {
      console.error("Token or socket or bidAmount is missing");
      return;
    }

    socket.emit("placebid", {
      productId,
      amount: Number(bidAmount),
    });
    
    setBidAmount("");
    alert(`Bid Placed: ₹${bidAmount}`);
  };

  if (!product) {
    return <p>Loading product...</p>;
  }

  const sortedBids = [...bids].sort((a, b) => b.amount - a.amount);
  const highestBid = sortedBids.length > 0 ? sortedBids[0] : null;

  return (
    <>
      <div className={styles.Container}>
        <div className={styles.ImgBox}>
          <img src={product.image} alt={product.name} />
        </div>
        <div className={styles.Details}>
          <h2>{product.name}</h2>
          <p>{product.description}</p>
          <p>Base Price: ₹{product.price}</p>

          <h3>
            Current Bid :{" "}
            {highestBid ? (
              <>
                ₹{highestBid.amount} by <strong>{highestBid.username || "N/A"}</strong>
              </>
            ) : (
              "No bids yet"
            )}
          </h3>

          <h3>📈 Live Bids</h3>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {sortedBids.map((bid, index) => (
              <li key={index}>
                ₹{bid.amount} by <strong>{bid.username || "N/A"}</strong>
              </li>
            ))}
          </ul>

          <input
            type="number"
            placeholder="Enter your bid"
            value={bidAmount}
            onChange={(e) => setBidAmount(e.target.value)}
          />
          <button className={styles.button} onClick={handlePlaceBid}>
            Place a Bid
          </button>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ProductPage;
