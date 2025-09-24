const fs = require('fs');
const stream = require('stream');
const axios = require('axios');
const pinataSDK = require('@pinata/sdk');

class IPFSService {
  constructor() {
    const apiKey = process.env.PINATA_API_KEY;
    const apiSecret = process.env.PINATA_API_SECRET;
    if (!apiKey || !apiSecret) {
      console.warn('Pinata credentials are not set. Please define PINATA_API_KEY and PINATA_API_SECRET.');
    }
    this.pinata = new pinataSDK({
      pinataApiKey: apiKey || '',
      pinataSecretApiKey: apiSecret || ''
    });
    this.gateway = process.env.PINATA_GATEWAY || process.env.IPFS_GATEWAY || 'https://gateway.pinata.cloud/ipfs/';
  }

  async addFile(filePath) {
    try {
      const fileStream = fs.createReadStream(filePath);
      const result = await this.pinata.pinFileToIPFS(fileStream);
      return {
        success: true,
        ipfsHash: result.IpfsHash,
        size: result.PinSize
      };
    } catch (error) {
      console.error('Error adding file to Pinata:', error);
      return { success: false, error: error.message };
    }
  }

  async addFileFromBuffer(buffer, fileName) {
    try {
      const readable = stream.Readable.from(buffer);
      // pinFileToIPFS can take a stream; provide metadata to retain filename
      const options = {
        pinataMetadata: { name: fileName || 'upload' }
      };
      const result = await this.pinata.pinFileToIPFS(readable, options);
      return {
        success: true,
        ipfsHash: result.IpfsHash,
        size: result.PinSize
      };
    } catch (error) {
      console.error('Error adding buffer to Pinata:', error);
      return { success: false, error: error.message };
    }
  }

  async addJson(jsonObject, name) {
    try {
      const options = { pinataMetadata: { name: name || 'data.json' } };
      const result = await this.pinata.pinJSONToIPFS(jsonObject, options);
      return {
        success: true,
        ipfsHash: result.IpfsHash
      };
    } catch (error) {
      console.error('Error adding JSON to Pinata:', error);
      return { success: false, error: error.message };
    }
  }

  async getFile(ipfsHash) {
    try {
      const url = this.getIPFSUrl(ipfsHash);
      const response = await axios.get(url, { responseType: 'arraybuffer', timeout: 20000 });
      return { success: true, buffer: Buffer.from(response.data) };
    } catch (error) {
      console.error('Error getting file from gateway:', error.message);
      return { success: false, error: error.message };
    }
  }

  async getFileInfo(ipfsHash) {
    try {
      const url = this.getIPFSUrl(ipfsHash);
      const response = await axios.head(url, { timeout: 10000 });
      const sizeHeader = response.headers['content-length'];
      return {
        success: true,
        size: sizeHeader ? Number(sizeHeader) : undefined,
        type: response.headers['content-type'],
        hash: ipfsHash
      };
    } catch (error) {
      console.error('Error getting file info from gateway:', error.message);
      return { success: false, error: error.message };
    }
  }

  getIPFSUrl(ipfsHash) {
    return `${this.gateway}${ipfsHash}`;
  }

  async isConnected() {
    try {
      const res = await this.pinata.testAuthentication();
      return { connected: true, version: res && res.authenticated ? 'pinata' : 'unknown' };
    } catch (error) {
      return { connected: false, error: error.message };
    }
  }
}

module.exports = IPFSService;
