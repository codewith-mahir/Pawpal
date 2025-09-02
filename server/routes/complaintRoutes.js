const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { submitComplaint, getAllComplaints, updateComplaint } = require('../controllers/complaintController');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure absolute uploads path and existence to avoid ENOENT errors
const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
	fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
	destination: function(req, file, cb) { cb(null, uploadDir); },
	filename: function(req, file, cb) { cb(null, Date.now() + '-' + file.originalname); }
});
const upload = multer({ storage });

router.post('/', auth, upload.single('proof'), submitComplaint);
router.get('/', auth, getAllComplaints); // Only admin should use this (enforced in controller)
router.patch('/:id', auth, updateComplaint); // Admin-only (enforced in controller)

module.exports = router;
