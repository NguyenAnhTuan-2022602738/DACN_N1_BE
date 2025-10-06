module.exports = function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: 'Not authenticated' });
    const role = req.user.role || 'customer';
    if (allowedRoles.length === 0) return next();
    if (allowedRoles.includes(role)) return next();
    return res.status(403).json({ message: 'Forbidden' });
  };
};
