import { useEffect, useState } from "react";
import styles from "./Homepage2.module.css";
import Card2 from "./Card2.jsx";
import { useNavigate } from "react-router-dom";

function CategoryProductDisplay() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    fetch("http://localhost:5000/items")
      .then((res) => res.json())
      .then((data) => {
        // console.log("Fetched products:", data);
        setProducts(data)})
      .catch((error) => console.error("Error fetching products:", error));
  }, []);

  const handleClick =()=>{
    navigate("/items");
  };

  return (
    <div className={styles.Home2Container}>
      <div className={styles.Container1}>
        <h1>Products by Category</h1>
        <button onClick={handleClick} className={styles.button}>View All</button>
      </div>

      <div className={styles.productContainer}>
        {products.length > 0 ? (
          products.map((product) => <Card2 key={product._id} product={product} />)
        ) : (
          <p>Loading products...</p>
        )}
      </div>
    </div>
  );
}

export default CategoryProductDisplay;
