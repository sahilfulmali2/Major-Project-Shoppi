import { useEffect, useState } from "react";
import styles from "./DisplayProduct.module.css";
import Card2 from "./Card2.jsx";
import axios from "axios";

function DisplayProduct() {
  const [items, setItems] = useState([]);
  const [category, setCategory] = useState("");

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const url = category
          ? `http://localhost:5000/items/category/${category}`
          : "http://localhost:5000/items";

        const response = await axios.get(url);
        setItems(response.data);
      } catch (error) {
        console.log("Error Fetching Pr0duct", error);
      }
    };
    fetchItem();
  }, [category]);



  return (
    <div className={styles.Home2Container}>
      <div className={styles.Container1}>
        <h1>Products Category</h1>
        <div className={styles.category}>
          <button onClick={()=> setCategory("")}>All Products</button>
          <button onClick={()=> setCategory("Electronics")}>Electronics</button>
          <button onClick={()=> setCategory("Clothing")}>Clothing</button>
          <button onClick={()=> setCategory("Vehicles")}>Vehicles</button>
          <button onClick={()=> setCategory("Home")}>Home</button>
          <button onClick={()=> setCategory("Accessories")}>Accessories</button>
        </div>
      </div>
      
      <div className={styles.productContainer}>
        {items.length > 0 ? (
          items.map((product) => (
            <Card2 key={product._id} product={product} />
          ))
        ) : (
          <p>Loading products...Display</p>
        )}
      </div>
    </div>
  );
}

export default DisplayProduct;
