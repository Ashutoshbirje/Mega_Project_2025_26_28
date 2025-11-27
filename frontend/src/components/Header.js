import React from "react";
import "./Header.css";

function Header({ isAuthenticated, onLogout }) {
  return (
    <header
      className="header-wrapper"
      style={{
        width: '100%',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        padding: 0,
        marginBottom: '0.5rem',
        fontFamily: 'Roboto, Arial, sans-serif',
      }}
    >
      <div
        className="container"
        style={{
          // backgroundColor: '#fe0000ff',
          maxWidth: '100%',
          // margin: '0 auto',
          borderRadius: '15px',
          padding: '0 24px',
        }}
      >
        <div
          className="row"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            minHeight: '110px',
          }}
        >
          <div
            className="col-lg-8 col-md-8 col-sm-7 col-xs-7"
            style={{ display: 'flex', alignItems: 'center' }}
          >
            <div className="logo" style={{ display: 'flex', alignItems: 'center' }}>
              <a
                href="https://zpsangli.maharashtra.gov.in/"
                title="मुख्यपृष्ठावर जा"
                className="site_logo"
                rel="home"
                style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}
              >
                <img
                  id="logo"
                  className="emblem"
                  src="https://zpsangli.maharashtra.gov.in/wp-content/themes/sdo-theme/images/emblem.svg"
                  alt="भारताचे राज्य चिन्ह"
                  style={{ width: '70px', height: '80px', marginRight: '18px' }}
                />
                <div className="logo_text" style={{ color: '#222' }}>
                  <strong lang="mr" style={{ fontSize: '1.0rem', display: 'block', color: '#222', fontWeight: 600 }}>
                    जिल्हा परिषद सांगली
                  </strong>
                  <h1 className="h1-logo" style={{ fontSize: '2.0rem', margin: 0, color: '#222', fontWeight: 700 }}>
                    Zilla Parishad Sangli
                  </h1>
                </div>
              </a>
            </div>
          </div>
          <div
            className="col-lg-4 col-md-4 col-sm-5 col-xs-5"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '18px' }}
          >
            <div className="header-right hidden-xs push-right" style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
              <a
                aria-label="महाराष्ट्र शासन - बाह्य विंडो जी नवीन विंडोमध्ये उघडते"
                href="https://maharashtra.gov.in/"
                target="_blank"
                rel="noopener noreferrer"
                title="महाराष्ट्र शासन"
                style={{ display: 'inline-block' }}
              >
                <img
                  className="sw-logo"
                  src="https://cdnbbsr.s3waas.gov.in/s38a7c30f86cf0485f10ab51b351d9e6ba/uploads/2025/04/202504151522359564.png"
                  alt="महाराष्ट्र शासन"
                  style={{ width: '65px', height: 'auto', background: '#fff', borderRadius: '50%', boxShadow: '0 1px 4px rgba(0,0,0,0.07)' }}
                />
              </a>
              <a
                aria-label="जिल्हा परिषद सांगलीचा लोगो - बाह्य विंडो जी नवीन विंडोमध्ये उघडते"
                href="https://zpsangli.maharashtra.gov.in/"
                title="जिल्हा परिषद सांगलीचा लोगो"
                style={{ display: 'inline-block' }}
              >
                <img
                  className="sw-logo"
                  src="https://cdnbbsr.s3waas.gov.in/s38a7c30f86cf0485f10ab51b351d9e6ba/uploads/2025/03/202503242097435254.png"
                  alt="जिल्हा परिषद सांगलीचा लोगो"
                  style={{ width: '65px', height: 'auto', background: '#fff', borderRadius: '50%', boxShadow: '0 1px 4px rgba(0,0,0,0.07)' }}
                />
              </a>
              {isAuthenticated && (
                <button
                  className="zps-logout"
                  onClick={onLogout}
                  title="Logout"
                  style={{
                    background: '#e74c3c',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '8px 18px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Logout
                </button>
              )}
            </div>
            {/* <a
              className="menuToggle"
              href="javascript:void(0);"
              aria-label="Main Menu"
              aria-expanded="false"
              style={{ marginLeft: '18px', display: 'flex', alignItems: 'center', color: '#222', textDecoration: 'none', fontWeight: 500 }}
            >
              <span className="icon-menu" aria-hidden="true" style={{ fontSize: '2.2rem' }}>≡</span>
              <span className="menu-text" style={{ marginLeft: '8px', fontSize: '1.1rem' }}>मेनू टॉगल</span>
            </a> */}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;


