const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';

async function authMiddleware(req, res, next) {
  // Support token in httpOnly cookie (preferred) or Authorization header
  let token = null;
  try {
    token = req.cookies && req.cookies.token;
  } catch (e) {
    token = null;
  }
  if (!token) {
    const auth = req.headers.authorization;
    if (!auth) return res.status(401).json({ message: 'No token' });
    const parts = auth.split(' ');
    if (parts.length !== 2) return res.status(401).json({ message: 'Invalid auth header' });
    token = parts[1];
  }
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(payload.id).select('-password');
    if (!user) return res.status(401).json({ message: 'Invalid token' });
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token invalid or expired' });
  }
}

module.exports = authMiddleware;
