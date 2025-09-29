import React from "react";
import "./Footer.css";

function Footer() {
  return (
    <footer className="zps-footer">
      <div className="zps-footer-inner">
        <div>© {new Date().getFullYear()} Zilla Parishad Sangli</div>
        <div className="zps-footer-links">
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
          <a href="#privacy">Privacy</a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;


