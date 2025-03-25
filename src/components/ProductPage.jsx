import styles from './ProductPage.module.css';
import Navbar from './Navbar.jsx'
import ProductIamge from "../assets/Login/Speaker.jpg";
import Footer from './Footer.jsx';

const ProductPage = () => {
  return (
    <>
      <Navbar/>
      <div className={styles.Container}>
        <div className={styles.ImgBox}>
          <img src={ProductIamge} alt="" />
        </div>
        <div className={styles.Details}>
          <h2>Product Name</h2>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptas, omnis est consequuntur deserunt optio voluptatibus odit laboriosam, quidem, magni adipisci facilis. Ipsa odio voluptatem earum, nam optio assumenda.</p>
          <h3>Current Bid : 500$</h3>
          <button className={styles.button}>
            <a href="">Place a Bid</a>
          </button>
        </div>
      </div>
      <Footer/>
    </>
  )
};

export default ProductPage;