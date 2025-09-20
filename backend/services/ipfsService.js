const fs = require('fs');
const path = require('path');

class IPFSService {
  constructor() {
    this.ipfs = null;
    this.initializeIPFS();
  }

  async initializeIPFS() {
    try {
      // Dynamic import for better compatibility
      const { create } = await import('ipfs-http-client');
      this.ipfs = create({
        host: process.env.IPFS_HOST || 'localhost',
        port: process.env.IPFS_PORT || 5001,
        protocol: process.env.IPFS_PROTOCOL || 'http'
      });
      console.log('IPFS client initialized successfully');
    } catch (error) {
      console.error('Failed to initialize IPFS client:', error);
      // Fallback: try require syntax
      try {
        const ipfsClient = require('ipfs-http-client');
        this.ipfs = ipfsClient.create({
          host: process.env.IPFS_HOST || 'localhost',
          port: process.env.IPFS_PORT || 5001,
          protocol: process.env.IPFS_PROTOCOL || 'http'
        });
        console.log('IPFS client initialized with fallback method');
      } catch (fallbackError) {
        console.error('Both IPFS initialization methods failed:', fallbackError);
      }
    }
  }

  async addFile(filePath) {
    try {
      if (!this.ipfs) {
        await this.initializeIPFS();
        if (!this.ipfs) {
          throw new Error('IPFS client not initialized');
        }
      }

      // Read file from local storage
      const fileBuffer = fs.readFileSync(filePath);
      
      // Add file to IPFS
      const result = await this.ipfs.add(fileBuffer, {
        pin: true // Pin the file to prevent garbage collection
      });

      console.log(`File added to IPFS with hash: ${result.path}`);
      return {
        success: true,
        ipfsHash: result.path,
        size: result.size
      };
    } catch (error) {
      console.error('Error adding file to IPFS:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async addFileFromBuffer(buffer, fileName) {
    try {
      if (!this.ipfs) {
        await this.initializeIPFS();
        if (!this.ipfs) {
          throw new Error('IPFS client not initialized');
        }
      }

      // Add file buffer directly to IPFS
      const result = await this.ipfs.add(buffer, {
        pin: true,
        wrapWithDirectory: false
      });

      console.log(`File added to IPFS with hash: ${result.path}`);
      return {
        success: true,
        ipfsHash: result.path,
        size: result.size
      };
    } catch (error) {
      console.error('Error adding file to IPFS:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async getFile(ipfsHash) {
    try {
      if (!this.ipfs) {
        await this.initializeIPFS();
        if (!this.ipfs) {
          throw new Error('IPFS client not initialized');
        }
      }

      // Get file from IPFS
      const chunks = [];
      for await (const chunk of this.ipfs.cat(ipfsHash)) {
        chunks.push(chunk);
      }
      
      const fileBuffer = Buffer.concat(chunks);
      return {
        success: true,
        buffer: fileBuffer
      };
    } catch (error) {
      console.error('Error getting file from IPFS:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async getFileInfo(ipfsHash) {
    try {
      if (!this.ipfs) {
        await this.initializeIPFS();
        if (!this.ipfs) {
          throw new Error('IPFS client not initialized');
        }
      }

      // Get file stats from IPFS
      const stats = await this.ipfs.files.stat(`/ipfs/${ipfsHash}`);
      return {
        success: true,
        size: stats.size,
        type: stats.type,
        hash: ipfsHash
      };
    } catch (error) {
      console.error('Error getting file info from IPFS:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  getIPFSUrl(ipfsHash) {
    // Return the IPFS URL for accessing the file
    const gateway = process.env.IPFS_GATEWAY || 'https://ipfs.io/ipfs/';
    return `${gateway}${ipfsHash}`;
  }

  async isConnected() {
    try {
      if (!this.ipfs) {
        await this.initializeIPFS();
        if (!this.ipfs) {
          return {
            connected: false,
            error: 'IPFS client not initialized'
          };
        }
      }

      const version = await this.ipfs.version();
      return {
        connected: true,
        version: version.version
      };
    } catch (error) {
      return {
        connected: false,
        error: error.message
      };
    }
  }
}

module.exports = IPFSService;
