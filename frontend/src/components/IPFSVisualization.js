import React, { useState, useEffect } from 'react';
import './IPFSVisualization.css';

const IPFSVisualization = ({ fileData, isVisible }) => {
  const [animationStep, setAnimationStep] = useState(0);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    if (isVisible && fileData) {
      // Reset animation when new data comes in
      setAnimationStep(0);
      const timer = setTimeout(() => setAnimationStep(1), 500);
      const timer2 = setTimeout(() => setAnimationStep(2), 1500);
      const timer3 = setTimeout(() => setAnimationStep(3), 2500);
      const timer4 = setTimeout(() => setAnimationStep(4), 3500);
      
      return () => {
        clearTimeout(timer);
        clearTimeout(timer2);
        clearTimeout(timer3);
        clearTimeout(timer4);
      };
    }
  }, [fileData, isVisible]);

  if (!isVisible || !fileData) return null;

  // const generateFileHash = (file) => {
  //   // Simulate hash generation process
  //   const crypto = window.crypto || window.msCrypto;
  //   if (crypto && crypto.subtle) {
  //     return crypto.subtle.digest('SHA-256', file)
  //       .then(hashBuffer => {
  //         const hashArray = Array.from(new Uint8Array(hashBuffer));
  //         return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  //       });
  //   }
  //   // Fallback for browsers without crypto.subtle
  //   return Promise.resolve('a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456');
  // };

  const truncateHash = (hash) => {
    return hash ? `${hash.substring(0, 8)}...${hash.substring(hash.length - 8)}` : '';
  };

  return (
    <div className="ipfs-visualization">
      <div className="visualization-header">
        <h3>🌐 IPFS Data Storage Visualization</h3>
        <button 
          className="toggle-details"
          onClick={() => setShowDetails(!showDetails)}
        >
          {showDetails ? 'Hide Details' : 'Show Details'}
        </button>
      </div>

      <div className="visualization-container">
        {/* Step 1: File Upload */}
        <div className={`step step-1 ${animationStep >= 1 ? 'active' : ''}`}>
          <div className="step-icon">📁</div>
          <div className="step-content">
            <h4>1. File Upload</h4>
            <div className="file-info">
              <div className="file-name">{fileData.originalName}</div>
              <div className="file-size">{(fileData.size / 1024 / 1024).toFixed(2)} MB</div>
              <div className="file-type">{fileData.mimeType}</div>
            </div>
          </div>
        </div>

        {/* Arrow */}
        <div className={`arrow ${animationStep >= 1 ? 'active' : ''}`}>↓</div>

        {/* Step 2: Hash Generation */}
        <div className={`step step-2 ${animationStep >= 2 ? 'active' : ''}`}>
          <div className="step-icon">🔐</div>
          <div className="step-content">
            <h4>2. Hash Generation</h4>
            <div className="hash-process">
              <div className="hash-input">File Content</div>
              <div className="hash-arrow">→</div>
              <div className="hash-algorithm">SHA-256</div>
              <div className="hash-arrow">→</div>
              <div className="hash-output">
                {fileData.fileHash ? truncateHash(fileData.fileHash) : 'Generating...'}
              </div>
            </div>
            {showDetails && (
              <div className="hash-details">
                <div className="hash-explanation">
                  The file content is processed through SHA-256 algorithm to create a unique fingerprint
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Arrow */}
        <div className={`arrow ${animationStep >= 2 ? 'active' : ''}`}>↓</div>

        {/* Step 3: IPFS Storage */}
        <div className={`step step-3 ${animationStep >= 3 ? 'active' : ''}`}>
          <div className="step-icon">🌐</div>
          <div className="step-content">
            <h4>3. IPFS Storage</h4>
            <div className="ipfs-process">
              <div className="ipfs-node">
                <div className="node-icon">🖥️</div>
                <div className="node-label">IPFS Node</div>
              </div>
              <div className="ipfs-arrow">→</div>
              <div className="ipfs-hash">
                <div className="hash-label">IPFS Hash</div>
                <div className="hash-value">
                  {fileData.ipfsHash ? truncateHash(fileData.ipfsHash) : 'Uploading...'}
                </div>
              </div>
            </div>
            {showDetails && (
              <div className="ipfs-details">
                <div className="ipfs-url">
                  <strong>IPFS URL:</strong> 
                  <a href={fileData.ipfsUrl} target="_blank" rel="noopener noreferrer">
                    {fileData.ipfsUrl}
                  </a>
                </div>
                <div className="ipfs-explanation">
                  File is stored in IPFS network and gets a unique content address (CID)
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Arrow */}
        <div className={`arrow ${animationStep >= 3 ? 'active' : ''}`}>↓</div>

        {/* Step 4: Blockchain Storage */}
        <div className={`step step-4 ${animationStep >= 4 ? 'active' : ''}`}>
          <div className="step-icon">⛓️</div>
          <div className="step-content">
            <h4>4. Blockchain Storage</h4>
            <div className="blockchain-process">
              <div className="block">
                <div className="block-header">Block #{fileData.block?.index || 'N/A'}</div>
                <div className="block-data">
                  <div className="data-item">
                    <span className="data-label">File Hash:</span>
                    <span className="data-value">{truncateHash(fileData.fileHash)}</span>
                  </div>
                  <div className="data-item">
                    <span className="data-label">IPFS Hash:</span>
                    <span className="data-value">{truncateHash(fileData.ipfsHash)}</span>
                  </div>
                  <div className="data-item">
                    <span className="data-label">Timestamp:</span>
                    <span className="data-value">
                      {fileData.uploadedAt ? new Date(fileData.uploadedAt).toLocaleString() : 'N/A'}
                    </span>
                  </div>
                </div>
                <div className="block-hash">
                  <span className="hash-label">Block Hash:</span>
                  <span className="hash-value">
                    {fileData.block?.hash ? truncateHash(fileData.block.hash) : 'Mining...'}
                  </span>
                </div>
              </div>
            </div>
            {showDetails && (
              <div className="blockchain-details">
                <div className="block-explanation">
                  File metadata and IPFS reference are stored immutably in the blockchain
                </div>
                <div className="verification-process">
                  <strong>Verification Process:</strong>
                  <ol>
                    <li>User uploads file for verification</li>
                    <li>System generates SHA-256 hash of uploaded file</li>
                    <li>Hash is compared with blockchain records</li>
                    <li>If match found, file is verified as authentic</li>
                  </ol>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Network Visualization */}
      <div className="network-visualization">
        <h4>🌍 IPFS Network</h4>
        <div className="network-nodes">
          <div className="node local-node">
            <div className="node-icon">🖥️</div>
            <div className="node-label">Your Node</div>
          </div>
          <div className="node-connections">
            <div className="connection"></div>
            <div className="connection"></div>
            <div className="connection"></div>
          </div>
          <div className="node remote-node">
            <div className="node-icon">🌐</div>
            <div className="node-label">IPFS Network</div>
          </div>
        </div>
        <div className="network-explanation">
          Your file is distributed across multiple IPFS nodes worldwide for redundancy and accessibility
        </div>
      </div>
    </div>
  );
};

export default IPFSVisualization;
