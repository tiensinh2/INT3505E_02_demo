const jwt = require('jsonwebtoken');
const { secret } = require('../config/jwt');

module.exports = function (req, res, next) {
  let token;

  if (req.headers['authorization']) {
    token = req.headers['authorization'].split(' ')[1];
  }

  if (!token) return res.status(401).json({ error: 'Token missing' });

  try {
    const decoded = jwt.verify(token, secret);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(403).json({ error: 'Invalid or expired token' });
  }
};
