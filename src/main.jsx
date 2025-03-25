import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

import Navbar from './components/Navbar.jsx'
import Homepage from './components/Homepage.jsx'
import Homepage2 from './components/Homepage2.jsx'
import Sale from './components/Sale.jsx'
import Footer from './components/Footer.jsx'
import ProductDisplay from './components/ProductDisplay.jsx'
import ProductPage from './components/ProductPage.jsx'
import AddProductPage from './admin/Addition.jsx'



createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Navbar></Navbar>
    <Homepage></Homepage>
    <Homepage2></Homepage2>
    <Sale></Sale>
    <Homepage2></Homepage2>
    <ProductDisplay></ProductDisplay>
    <Footer></Footer>
    <ProductPage></ProductPage>

    <AddProductPage></AddProductPage>
  </StrictMode>
)
