const express = require('express');
const bodyParser = require('body-parser');
const YAML = require('yamljs');
const swaggerUi = require('swagger-ui-express');
const axios = require('axios');
const crypto = require('crypto');

const swaggerDocument = YAML.load(__dirname + '/../openapi.yaml');
const app = express();
app.use(bodyParser.json());
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Shared secret for HMAC signing (demo only)
const SHARED_SECRET = 'demo_shared_secret_very_insecure';

app.post('/webhook/trigger', async (req, res) => {
  const { event, targetUrl, data } = req.body;
  if (!event || !targetUrl) return res.status(400).json({ error: 'event and targetUrl required' });

  const payload = { event, data };
  const bodyString = JSON.stringify(payload);
  const signature = 'sha256=' + crypto.createHmac('sha256', SHARED_SECRET).update(bodyString).digest('hex');

  // Send to target URL
  try {
    await axios.post(targetUrl, payload, {
      headers: {
        'Content-Type': 'application/json',
        'x-hub-signature': signature
      },
      timeout: 5000
    });
  } catch (err) {
    // we still continue; log error
    console.error('Failed to deliver webhook:', err.message);
  }

  // Publish to local event-service for demo
  try {
    await axios.post('http://localhost:3004/events', { type: event, data }, { timeout: 2000 });
  } catch (err) {}

  res.json({ status: 'sent', signature });
});

app.listen(3003, () => console.log('Webhook service running on http://localhost:3003 (swagger: /swagger)'));
