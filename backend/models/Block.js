const mongoose = require('mongoose');

const BlockSchema = new mongoose.Schema({
  index: { type: Number, required: true },
  timestamp: { type: Date, required: true },
  data: { type: Object, required: true },
  previousHash: { type: String, required: true },
  hash: { type: String, required: true },
  nonce: { type: Number, required: true }
});

module.exports = mongoose.model('Block', BlockSchema);