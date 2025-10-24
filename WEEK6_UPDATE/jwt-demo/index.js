require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const fs = require('fs');

const app = express();
app.use(bodyParser.json());

// Load Swagger
const swaggerDocument = YAML.load('./swagger.yaml');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Mock data
const users = [{ username: "admin", password: "123456" }];
const books = JSON.parse(fs.readFileSync('./books.json', 'utf8'));

// AES encrypt/decrypt
const AES_KEY = process.env.AES_KEY;
const AES_IV = process.env.AES_IV;

function encryptPayload(payload) {
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(AES_KEY), Buffer.from(AES_IV));
  let encrypted = cipher.update(JSON.stringify(payload), 'utf8', 'base64');
  encrypted += cipher.final('base64');
  return encrypted;
}

function decryptPayload(encrypted) {
  const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(AES_KEY), Buffer.from(AES_IV));
  let decrypted = decipher.update(encrypted, 'base64', 'utf8');
  decrypted += decipher.final('utf8');
  return JSON.parse(decrypted);
}

// ========== AUTH ==========
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);
  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  const encryptedPayload = encryptPayload({ username });
  const token = jwt.sign({ data: encryptedPayload }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.json({ token });
});

// Middleware
function authenticate(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ message: "Missing token" });

  const token = authHeader.split(' ')[1];
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: "Invalid token" });
    try {
      req.user = decryptPayload(decoded.data);
    } catch (e) {
      return res.status(403).json({ message: "Token decryption failed" });
    }
    next();
  });
}

// ========== ROUTES ==========
app.get('/', (req, res) => {
  res.send('JWT + Encrypted Payload Library API is running!');
});

app.get('/books', (req, res) => {
  res.json(books);
});

app.get('/books/:id', (req, res) => {
  const book = books.find(b => b.id === parseInt(req.params.id));
  if (!book) return res.status(404).json({ message: "Book not found" });
  res.json(book);
});

// Protected route
app.get('/profile', authenticate, (req, res) => {
  res.json({ message: `Hello ${req.user.username}`, data: "Private content" });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => console.log(`✅ Server running on http://localhost:${PORT}`));
//http://localhost:3000/api-docs