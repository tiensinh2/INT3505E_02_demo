const jwt = require('jsonwebtoken');
const { secret, expiresIn } = require('../config/jwt');

const DEMO_USER = { username: 'admin', password: '123' };

exports.login = (req, res) => {
  const { username, password } = req.body;
  if (username === DEMO_USER.username && password === DEMO_USER.password) {
    const token = jwt.sign({ username }, secret, { expiresIn });
    return res.json({ token });
  }
  return res.status(401).json({ error: 'Invalid credentials' });
};

exports.getProtected = (req, res) => {
  res.json({ message: `Welcome ${req.user.username}, you are authenticated!` });
};
