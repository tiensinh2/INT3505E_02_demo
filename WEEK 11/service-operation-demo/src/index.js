require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan'); // HTTP request logger
const routes = require('./routes');
const metricsMiddleware = require('./metrics');
const logger = require('./logger');

const app = express();

// Security headers (WAF basic)
app.use(helmet());

// HTTP request logging
app.use(morgan('combined', { stream: { write: msg => logger.info(msg.trim()) }}));

// Metrics
app.use(metricsMiddleware);

// Routes
app.use('/', routes);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  logger.info(`Service Operation Demo running on port ${port}`);
});
