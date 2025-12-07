// routes/files.js
const express = require('express');
const multer = require('multer');
const { auth, requireRole } = require('../middleware/auth');
const fileController = require('../controllers/fileController');

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Admin upload (protected + admin role)
router.post('/admin/upload', auth, requireRole('admin'), upload.single('file'), fileController.adminUpload);
 
// User verify (protected)
router.post('/user/verify', auth, upload.single('file'), fileController.userVerify);

// Public file download (no auth)
router.get('/file/:ipfsHash', fileController.getFile);

// Public file info
router.get('/file-info/:ipfsHash', fileController.getFileInfo);

// IPFS and Email status (optional, can be protected if you prefer)
router.get('/ipfs/status', fileController.ipfsStatus);
router.get('/email/status', fileController.emailStatus);

module.exports = router;
