import React from "react";
import 'bootstrap/dist/css/bootstrap.css'

const Footer = () => {
  const currentYear = new Date().getFullYear(); // Dynamically get the current year

  return (
    <footer
      style={{
        textAlign: "center",
        padding: "10px",
        backgroundColor: "#ED8200", // Light background color
        color: "#FFFFFF", // Text color
        fontSize: "14px",
        borderTop: "1px solid #e9ecef", // Optional: Add a border
      }}
    >
      &copy; {currentYear} E-Wallet. All rights reserved.
    </footer>
  );
};

export default Footer;