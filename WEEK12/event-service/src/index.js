const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());

let events = []; // latest events

// Receive events (POST)
app.post('/events', (req, res) => {
  const ev = {
    id: Date.now(),
    type: req.body.type || 'UNKNOWN',
    data: req.body.data || null,
    ts: new Date().toISOString()
  };
  events.unshift(ev);
  if (events.length > 100) events.pop();
  // push to SSE clients
  sseClients.forEach(s => s.res.write(`data: ${JSON.stringify(ev)}\n\n`));
  console.log('Event received:', ev.type, ev.data);
  res.json({ ok: true });
});

// View events (GET)
app.get('/events', (req, res) => {
  res.json(events);
});

// Simple SSE endpoint for realtime demo
const sseClients = [];
app.get('/events/stream', (req, res) => {
  res.set({
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive'
  });
  res.flushHeaders();
  res.write('retry: 10000\n\n');
  const client = { id: Date.now(), res };
  sseClients.push(client);
  req.on('close', () => {
    const idx = sseClients.indexOf(client);
    if (idx >= 0) sseClients.splice(idx, 1);
  });
});

app.listen(3004, () => console.log('Event service listening on http://localhost:3004'));
