// controllers/fileController.js
const crypto = require('crypto');
const Blockchain = require('../blockchain');
const IPFSService = require('../services/ipfsService');
const EmailService = require('../services/emailService');

const ipfsService = new IPFSService();
const emailService = new EmailService();
const bc = new Blockchain(Number(process.env.DIFFICULTY || '2'));

/**
 * Helpers
 */
function fileSha256(buffer) {
  const hash = crypto.createHash('sha256');
  hash.update(buffer);
  return hash.digest('hex');
}

function isLikelyValidCid(cid) {
  if (!cid || typeof cid !== 'string') return false;
  if (cid.includes('=')) return false;
  const cidv0 = /^Qm[1-9A-HJ-NP-Za-km-z]{44,}$/; 
  const cidv1 = /^[a-z2-7]{46,}$/; 
  return cidv0.test(cid) || cidv1.test(cid);
}

/**
 * Admin: upload a document -> IPFS -> Blockchain -> send email
 */
exports.adminUpload = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file provided' });

    const fileHash = fileSha256(req.file.buffer);

    // Upload to IPFS
    const ipfsResult = await ipfsService.addFileFromBuffer(req.file.buffer, req.file.originalname);
    if (!ipfsResult || !ipfsResult.success) {
      const details = ipfsResult ? ipfsResult.error : 'No response from IPFS service';
      return res.status(500).json({ error: 'Failed to upload to IPFS', details });
    }

    const data = {
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      size: req.file.size,
      fileHash,
      ipfsHash: ipfsResult.ipfsHash,
      ipfsUrl: ipfsService.getIPFSUrl(ipfsResult.ipfsHash),
      uploadedAt: new Date()
    };

    const block = await bc.addBlock(data);

    // Attempt to send notification email (don't fail the request if email fails)
    try {
      const emailResult = await emailService.sendUploadSuccessEmail(
        req.user.email,
        req.file.originalname,
        fileHash,
        data.ipfsUrl
      );
      if (!(emailResult && emailResult.success)) {
        console.error('sendUploadSuccessEmail failed:', emailResult && emailResult.error);
      }
    } catch (err) {
      console.error('Email send error (upload):', err);
    }

    return res.json({
      success: true,
      block,
      ipfsUrl: data.ipfsUrl,
      ipfsHash: data.ipfsHash,
      message: 'File uploaded successfully to IPFS'
    });
  } catch (err) {
    console.error('adminUpload error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
};

/**
 * User: verify file by uploading the file -> compare sha256 against blockchain
 * If CID stored is invalid (legacy), attempt to re-upload to IPFS and migrate.
 */
exports.userVerify = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file provided' });

    const fileHash = fileSha256(req.file.buffer);

    const found = await bc.findBlockByFileHash(fileHash);

    const result = {
      match: !!found,
      fileHash,
      foundBlock: found || null,
      ipfsUrl: found ? found.data.ipfsUrl : null,
      ipfsHash: found ? found.data.ipfsHash : null
    };

    // If matched but CID looks invalid, migrate
    if (result.match && !isLikelyValidCid(result.ipfsHash)) {
      try {
        const uploadRes = await ipfsService.addFileFromBuffer(req.file.buffer, req.file.originalname);
        if (uploadRes && uploadRes.success) {
          found.data.ipfsHash = uploadRes.ipfsHash;
          found.data.ipfsUrl = ipfsService.getIPFSUrl(uploadRes.ipfsHash);
          if (typeof found.save === 'function') {
            await found.save();
          } else if (typeof bc.updateBlock === 'function') {
            await bc.updateBlock(found.index, found); // example, adjust as your Blockchain API expects
          }
          result.ipfsHash = found.data.ipfsHash;
          result.ipfsUrl = found.data.ipfsUrl;
        } else {
          console.error('CID migration upload failed:', uploadRes && uploadRes.error);
        }
      } catch (migrateErr) {
        console.error('CID migration error:', migrateErr);
      }
    }

    // Send verification email (best-effort)
    try {
      if (result.match) {
        const emailResult = await emailService.sendVerificationSuccessEmail(
          req.user.email,
          req.file.originalname,
          fileHash,
          result.ipfsUrl
        );
        if (!(emailResult && emailResult.success)) {
          console.error('sendVerificationSuccessEmail failed:', emailResult && emailResult.error);
        }
      } else {
        const emailResult = await emailService.sendVerificationFailureEmail(
          req.user.email,
          req.file.originalname,
          fileHash
        );
        if (!(emailResult && emailResult.success)) {
          console.error('sendVerificationFailureEmail failed:', emailResult && emailResult.error);
        }
      }
    } catch (err) {
      console.error('Email send error (verify):', err);
    }

    return res.json(result);
  } catch (err) {
    console.error('userVerify error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
};

/**
 * Download raw file from IPFS and return buffer
 */
exports.getFile = async (req, res) => {
  try {
    const { ipfsHash } = req.params;
    if (!ipfsHash) return res.status(400).json({ error: 'Missing ipfsHash' });

    const result = await ipfsService.getFile(ipfsHash);
    if (!result || !result.success) {
      return res.status(404).json({ error: 'File not found in IPFS', details: result && result.error });
    }

    // Attempt to set filename from result or fallback
    const filename = result.filename || `${ipfsHash}`;
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Type', result.contentType || 'application/octet-stream');
    return res.send(result.buffer);
  } catch (err) {
    console.error('getFile error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
};

/**
 * Get file metadata/info from IPFS service
 */
exports.getFileInfo = async (req, res) => {
  try {
    const { ipfsHash } = req.params;
    if (!ipfsHash) return res.status(400).json({ error: 'Missing ipfsHash' });

    const result = await ipfsService.getFileInfo(ipfsHash);
    if (!result || !result.success) {
      return res.status(404).json({ error: 'File not found in IPFS', details: result && result.error });
    }

    return res.json(result);
  } catch (err) {
    console.error('getFileInfo error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
};

/**
 * IPFS status check
 */
exports.ipfsStatus = async (req, res) => {
  try {
    const status = await ipfsService.isConnected();
    return res.json({ success: true, status });
  } catch (err) {
    console.error('ipfsStatus error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
};

/**
 * Email service status check
 */
exports.emailStatus = async (req, res) => {
  try {
    const status = await emailService.testConnection();
    return res.json({ success: true, status });
  } catch (err) {
    console.error('emailStatus error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
};
