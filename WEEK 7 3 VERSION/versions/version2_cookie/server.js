const app = require('../../templates/server-base');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const { secret, expiresIn } = require('../../config/jwt');
const authMiddleware = require('../../middleware/authMiddleware');

app.use(cookieParser());

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'admin' && password === '123') {
    const token = jwt.sign({ username }, secret, { expiresIn });
    res.cookie('token', token, {
      httpOnly: true,
      secure: false, // đổi true nếu dùng HTTPS
      sameSite: 'strict',
    });
    return res.json({ message: 'Login success (cookie set)' });
  }
  res.status(401).json({ error: 'Invalid credentials' });
});

app.get('/api/protected', authMiddleware, (req, res) => {
  res.json({ message: `Hello ${req.user.username}, cookie verified!` });
});

const PORT = process.env.PORT || 4002;
app.listen(PORT, () => console.log(`✅ Version 2 (Cookie) running on port ${PORT}`));
