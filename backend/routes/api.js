const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const Blockchain = require('../blockchain');

const UPLOAD_DIR = process.env.UPLOAD_DIR || 'uploads';
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

const bc = new Blockchain(parseInt(process.env.DIFFICULTY || '2'));

function fileSha256(filePath) {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash('sha256');
    const rs = fs.createReadStream(filePath);
    rs.on('error', reject);
    rs.on('data', chunk => hash.update(chunk));
    rs.on('end', () => resolve(hash.digest('hex')));
  });
}

// Admin upload
router.post('/admin/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file' });
    const filePath = req.file.path;
    const fileHash = await fileSha256(filePath);

    const data = {
      role: 'admin',
      originalName: req.file.originalname,
      storageName: req.file.filename,
      mimeType: req.file.mimetype,
      size: req.file.size,
      fileHash,
      uploadedAt: new Date()
    };

    const block = await bc.addBlock(data);
    return res.json({ success: true, block });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// User verify
router.post('/user/verify', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file' });
    const filePath = req.file.path;
    const fileHash = await fileSha256(filePath);

    const found = await bc.findBlockByFileHash(fileHash);
    const result = {
      match: !!found,
      fileHash,
      foundBlock: found || null
    };

    return res.json(result);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;