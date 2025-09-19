import React, { useState } from "react";
import { adminUpload, userVerify } from "./api";
import './App.css';
// import Component from './components/Component';
import "./styles.css";

function App() {
  const [adminFile, setAdminFile] = useState(null);
  const [userFile, setUserFile] = useState(null);
  const [result, setResult] = useState(null);

  const handleAdminUpload = async () => {
    if (!adminFile) return alert("Select a file first!");
    try {
      const res = await adminUpload(adminFile);
      setResult({ type: "admin", data: res });
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    }
  };

  const handleUserVerify = async () => {
    if (!userFile) return alert("Select a file first!");
    try {
      const res = await userVerify(userFile);
      setResult({ type: "user", data: res });
    } catch (err) {
      console.error(err);
      alert("Verification failed");
    }
  };

  return (
    <div className="App">
       {/* <Component/> */}
       <h1>Welcome to DocChain</h1>
       <p>MegaProject_2025_26_28</p>
    
    <div className="container">
      
      <div className="section">
        <h3>Admin Upload</h3>
        <input type="file" onChange={(e) => setAdminFile(e.target.files[0])} />
        <button onClick={handleAdminUpload}>Upload</button>
      </div>

      <div className="section">
        <h3>User Verify</h3>
        <input type="file" onChange={(e) => setUserFile(e.target.files[0])} />
        <button onClick={handleUserVerify}>Verify</button>
      </div>

      {result && (
        <div className="result">
          <h3>Result:</h3>
          <pre>{JSON.stringify(result.data, null, 2)}</pre>
        </div>
      )}
    </div>
    </div>
  );
}

export default App;

