import "./Header.css";
import { FaExternalLinkAlt, FaSignOutAlt } from "react-icons/fa";

function Header({ isAuthenticated, onLogout }) {
  return (
    <header class="header-wrapper">
      <div class="gov-header">
        <div class="gov-container">
          <div className="Tag">
            <span class="gov-english">GOVERNMENT OF MAHARASHTRA</span>
            <span class="divider">|</span>
            <span class="gov-marathi">महाराष्ट्र सरकार</span>
          </div>
          <div className="header-actions">
            {isAuthenticated ? (
              // Simple logout icon as requested
              <span
                className="logout-icon-btn"
                onClick={onLogout}
                title="Logout"
                aria-label="Logout"
              >
                LOGOUT <FaSignOutAlt className="logout-icon" />
              </span>
            ) : (
              // Link to maharashtra.gov.in with icon as requested
              <a
                href="https://maharashtra.gov.in/"
                target="_blank"
                rel="noopener noreferrer"
                className="external-link-btn"
                title="Visit Maharashtra Government Portal"
                aria-label="Visit Maharashtra Government Portal"
              >
                <FaExternalLinkAlt className="external-link-icon" />
              </a>
            )}
          </div>
        </div>
      </div>
      <div class="container7">

        <div class="row1">
          {/* <!-- Left Section --> */}
          <div class="col-left">
            <div class="logo">
              <a
                href="https://zpsangli.maharashtra.gov.in/"
                class="site_logo"
                title="मुख्यपृष्ठावर जा"
              >
                <img
                  id="logo"
                  class="emblem"
                  src="https://zpsangli.maharashtra.gov.in/wp-content/themes/sdo-theme/images/emblem.svg"
                  alt="भारताचे राज्य चिन्ह"
                />
                <div className="logo_text">
                  {" "}
                  <strong
                    className="logo-marathi"
                  >
                    {" "}
                    जिल्हा परिषद सांगली{" "}
                  </strong>{" "}
                  <strong
                    className="logo-english"
                  >
                    {" "}
                    Zilla Parishad Sangli{" "}
                  </strong>{" "}
                </div>
              </a>
            </div>
          </div>

          {/* <!-- Right Section --> */}
          <div class="col-right">
            <div class="header-right">
              <a
                href="https://maharashtra.gov.in/"
                target="_blank"
                rel="noopener noreferrer"
                title="महाराष्ट्र शासन"
              >
                <img
                  class="sw-logo"
                  src="https://cdnbbsr.s3waas.gov.in/s38a7c30f86cf0485f10ab51b351d9e6ba/uploads/2025/04/202504151522359564.png"
                  alt="महाराष्ट्र शासन"
                />
              </a>

              <a
                href="https://zpsangli.maharashtra.gov.in/"
                title="जिल्हा परिषद सांगलीचा लोगो"
              >
                <img
                  class="sw-logo"
                  src="https://cdnbbsr.s3waas.gov.in/s38a7c30f86cf0485f10ab51b351d9e6ba/uploads/2025/03/202503242097435254.png"
                  alt="जिल्हा परिषद सांगलीचा लोगो"
                />
              </a>


            </div>
          </div>
        </div>

      </div>
    </header>
    // <!-- ================= Header End ================= -->
  );
}

export default Header;
