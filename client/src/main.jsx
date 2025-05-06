import React from 'react';
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./index.css";

import App from "./App.jsx";
import Navbar from "./components/Navbar.jsx";
import DisplayProduct from './components/DisplayProduct.jsx';
import ProductPage from "./components/ProductPage.jsx";
import Register from "./components/Registration.jsx";
import Contact from "./components/Contact.jsx";
import Login from "./components/Login.jsx";
import Admin from "./admin/admin.jsx";
import AddProduct from './admin/AddProduct.jsx';
import AddProductPage from "./admin/Addition.jsx";
import AdminPanel from './admin/AdminPanel.jsx';
import ProductBuy from './components/ProductBuy.jsx';
import Checkout from './components/Checkout.jsx';
import BidCheckout from './admin/BidCheckout.jsx';
import Chat from './admin/UserChat.jsx';
import AdminChat from './admin/AdminChat.jsx';

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/adminpanel/add" element={<AddProductPage />} />
        <Route path="/adminpanel/addcategory" element={<AddProduct />} />
        <Route path="/products/:productId" element={<ProductPage />} />
        <Route path="/buy/products/:id" element={<ProductBuy/>} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/bidcheckout" element={<BidCheckout/>} />
        <Route path="/items" element={<DisplayProduct />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/adminpanel/delete" element={<Admin />} />
        <Route path="/adminpanel" element={<AdminPanel />} />
        <Route path="/adminchat" element={<AdminChat />} />
        <Route path="/userchat" element={<Chat />} />
      </Routes>
    </Router>
  </StrictMode>
);
