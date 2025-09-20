import React, { useState } from "react";
import { adminUpload, userVerify } from "./api";
import IPFSVisualization from "./components/IPFSVisualization";
import HashGenerator from "./components/HashGenerator";
import './App.css';
// import Component from './components/Component';
import "./styles.css";

function App() {
  const [adminFile, setAdminFile] = useState(null);
  const [userFile, setUserFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState({ admin: false, user: false });
  const [error, setError] = useState(null);
  const [showVisualization, setShowVisualization] = useState(false);
  const [showHashGenerator, setShowHashGenerator] = useState(false);

  const handleAdminUpload = async () => {
    if (!adminFile) {
      setError("Please select a file first!");
      return;
    }
    setLoading(prev => ({ ...prev, admin: true }));
    setError(null);
    try {
      const res = await adminUpload(adminFile);
      setResult({ type: "admin", data: res });
      setShowVisualization(true);
    } catch (err) {
      console.error(err);
      setError("Upload failed. Please try again.");
    } finally {
      setLoading(prev => ({ ...prev, admin: false }));
    }
  };

  const handleUserVerify = async () => {
    if (!userFile) {
      setError("Please select a file first!");
      return;
    }
    setLoading(prev => ({ ...prev, user: true }));
    setError(null);
    try {
      console.log('Verifying file:', {
        name: userFile.name,
        size: userFile.size,
        type: userFile.type,
        lastModified: userFile.lastModified
      });
      
      const res = await userVerify(userFile);
      console.log('Verification response:', res);
      
      setResult({ type: "user", data: res });
      setShowVisualization(true);
      
      if (!res.match) {
        setError(`File not found in blockchain. Hash: ${res.fileHash}`);
      }
    } catch (err) {
      console.error('Verification error:', err);
      setError(`Verification failed: ${err.message || 'Please try again.'}`);
    } finally {
      setLoading(prev => ({ ...prev, user: false }));
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
       {/* <Component/> */}
       <h1>Welcome to DocChain</h1>
       <p>MegaProject_2025_26_28</p>
       
       <div className="demo-section">
         <button 
           className="demo-toggle"
           onClick={() => setShowHashGenerator(!showHashGenerator)}
         >
           {showHashGenerator ? 'Hide Hash Generator' : 'Show Hash Generator Demo'}
         </button>
         {showHashGenerator && <HashGenerator />}
       </div>
    
    <div className="container">
      
      <div className="section">
        <h3>📤 Admin Upload</h3>
        <div className="file-input-wrapper">
          <input 
            type="file" 
            id="admin-file"
            onChange={handleAdminFileChange}
            accept=".pdf,.png,.jpg,.jpeg"
          />
          <label 
            htmlFor="admin-file" 
            className={`file-input-label ${adminFile ? 'has-file' : ''}`}
          >
            <span>📁</span>
            <span>{adminFile ? adminFile.name : 'Choose file to upload'}</span>
          </label>
        </div>
        {adminFile && (
          <div className="file-name">
            Selected: {adminFile.name} ({(adminFile.size / 1024 / 1024).toFixed(2)} MB)
          </div>
        )}
        <button 
          onClick={handleAdminUpload}
          disabled={loading.admin || !adminFile}
          className={loading.admin ? 'loading' : ''}
        >
          {loading.admin ? 'Uploading...' : 'Upload Document'}
        </button>
      </div>

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
            className={`file-input-label ${userFile ? 'has-file' : ''}`}
          >
            <span>📁</span>
            <span>{userFile ? userFile.name : 'Choose file to verify'}</span>
          </label>
        </div>
        {userFile && (
          <div className="file-name">
            Selected: {userFile.name} ({(userFile.size / 1024 / 1024).toFixed(2)} MB)
          </div>
        )}
        <button 
          onClick={handleUserVerify}
          disabled={loading.user || !userFile}
          className={loading.user ? 'loading' : ''}
        >
          {loading.user ? 'Verifying...' : 'Verify Document'}
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
              {result.type === 'admin' ? '📤 Upload Result' : '🔍 Verification Result'}
            </h3>
            <button 
              className="visualization-toggle"
              onClick={() => setShowVisualization(!showVisualization)}
            >
              {showVisualization ? 'Hide Visualization' : 'Show IPFS Visualization'}
            </button>
          </div>
           {result.type === 'admin' && result.data.ipfsUrl && (
             <div className="ipfs-info">
               {result.data.mockMode && (
                 <div className="mock-warning">
                   ⚠️ <strong>Mock Mode:</strong> IPFS is not running. This is for demonstration only.
                 </div>
               )}
               <div className="ipfs-url">
                 <strong>🌐 IPFS URL:</strong> 
                 <a href={result.data.ipfsUrl} target="_blank" rel="noopener noreferrer">
                   {result.data.ipfsUrl}
                 </a>
               </div>
               <div className="ipfs-hash">
                 <strong>🔗 IPFS Hash:</strong> {result.data.ipfsHash}
               </div>
               <div className="file-hash">
                 <strong>📄 File Hash:</strong> {result.data.block.data.fileHash}
               </div>
             </div>
           )}
          {result.type === 'user' && (
            <div className="verification-status">
              <div className={`status-indicator ${result.data.match ? 'success' : 'failed'}`}>
                {result.data.match ? '✅ VERIFIED' : '❌ NOT FOUND'}
              </div>
              <div className="file-hash">
                <strong>📄 File Hash:</strong> {result.data.fileHash}
              </div>
              {result.data.match && result.data.ipfsUrl && (
                <div className="ipfs-info">
                  <div className="ipfs-url">
                    <strong>🌐 IPFS URL:</strong> 
                    <a href={result.data.ipfsUrl} target="_blank" rel="noopener noreferrer">
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
          fileData={result.type === 'admin' ? {
            originalName: result.data.block?.data?.originalName || 'Unknown',
            size: result.data.block?.data?.size || 0,
            mimeType: result.data.block?.data?.mimeType || 'Unknown',
            fileHash: result.data.block?.data?.fileHash || result.data.fileHash,
            ipfsHash: result.data.ipfsHash,
            ipfsUrl: result.data.ipfsUrl,
            uploadedAt: result.data.block?.data?.uploadedAt,
            block: result.data.block
          } : {
            originalName: userFile?.name || 'Unknown',
            size: userFile?.size || 0,
            mimeType: userFile?.type || 'Unknown',
            fileHash: result.data.fileHash,
            ipfsHash: result.data.ipfsHash,
            ipfsUrl: result.data.ipfsUrl,
            uploadedAt: result.data.foundBlock?.data?.uploadedAt,
            block: result.data.foundBlock
          }}
          isVisible={showVisualization}
        />
      )}
    </div>
    </div>
  );
}

export default App;

