import React, { useState } from "react";
import axios from "axios";
import styles from "./Addition.module.css";

const AddProduct = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState(null);
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("image", image);
      formData.append("quantity", quantity);

    console.log("Submitted product:", formData);
    const token = localStorage.getItem("token");

    try {
      const res = await axios.post(
        "http://localhost:5000/admin/add",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(res.data)
      alert(`Product Added: ${name}`);
      setName("");
      setDescription("");
      setPrice("");
      setImage(null);
      setCategory("");
      setQuantity("");
    } catch (error) {
      console.log("Error Adding Product", error);
    }
  };

  return (
    <div className={styles.container}>
      <h2>Add New Product</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div>
          <label>Product Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Category</label>
          <select
            className={styles.select}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="">--Select Category--</option>
            <option value="Electronics">Electronics</option>
            <option value="Clothing">Clothing</option>
            <option value="Vehicles">Vehicles</option>
            <option value="Accessories">Accessories</option>
            <option value="Home">Home&Lifestyle</option>
          </select>
        </div>

        <div>
          <label>Price</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Quantity</label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Product Image</label>
          <input type="file" onChange={handleImageChange} required />
        </div>
        <button type="submit">Add Product</button>
      </form>
    </div>
  );
};

export default AddProduct;
