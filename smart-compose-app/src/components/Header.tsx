import React from "react";
import icon from "../assets/merlionLogo.png";
import "../styles/Header.css";
const Header = () => {
  return (
    <header className="header">
      <img src={icon} alt="Icon" />
      <p>
        An Official Website of the <strong>Singapore Government</strong>
      </p>
    </header>
  );
};

export default Header;
