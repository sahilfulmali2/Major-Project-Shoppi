import React from 'react';
import ReactDOM from 'react-dom/client';
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./index.css";
import Navbar from "./components/Navbar.jsx";
import App from "./App.jsx";
import AddProductPage from "./admin/Addition.jsx";
import ProductPage from "./components/ProductPage.jsx";
import Register from "./components/Registration.jsx";
import Contact from "./components/Contact.jsx";
import Login from "./components/Login.jsx";
import Admin from "./admin/admin.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/add" element={<AddProductPage />} />
        <Route path="/products/:productId" element={<ProductPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/adminpanel" element={<Admin />} />
      </Routes>
    </Router>
  </StrictMode>
);
