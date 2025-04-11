// ProductDisplay.jsx
import React from 'react';
import styles from './ProductDisplay.module.css';

const ProductDisplay = () => {
  return (
    <div className={styles.container}>
      <div className={styles.featuredBadge}>
        <span>Featured</span>
      </div>
      
      <h1 className={styles.sectionTitle}>New Arrival</h1>
      
      <div className={styles.productGrid}>
        <div className={styles.mainProduct}>
          <div className={styles.productCard}>
            <img 
              src="src\assets\Login\playstation.webp" 
              alt="PlayStation 5" 
              className={styles.productImage}
            />
            <div className={styles.productInfo}>
              <h2>PlayStation 5</h2>
              <p>Black and White version of the PS5 coming out on sale.</p>
              <button className={styles.shopButton}>Shop Now</button>
            </div>
          </div>
        </div>
        
        <div className={styles.secondaryProduct}>
          <div className={styles.productCard}>
            <img 
              src="src\assets\Login\cloth.webp" 
              alt="Women's Collections" 
              className={styles.productImage}
            />
            <div className={styles.productInfo}>
              <h2>Women's Collections</h2>
              <p>Featured woman collections that give you another vibe.</p>
              <button className={styles.shopButton}>Shop Now</button>
            </div>
          </div>
        </div>
        
        <div className={styles.smallProduct}>
          <div className={styles.productCard}>
            <img 
              src="src\assets\Login\speaker.webp" 
              alt="Speakers" 
              className={styles.productImage}
            />
            <div className={styles.productInfo}>
              <h2>Speakers</h2>
              <p>Amazon wireless speakers</p>
              <button className={styles.shopButton}>Shop Now</button>
            </div>
          </div>
        </div>
        
        <div className={styles.smallProduct}>
          <div className={styles.productCard}>
            <img 
              src="src\assets\Login\perfume.webp" 
              alt="Perfume" 
              className={styles.productImage}
            />
            <div className={styles.productInfo}>
              <h2>Perfume</h2>
              <p>GUCCI INTENSE OUD EDP</p>
              <button className={styles.shopButton}>Shop Now</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDisplay;