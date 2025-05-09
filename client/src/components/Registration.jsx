import axios from "axios";
import styles from "../admin/Addition.module.css";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Registration = () => {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [tokenamount, settokenamount] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    // const formdata = new FormData();
    // formdata.append("name", name);
    // formdata.append("username", username);
    // formdata.append("password", password);
    
    try {
      const response = await axios.post(
        "http://localhost:5000/register",
        // formdata,
        {
          name,
          username,
          password,
          tokenamount,
        }
      );

      setMessage("Registration Successfull");
      console.log(response.data);

      setName("");
      setUsername("");
      setPassword("");
      settokenamount("");
      setTimeout (()=> navigate("/login"),1500);
    } catch (error) {
      alert("Registration Fails... Try Again")
      setMessage("Registration Fails");
      console.log(error);
    }
  };

  return (
    <div className={styles.container}>
      <h2>Register</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div>
          <label>Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Token (in multiple of 1000)</label>
          <input
            type="number"
            value={tokenamount}
            onChange={(e) => settokenamount(e.target.value)}
            required
          />
        </div>
        <button type="submit">Register</button>
      </form>
      {message}
    </div>
  );
};

export default Registration;
