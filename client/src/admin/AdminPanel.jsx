import styles from "./admin.module.css";
import { useNavigate  } from "react-router-dom";

const AdminPanel = () => {
  const navigate = useNavigate ();
  return (
    <>
      <div className={styles.container}>
        <div className={styles.heading}>
          <h1>Add Bidding Products</h1>
          <button className={styles.button} onClick={() => navigate("/add")}>
            Add Product
          </button>
        </div>
        <div className={styles.heading}>
          <h1>Add Category Products</h1>
          <button className={styles.button} onClick={() => navigate("/admin/add")}>
            Add Product
          </button>
        </div>
        <div className={styles.heading}>
          <h1>Delete Products</h1>
          <button className={styles.button} onClick={() => navigate("/delete")}>
            Delete Product
          </button>
        </div>
      </div>
    </>
  );
};

export default AdminPanel;
