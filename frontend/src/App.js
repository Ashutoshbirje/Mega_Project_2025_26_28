import React, { useState, useEffect } from "react";
import {
  adminUpload,
  userVerify,
  login,
  register,
  getCurrentUser,
  logout,
} from "./api";
import IPFSVisualization from "./components/IPFSVisualization";
import Header from "./components/Header";
import HashGenerator from "./components/HashGenerator";
import Block3D from "./components/Block3D"; 
import "./App.css";
import "./styles.css";

function App() {
  const [adminFile, setAdminFile] = useState(null);
  const [userFile, setUserFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState({
    admin: false,
    user: false,
    auth: false,
  });
  const [error, setError] = useState(null);
  const [showVisualization, setShowVisualization] = useState(false);
  const [showHashGenerator, setShowHashGenerator] = useState(false);
  const [showLoginSignupBlock, setLoginSignupBlock,] = useState(false);

  // Authentication states
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLogin, setShowLogin] = useState(true);
  const [authForm, setAuthForm] = useState({
    email: "",
    password: "",
    role: "user",
  });

  // Check if user is logged in on component mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const response = await getCurrentUser();
          setUser(response.user);
          setIsAuthenticated(true);
        } catch (error) {
          // Only clear if token is INVALID
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setUser(null);
          setIsAuthenticated(false);
        }
      }
    };
    checkAuth();
  }, []);

  // Authentication handler — correct & final version
  const handleAuth = async (e) => {
    e.preventDefault();

    if (!authForm.email || !authForm.password) {
      setError("Please fill in all fields");
      return;
    }

    setLoading((prev) => ({ ...prev, auth: true }));
    setError(null);

    try {
      const response = showLogin
        ? await login(authForm.email, authForm.password)
        : await register(authForm.email, authForm.password, authForm.role);

      const token = response.accessToken; // Correct key from backend
      if (!token) throw new Error("No access token returned from server");

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(response.user));

      setUser(response.user);
      setIsAuthenticated(true);
      setAuthForm({ email: "", password: "", role: "user" });
    } catch (err) {
      console.error("Auth error:", err);
      setError(
        err.response?.data?.error || err.message || "Authentication failed"
      );
    } finally {
      setLoading((prev) => ({ ...prev, auth: false }));
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const handleAdminUpload = async () => {
    if (!adminFile) {
      setError("Please select a file first!");
      return;
    }

    if (!isAuthenticated) {
      setError("Please login first to upload documents!");
      return;
    }
    // Both admin and user can upload now

    setLoading((prev) => ({ ...prev, admin: true }));
    setError(null);
    try {
      console.log("Starting upload for user:", user?.email);
      const res = await adminUpload(adminFile);
      setResult({ type: "admin", data: res });
      setShowVisualization(true);
    } catch (err) {
      console.error("Upload error:", err);
      const errorMessage =
        err.response?.data?.error ||
        err.message ||
        "Upload failed. Please try again.";
      setError(errorMessage);
    } finally {
      setLoading((prev) => ({ ...prev, admin: false }));
    }
  };

  const handleUserVerify = async () => {
    if (!userFile) {
      setError("Please select a file first!");
      return;
    }

    if (!isAuthenticated) {
      setError("Please login first to verify documents!");
      return;
    }
    // Both roles can verify

    setLoading((prev) => ({ ...prev, user: true }));
    setError(null);
    try {
      console.log("Verifying file:", {
        name: userFile.name,
        size: userFile.size,
        type: userFile.type,
        lastModified: userFile.lastModified,
      });

      const res = await userVerify(userFile);
      console.log("Verification response:", res);

      setResult({ type: "user", data: res });
      setShowVisualization(true);

      if (!res.match) {
        setError(`File not found in blockchain. Hash: ${res.fileHash}`);
      }
    } catch (err) {
      console.error("Verification error:", err);
      const errorMessage =
        err.response?.data?.error ||
        err.message ||
        "Verification failed. Please try again.";
      setError(`Verification failed: ${errorMessage}`);
    } finally {
      setLoading((prev) => ({ ...prev, user: false }));
    }
  };

  const handleAdminFileChange = (e) => {
    const file = e.target.files[0];
    setAdminFile(file);
    setError(null);
  };

  const handleUserFileChange = (e) => {
    const file = e.target.files[0];
    setUserFile(file);
    setError(null);
  };

  return (
    <div className="App">
      <Header isAuthenticated={isAuthenticated} onLogout={handleLogout} />

        {!isAuthenticated && (<h1 className="header1">Welcome to DocChain</h1>)}
        {!isAuthenticated && (<p className="para1">Trust is replaced by cryptography; security is built into the chain itself.</p>)}

      <div className="demo-section">
         {isAuthenticated ? (
               <button
          className="demo-toggle"
          onClick={() => setShowHashGenerator(!showHashGenerator)}
        >
          {showHashGenerator
            ? "Hide Hash Generator"
            : "Show Hash Generator Demo"}
        </button>
          ) : ( <div><Block3D></Block3D>  <button
          className="demo-toggle"
          onClick={() => setLoginSignupBlock(!showLoginSignupBlock)}
        >
          {showLoginSignupBlock
            ? "Exit from DocChain"
            : "Enter to DocChain"}
        </button></div>)}
        {showHashGenerator && <HashGenerator />}
      </div>

      {/* Authentication Section */}
      {(!isAuthenticated && showLoginSignupBlock) ? (
        <div className="auth-section">
          <div className="auth-toggle-label">
            {showLogin ? "Sign in" : "Sign up"}
          </div>
          <div className="auth-toggle">
            <button
              className={`toggle-btn ${showLogin ? "active" : ""}`}
              onClick={() => setShowLogin(true)}
            >
              Log In
            </button>
            <button
              className={`toggle-btn ${!showLogin ? "active" : ""}`}
              onClick={() => setShowLogin(false)}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleAuth} className="auth-form">
            {!showLogin && (
              <div className="form-group">
                <label htmlFor="role">Role:</label>
                <select
                  id="role"
                  value={authForm.role}
                  onChange={(e) =>
                    setAuthForm({ ...authForm, role: e.target.value })
                  }
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            )}
            <div className="form-group">
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                value={authForm.email}
                onChange={(e) =>
                  setAuthForm({ ...authForm, email: e.target.value })
                }
                placeholder="Enter your email"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password:</label>
              <input
                type="password"
                id="password"
                value={authForm.password}
                onChange={(e) =>
                  setAuthForm({ ...authForm, password: e.target.value })
                }
                placeholder="Enter your password"
                required
                minLength="6"
              />
            </div>
            <button
              type="submit"
              className="auth-submit-btn"
              disabled={loading.auth}
            >
              {loading.auth
                ? "Processing..."
                : showLogin
                ? "Login"
                : "Register"}
            </button>
            {error && (
              <div style={{ color: "#b91c1c", fontSize: "0.95rem" }}>
                {error}
              </div>
            )}
          </form>
        </div>
      ) : (isAuthenticated && 
        (<div className="container">
          {/*  Add here login register in toggle nature with actual content of the container */}

          <div className="main-content">
            {user?.role === "admin" && (
              <div className="section">
                <h3>📤 Document Upload</h3>
                <div className="file-input-wrapper">
                  <input
                    type="file"
                    id="admin-file"
                    onChange={handleAdminFileChange}
                    accept=".pdf,.png,.jpg,.jpeg"
                  />
                  <label
                    htmlFor="admin-file"
                    className={`file-input-label ${
                      adminFile ? "has-file" : ""
                    }`}
                  >
                    <span>📁</span>
                    <span>
                      {adminFile ? adminFile.name : "Choose file to upload"}
                    </span>
                  </label>
                </div>
                {adminFile && (
                  <div className="file-name">
                    Selected: {adminFile.name} (
                    {(adminFile.size / 1024 / 1024).toFixed(2)} MB)
                  </div>
                )}
                <button
                  onClick={handleAdminUpload}
                  disabled={loading.admin || !adminFile}
                  className={loading.admin ? "loading" : ""}
                >
                  {loading.admin ? "Uploading..." : "Upload Document"}
                </button>
              </div>
            )}

            <div className="section">
              <h3>🔍 User Verify</h3>
              <div className="file-input-wrapper">
                <input
                  type="file"
                  id="user-file"
                  onChange={handleUserFileChange}
                  accept=".pdf,.png,.jpg,.jpeg"
                />
                <label
                  htmlFor="user-file"
                  className={`file-input-label ${userFile ? "has-file" : ""}`}
                >
                  <span>📁</span>
                  <span>
                    {userFile ? userFile.name : "Choose file to verify"}
                  </span>
                </label>
              </div>
              {userFile && (
                <div className="file-name">
                  Selected: {userFile.name} (
                  {(userFile.size / 1024 / 1024).toFixed(2)} MB)
                </div>
              )}
              <button
                onClick={handleUserVerify}
                disabled={loading.user || !userFile}
                className={loading.user ? "loading" : ""}
              >
                {loading.user ? "Verifying..." : "Verify Document"}
              </button>
            </div>

            {error && (
              <div className="error-message">
                <span>⚠️</span>
                <span>{error}</span>
              </div>
            )}

            {result && (
              <div className="result">
                <div className="result-header">
                  <h3>
                    {result.type === "admin"
                      ? "📤 Upload Result"
                      : "🔍 Verification Result"}
                  </h3>
                  <button
                    className="visualization-toggle"
                    onClick={() => setShowVisualization(!showVisualization)}
                  >
                    {showVisualization
                      ? "Hide Visualization"
                      : "Show IPFS Visualization"}
                  </button>
                </div>
                {result.type === "admin" && result.data.ipfsUrl && (
                  <div className="ipfs-info">
                    <div className="ipfs-url">
                      <strong>🌐 IPFS URL:</strong>
                      <a
                        href={result.data.ipfsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {result.data.ipfsUrl}
                      </a>
                    </div>
                    <div className="ipfs-hash">
                      <strong>🔗 IPFS Hash:</strong> {result.data.ipfsHash}
                    </div>
                    <div className="file-hash">
                      <strong>📄 File Hash:</strong>{" "}
                      {result.data.block.data.fileHash}
                    </div>
                  </div>
                )}
                {result.type === "user" && (
                  <div className="verification-status">
                    <div
                      className={`status-indicator ${
                        result.data.match ? "success" : "failed"
                      }`}
                    >
                      {result.data.match ? "✅ VERIFIED" : "❌ NOT FOUND"}
                    </div>
                    <div className="file-hash">
                      <strong>📄 File Hash:</strong> {result.data.fileHash}
                    </div>
                    {result.data.match && result.data.ipfsUrl && (
                      <div className="ipfs-info">
                        <div className="ipfs-url">
                          <strong>🌐 IPFS URL:</strong>
                          <a
                            href={result.data.ipfsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {result.data.ipfsUrl}
                          </a>
                        </div>
                        <div className="ipfs-hash">
                          <strong>🔗 IPFS Hash:</strong> {result.data.ipfsHash}
                        </div>
                      </div>
                    )}
                  </div>
                )}
                <details>
                  <summary>📋 Raw Data</summary>
                  <pre>{JSON.stringify(result.data, null, 2)}</pre>
                </details>
              </div>
            )}

            {/* IPFS Visualization */}
            {result && showVisualization && (
              <IPFSVisualization
                fileData={
                  result.type === "admin"
                    ? {
                        originalName:
                          result.data.block?.data?.originalName || "Unknown",
                        size: result.data.block?.data?.size || 0,
                        mimeType:
                          result.data.block?.data?.mimeType || "Unknown",
                        fileHash:
                          result.data.block?.data?.fileHash ||
                          result.data.fileHash,
                        ipfsHash: result.data.ipfsHash,
                        ipfsUrl: result.data.ipfsUrl,
                        uploadedAt: result.data.block?.data?.uploadedAt,
                        block: result.data.block,
                      }
                    : {
                        originalName: userFile?.name || "Unknown",
                        size: userFile?.size || 0,
                        mimeType: userFile?.type || "Unknown",
                        fileHash: result.data.fileHash,
                        ipfsHash: result.data.ipfsHash,
                        ipfsUrl: result.data.ipfsUrl,
                        uploadedAt: result.data.foundBlock?.data?.uploadedAt,
                        block: result.data.foundBlock,
                      }
                }
                isVisible={showVisualization}
              />
            )}
          </div>
        </div>)
      )}
<footer id="mainFooter" class="no-print">



    <div class="footer-top">
        <div class="container1">
            <div class="col-xs-12 text-center">
                <nav class="footerMenu" aria-label="Footer navigation menu">
                    <ul id="menu-footer-en" class="menu" role="menubar" aria-label="Footer menu">
                        <li class="menu-item"><a href="https://zpsangli.maharashtra.gov.in/%e0%a4%85%e0%a4%ad%e0%a4%bf%e0%a4%aa%e0%a5%8d%e0%a4%b0%e0%a4%be%e0%a4%af/">Feedback</a></li>
                        <li class="menu-item"><a href="https://zpsangli.maharashtra.gov.in/%e0%a4%b5%e0%a5%87%e0%a4%ac%e0%a4%b8%e0%a4%be%e0%a4%87%e0%a4%9f-%e0%a4%a7%e0%a5%8b%e0%a4%b0%e0%a4%a3%e0%a5%87/">Website Policy</a></li>
                        <li class="menu-item"><a href="https://maharashtra.gov.in/">Maharashtra Gov</a></li>
                        <li class="menu-item"><a href="https://zpsangli.maharashtra.gov.in/">Contact Us</a></li>
                        <li class="menu-item"><a href="https://zpsangli.maharashtra.gov.in/%e0%a4%ae%e0%a4%a6%e0%a4%a4/">Help</a></li>
                        <li class="menu-item"><a href="https://zpsangli.maharashtra.gov.in/%e0%a4%b5%e0%a5%87%e0%a4%ac-%e0%a4%ae%e0%a4%be%e0%a4%b9%e0%a4%bf%e0%a4%a4%e0%a5%80-%e0%a4%b5%e0%a5%8d%e0%a4%af%e0%a4%b5%e0%a4%b8%e0%a5%8d%e0%a4%a5%e0%a4%be%e0%a4%aa%e0%a4%95/">Web Information Manager</a></li>
                    </ul>
                </nav>
            </div>
        </div>
    </div>

    <div class="footer-bottom">
        <div class="container1">
            <div class="row">
                <div class="col-xs-12 text-center">
                    <div class="copyRights">
                        <div class="copyRightsText">
                            <p>All content © Zilla Parishad Sangli</p>
                            <p>
                                <a href="https://walchandsangli.ac.in/" target="_blank" rel="noopener noreferrer">Walchand College of Engineering, Sangli </a> 
                                 developed and hosted this website.
                            </p>
                            <p>Last updated: <strong>November 18, 2025</strong></p>
                        </div>
                        <ul class="copyRightsLogos">
                            <li><a href="https://s3waas.gov.in/" target="_blank" rel="noopener noreferrer"><img src="https://zpsangli.maharashtra.gov.in/wp-content/themes/sdo-theme/images/S3WaaS.svg" class="swaas" alt="Secure, Scalable and Accessible Website"></img></a></li>
                            <li><a href="http://www.nic.in/" target="_blank" rel="noopener noreferrer"><img src="https://zpsangli.maharashtra.gov.in/wp-content/themes/sdo-theme/images/NIC.svg" class="nic" alt="National Informatics Centre"></img></a></li>
                            <li><a href="http://www.digitalindia.gov.in/" target="_blank" rel="noopener noreferrer"><img src="https://zpsangli.maharashtra.gov.in/wp-content/themes/sdo-theme/images/Digital-India.svg" alt="Digital India"></img></a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
</footer>


    </div>
  );
}

export default App;
