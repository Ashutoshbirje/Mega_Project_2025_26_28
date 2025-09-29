import React from "react";
import "./Header.css";

function Header({ isAuthenticated, onLogout }) {
  return (
    <header className="zps-header">
      <div className="zps-topbar">
        <div className="zps-topbar-left">महाराष्ट्र सरकार</div>
        <div className="zps-topbar-right">GOVERNMENT OF MAHARASHTRA</div>
      </div>
      <div className="zps-brand">
        <div className="zps-emblem" aria-hidden="true">🪙</div>
        <div className="zps-titles">
          <div className="zps-title-hi">जिल्ला परिषद सांगली</div>
          <div className="zps-title-en">Zilla Parishad Sangli</div>
        </div>
        <div className="zps-logos" aria-hidden="true">
          <div className="zps-logo-gov" />
          <div className="zps-logo-zp" />
        </div>
        {isAuthenticated && (
          <button className="zps-logout" onClick={onLogout} title="Logout">
            Logout
          </button>
        )}
      </div>
      <nav className="zps-nav">
        <button className="zps-menu" aria-label="menu">≡</button>
      </nav>
    </header>
  );
}

export default Header;


