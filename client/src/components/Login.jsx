import axios from "axios";
import styles from "../admin/Addition.module.css";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/login", {
        username,
        password,
      });

      localStorage.setItem("token", response.data.token);

      const decoded = jwtDecode(response.data.token);
      console.log(decoded);
      localStorage.setItem("name", decoded.name);

      setMessage("Successfull");
      console.log(response.data);
      setUsername("");
      setPassword("");

      if (response.data.role === "admin") {
        setTimeout(() => {
          navigate("/adminpanel");
          window.location.reload();
        }, 1000);
      } else {
        setTimeout(() => {
          navigate("/");
          window.location.reload();
        }, 1500);
      }
    } catch (error) {
      setMessage("Login Fails");
      console.log(error);
    }
  };

  return (
    <div className={styles.container}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
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
        <button type="submit">Login</button>
      </form>
      {message}
    </div>
  );
};

export default Login;
