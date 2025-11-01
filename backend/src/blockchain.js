const crypto = require('crypto');
const Block = require('./models/Block');

class Blockchain {
  constructor(difficulty = 2) {
    this.difficulty = difficulty;
  }

  calculateHash(index, timestamp, data, previousHash, nonce) {
    const payload = `${index}${timestamp}${JSON.stringify(data)}${previousHash}${nonce}`;
    return crypto.createHash('sha256').update(payload).digest('hex');
  }

  async getLatestBlock() {
    const block = await Block.findOne({}).sort({ index: -1 }).limit(1);
    return block;
  }

  async getNextIndex() {
    const last = await this.getLatestBlock();
    return last ? last.index + 1 : 0;
  }

  mineBlock(index, data, previousHash) {
    const timestamp = new Date();
    let nonce = 0;
    let hash = '';
    const target = '0'.repeat(this.difficulty);

    while (true) {
      hash = this.calculateHash(index, timestamp, data, previousHash, nonce);
      if (hash.substring(0, this.difficulty) === target) break;
      nonce++;
    }

    return { index, timestamp, data, previousHash, hash, nonce };
  }

  async addBlock(data) {
    const previous = await this.getLatestBlock();
    const previousHash = previous ? previous.hash : '0';
    const index = await this.getNextIndex();
    const newBlock = this.mineBlock(index, data, previousHash);

    const blockDoc = new Block(newBlock);
    await blockDoc.save();
    return blockDoc;
  }

  async findBlockByFileHash(fileHash) {
    return await Block.findOne({ 'data.fileHash': fileHash });
  }
}

module.exports = Blockchain;