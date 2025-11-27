const express = require('express');
const bodyParser = require('body-parser');
const YAML = require('yamljs');
const swaggerUi = require('swagger-ui-express');

const swaggerDocument = YAML.load(__dirname + '/../openapi.yaml');

const app = express();
app.use(bodyParser.json());
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

let users = [];
let nextId = 1;

// List users (simple ?q= search)
app.get('/users', (req, res) => {
  const q = (req.query.q || '').toLowerCase();
  const result = users.filter(u => u.name.toLowerCase().includes(q));
  res.json(result.map(u => ({ id: u.id, name: u.name })));
});

// Create user
app.post('/users', (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: 'name required' });
  const user = { id: nextId++, name };
  users.push(user);

  // Send simplified event to local event-service (best-effort)
  const fetch = require('node-fetch');
  fetch('http://localhost:3004/events', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ type: 'USER_CREATED', data: user })
  }).catch(()=>{});

  res.status(201).json(user);
});

// Get user + HATEOAS links
app.get('/users/:id', (req, res) => {
  const id = Number(req.params.id);
  const user = users.find(u => u.id === id);
  if (!user) return res.status(404).json({ error: 'not found' });
  const host = `http://localhost:3001`;
  res.json({
    id: user.id,
    name: user.name,
    _links: {
      self: `${host}/users/${user.id}`,
      invoices: `http://localhost:3002/?userId=${user.id}`, // billing query demo
      trigger_webhook: `http://localhost:3003/webhook/trigger` // manual trigger endpoint
    }
  });
});

// Update
app.patch('/users/:id', (req, res) => {
  const id = Number(req.params.id);
  const user = users.find(u => u.id === id);
  if (!user) return res.status(404).json({ error: 'not found' });
  if (req.body.name) user.name = req.body.name;
  res.json(user);
});

// Delete
app.delete('/users/:id', (req, res) => {
  const id = Number(req.params.id);
  users = users.filter(u => u.id !== id);
  res.status(204).send();
});

app.listen(3001, () => console.log('User service running on http://localhost:3001 (swagger: /swagger)'));
