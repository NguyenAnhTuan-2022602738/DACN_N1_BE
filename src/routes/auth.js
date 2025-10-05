const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');
const multer = require('multer');
const upload = multer();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);
router.post('/avatar', authMiddleware, upload.single('avatar'), authController.uploadAvatar);
router.get('/me', authMiddleware, authController.me);
router.put('/me', authMiddleware, authController.updateMe);
router.post('/change-password', authMiddleware, authController.changePassword);
router.post('/logout', authController.logout);

module.exports = router;
