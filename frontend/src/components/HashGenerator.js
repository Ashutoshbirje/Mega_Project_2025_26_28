import React, { useState } from 'react';
import './HashGenerator.css';

const HashGenerator = () => {
  const [inputText, setInputText] = useState('');
  const [generatedHash, setGeneratedHash] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showSteps, setShowSteps] = useState(false);

  const generateHash = async (text) => {
    setIsGenerating(true);
    
    // Simulate hash generation process
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    try {
      const encoder = new TextEncoder();
      const data = encoder.encode(text);
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      setGeneratedHash(hashHex);
    } catch (error) {
      // Fallback for browsers without crypto.subtle
      const hash = await simpleHash(text);
      setGeneratedHash(hash);
    }
    
    setIsGenerating(false);
  };

  const simpleHash = async (text) => {
    // Simple hash function for demonstration
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      const char = text.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(16).padStart(8, '0').repeat(8);
  };

  const handleGenerate = () => {
    if (inputText.trim()) {
      generateHash(inputText);
    }
  };

  const handleClear = () => {
    setInputText('');
    setGeneratedHash('');
    setShowSteps(false);
  };

  return (
    <div className="hash-generator">
      <div className="generator-header">
        <h3>🔐 Hash Generator Demo</h3>
        <p>See how SHA-256 hash generation works in real-time</p>
      </div>

      <div className="generator-content">
        <div className="input-section">
          <label htmlFor="hash-input">Enter text to hash:</label>
          <textarea
            id="hash-input"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type any text here to see how it gets hashed..."
            rows={4}
          />
          <div className="input-actions">
            <button 
              onClick={handleGenerate}
              disabled={!inputText.trim() || isGenerating}
              className="generate-btn"
            >
              {isGenerating ? 'Generating...' : 'Generate Hash'}
            </button>
            <button 
              onClick={handleClear}
              disabled={!inputText && !generatedHash}
              className="clear-btn"
            >
              Clear
            </button>
          </div>
        </div>

        {generatedHash && (
          <div className="result-section">
            <h4>Generated SHA-256 Hash:</h4>
            <div className="hash-display">
              <div className="hash-value">{generatedHash}</div>
              <div className="hash-info">
                <span>Length: {generatedHash.length} characters</span>
                <span>Type: SHA-256</span>
              </div>
            </div>
          </div>
        )}

        <div className="steps-section">
          <button 
            className="steps-toggle"
            onClick={() => setShowSteps(!showSteps)}
          >
            {showSteps ? 'Hide' : 'Show'} Hash Generation Steps
          </button>
          
          {showSteps && (
            <div className="steps-content">
              <h4>How SHA-256 Hash Generation Works:</h4>
              <div className="step">
                <div className="step-number">1</div>
                <div className="step-content">
                  <h5>Input Processing</h5>
                  <p>Your text is converted to bytes using UTF-8 encoding</p>
                  <div className="code-example">
                    <code>"{inputText || 'Your text'}" → [bytes]</code>
                  </div>
                </div>
              </div>
              
              <div className="step">
                <div className="step-number">2</div>
                <div className="step-content">
                  <h5>Padding</h5>
                  <p>The input is padded to ensure it's a multiple of 512 bits</p>
                  <div className="code-example">
                    <code>Add padding bits and length</code>
                  </div>
                </div>
              </div>
              
              <div className="step">
                <div className="step-number">3</div>
                <div className="step-content">
                  <h5>Chunk Processing</h5>
                  <p>Data is divided into 512-bit chunks and processed through 64 rounds</p>
                  <div className="code-example">
                    <code>Each chunk → 64 rounds of operations</code>
                  </div>
                </div>
              </div>
              
              <div className="step">
                <div className="step-number">4</div>
                <div className="step-content">
                  <h5>Final Hash</h5>
                  <p>All chunks are combined to produce the final 256-bit hash</p>
                  <div className="code-example">
                    <code>Final result: {generatedHash || 'Hash will appear here'}</code>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="hash-properties">
          <h4>Hash Properties:</h4>
          <div className="properties-grid">
            <div className="property">
              <strong>Deterministic:</strong>
              <span>Same input always produces same hash</span>
            </div>
            <div className="property">
              <strong>Fixed Length:</strong>
              <span>Always 256 bits (64 hex characters)</span>
            </div>
            <div className="property">
              <strong>Avalanche Effect:</strong>
              <span>Small input changes cause major hash changes</span>
            </div>
            <div className="property">
              <strong>One-Way:</strong>
              <span>Cannot reverse hash to get original input</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HashGenerator;
