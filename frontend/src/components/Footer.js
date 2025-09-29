import React from "react";
import "./Footer.css";

function Footer() {
  return (
    <footer className="zps-footer">
      <div className="zps-footer-inner">
        <div>
          <span style={{ fontWeight: 600, color: '#222' }}>
            © {new Date().getFullYear()} Zilla Parishad Sangli
          </span>
          <span style={{ marginLeft: 12, color: '#555', fontSize: '13px' }}>
            | Powered by Maharashtra Government
          </span>
        </div>
        <div className="zps-footer-links">
          <a href="https://zpsangli.maharashtra.gov.in/" target="_blank" rel="noopener noreferrer">Official Website</a>
          <a href="https://maharashtra.gov.in/" target="_blank" rel="noopener noreferrer">Maharashtra Govt</a>
          <a href="/privacy-policy">Privacy Policy</a>
          <a href="/contact">Contact</a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;


