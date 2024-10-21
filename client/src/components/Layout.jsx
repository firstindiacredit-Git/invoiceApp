import React from "react";
import NavBar from './NavBar/NavBar'
import Header from './Header/Header'
import Footer from './Footer/Footer'

const Layout = (props) => {
  const user = JSON.parse(localStorage.getItem("profile"));

  return (
    <div>
      {user && <NavBar />}
      <Header />
      {/* Render nested components */}
      {props.children}
      <Footer />
    </div>
  );
};

export default Layout;
