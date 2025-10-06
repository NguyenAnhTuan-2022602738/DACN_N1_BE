const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';

// Optional auth: attach req.user if valid token exists, but don't block if missing
async function optionalAuthMiddleware(req, res, next) {
  let token = null;
  try {
    token = req.cookies && req.cookies.token;
  } catch (e) {
    token = null;
  }
  if (!token) {
    const auth = req.headers.authorization;
    if (auth) {
      const parts = auth.split(' ');
      if (parts.length === 2) token = parts[1];
    }
  }
  
  if (token) {
    try {
      const payload = jwt.verify(token, JWT_SECRET);
      const user = await User.findById(payload.id).select('-password');
      if (user) req.user = user;
    } catch (err) {
      // Invalid token, continue without user
    }
  }
  
  next();
}

module.exports = optionalAuthMiddleware;
