const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const User = require('../models/User');

// middleware to ensure admin
const ensureAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
  next();
};

// PATCH /api/admin/user/:id/status { accountStatus }
router.patch('/user/:id/status', authMiddleware, ensureAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { accountStatus } = req.body;
    if (!['active','disabled','pending'].includes(accountStatus)) return res.status(400).json({ message: 'Invalid status' });
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.accountStatus = accountStatus;
    await user.save();
    const safe = user.toObject(); delete safe.password;
    res.json({ user: safe });
  } catch (e) {
    console.error('Admin update status error', e);
    res.status(500).json({ message: 'Failed' });
  }
});

module.exports = router;
