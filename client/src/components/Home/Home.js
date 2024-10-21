import React from "react";
import styles from "./Home.module.css";

const Home = () => {
  return (
    <div className={styles.pageContainer}>
      <section className={styles.hero}>
        <h1 style={{ fontSize: "2rem" }}>Easiest Invoicing</h1>
        <div className={styles.paragraph}>a
          Simplify your business with easy-to-use invoicing. Manage your
          finances effortlessly and focus on growing your business.
        </div>
        <div className={styles.imgContainer}>
          <img
            src="https://res.cloudinary.com/dns9jkmcp/image/upload/v1729231866/d66eax7uggkuoprgddir.png"
            alt="invoicing-app"
          />
        </div>
      </section>
    </div>
  );
};

export default Home;
