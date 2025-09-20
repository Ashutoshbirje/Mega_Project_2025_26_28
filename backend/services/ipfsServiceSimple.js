const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

class IPFSServiceSimple {
  constructor() {
    this.ipfsHost = process.env.IPFS_HOST || 'localhost';
    this.ipfsPort = process.env.IPFS_PORT || 5001;
    this.ipfsProtocol = process.env.IPFS_PROTOCOL || 'http';
    this.gateway = process.env.IPFS_GATEWAY || 'https://ipfs.io/ipfs/';
  }

  async addFileFromBuffer(buffer, fileName) {
    try {
      // Check if IPFS is running first
      const isConnected = await this.isConnected();
      if (!isConnected.connected) {
        console.log('IPFS not running, using mock mode');
        return this.mockIPFSAdd(buffer, fileName);
      }

      const formData = new FormData();
      formData.append('file', new Blob([buffer]), fileName);
      
      const response = await fetch(`http://${this.ipfsHost}:${this.ipfsPort}/api/v0/add?pin=true`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log(`File added to IPFS with hash: ${result.Hash}`);
      
      return {
        success: true,
        ipfsHash: result.Hash,
        size: result.Size
      };
    } catch (error) {
      console.error('Error adding file to IPFS:', error);
      console.log('Falling back to mock IPFS mode');
      return this.mockIPFSAdd(buffer, fileName);
    }
  }

  mockIPFSAdd(buffer, fileName) {
    // Generate a mock IPFS hash for demonstration
    const mockHash = 'Qm' + Buffer.from(fileName + Date.now()).toString('base64').substring(0, 44);
    const mockUrl = `${this.gateway}${mockHash}`;
    
    console.log(`Mock IPFS add - File: ${fileName}, Hash: ${mockHash}`);
    
    return {
      success: true,
      ipfsHash: mockHash,
      size: buffer.length,
      mockMode: true
    };
  }

  async getFile(ipfsHash) {
    try {
      const isConnected = await this.isConnected();
      if (!isConnected.connected) {
        return this.mockIPFSGet(ipfsHash);
      }

      const response = await fetch(`http://${this.ipfsHost}:${this.ipfsPort}/api/v0/cat?arg=${ipfsHash}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const buffer = await response.arrayBuffer();
      return {
        success: true,
        buffer: Buffer.from(buffer)
      };
    } catch (error) {
      console.error('Error getting file from IPFS:', error);
      return this.mockIPFSGet(ipfsHash);
    }
  }

  mockIPFSGet(ipfsHash) {
    console.log(`Mock IPFS get - Hash: ${ipfsHash}`);
    return {
      success: true,
      buffer: Buffer.from('Mock file content - IPFS not running'),
      mockMode: true
    };
  }

  async getFileInfo(ipfsHash) {
    try {
      const isConnected = await this.isConnected();
      if (!isConnected.connected) {
        return this.mockIPFSInfo(ipfsHash);
      }

      const response = await fetch(`http://${this.ipfsHost}:${this.ipfsPort}/api/v0/object/stat?arg=${ipfsHash}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const stats = await response.json();
      return {
        success: true,
        size: stats.DataSize,
        type: stats.Type,
        hash: ipfsHash
      };
    } catch (error) {
      console.error('Error getting file info from IPFS:', error);
      return this.mockIPFSInfo(ipfsHash);
    }
  }

  mockIPFSInfo(ipfsHash) {
    console.log(`Mock IPFS info - Hash: ${ipfsHash}`);
    return {
      success: true,
      size: 1024,
      type: 'file',
      hash: ipfsHash,
      mockMode: true
    };
  }

  getIPFSUrl(ipfsHash) {
    return `${this.gateway}${ipfsHash}`;
  }

  async isConnected() {
    try {
      const response = await fetch(`http://${this.ipfsHost}:${this.ipfsPort}/api/v0/version`);
      
      if (!response.ok) {
        return {
          connected: false,
          error: `HTTP error! status: ${response.status}`
        };
      }

      const version = await response.json();
      return {
        connected: true,
        version: version.Version
      };
    } catch (error) {
      return {
        connected: false,
        error: error.message
      };
    }
  }
}

module.exports = IPFSServiceSimple;
