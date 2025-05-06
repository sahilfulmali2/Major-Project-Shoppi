import { useEffect, useState } from "react";
import styles from "./admin.module.css";
import icon from "../assets/DeleteIcon.png";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Admin = () => {
  const [products, setProducts] = useState([]);
  const navigate = new useNavigate;
  useEffect(() => {
    fetch("http://localhost:5000/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((error) => console.log("Error Fetching Product From DB", error));
  }, []);

  // Function to delete product
  const handleDelete = async (id) => {
    try {
      console.log("Deleting Product ID:", id);
      const res = await fetch(`http://localhost:5000/api/products/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      console.log("Delete Response:", data);

      // Update the UI by removing the deleted product
      setProducts(products.filter((product) => product._id !== id));
    } catch (error) {
      console.log("Error Deleting Product, Frontend:", error);
    }
  };


  
  return (
    <>
      <div className={styles.container}>
        <div className={styles.heading}>
          <h1>Back to Admin Panel</h1>
          <button className={styles.button} onClick={() => navigate("/adminpanel")}>Back</button>
        </div>

        {products.length > 0 ? (
          products.map((product) => (
            <div className={styles.product} key={product._id}>
              <img src={`http://localhost:5000${product.image}`} alt="product" />
              <div className="info">
                <h3>{product.name}</h3>
                <p>{product.description}</p>
              </div>
              <button
                className={styles.deletebutton}
                onClick={() => handleDelete(product._id)}
              >
                <img src={icon} alt="" className={styles.delete} />
              </button>
            </div>
          ))
        ) : products.length === 0 ? (
          <p>No products available</p>
        ) : (
          <p>Loading products...</p>
        )}
      </div>
    </>
  );
};

export default Admin;
