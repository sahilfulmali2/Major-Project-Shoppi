import { useEffect, useState } from "react";
import styles from "./Homepage2.module.css";
import Card from "./Card.jsx";

function Homepage2() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((error) => console.error("Error fetching products:", error));
  }, []);

  return (
    <div className={styles.Home2Container}>
      <div className={styles.Container1}>
        <h1>Best Selling Products</h1>
        <button className={styles.button}>View All</button>
      </div>

      <div className={styles.productContainer}>
        {products.length > 0 ? (
          products.map((product) => <Card key={product._id} product={product} />)
        ) : (
          <p>Loading products...</p>
        )}
      </div>
    </div>
  );
}

export default Homepage2;
