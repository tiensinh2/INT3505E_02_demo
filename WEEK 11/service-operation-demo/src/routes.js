const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const logger = require('./logger');
const breaker = require('./circuitBreaker');

const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW),
  max: parseInt(process.env.RATE_LIMIT_MAX),
  message: 'Too many requests, please try again later.'
});

// Root endpoint
router.get('/', limiter, (req, res) => {
  logger.info('Root endpoint accessed', { ip: req.ip });
  res.send('Hello from Service Operation Demo!');
});

// Status endpoint
router.get('/status', limiter, (req, res) => {
  logger.info('Status endpoint accessed', { ip: req.ip });
  res.json({ status: 'ok', timestamp: new Date() });
});

// External API call via Circuit Breaker
router.get('/external', limiter, async (req, res) => {
  try {
    const data = await breaker.fire('https://jsonplaceholder.typicode.com/todos/1');
    res.json(data);
  } catch (err) {
    res.status(503).json({ error: 'Service unavailable' });
  }
});

module.exports = router;
