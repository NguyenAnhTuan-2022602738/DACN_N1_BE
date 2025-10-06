const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer();
const authMiddleware = require('../middleware/auth');
const uploadController = require('../controllers/uploadController');

// POST /api/uploads/image
router.post('/image', authMiddleware, upload.single('image'), uploadController.uploadImage);

module.exports = router;
