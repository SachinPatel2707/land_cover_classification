import React from 'react'
import "../home/Header.css";
import Logo from "./image1.png";

const Header = () => {
    return (
        <div className="header">
            <img src={Logo} alt="Logo" className="logo" ></img>
            <button className="login-button">Login</button>
        </div>
    );
};

export default Header;