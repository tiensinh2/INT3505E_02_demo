const CircuitBreaker = require('opossum');
const axios = require('axios');
const logger = require('./logger');

const options = {
  timeout: 3000, // 3s
  errorThresholdPercentage: 50,
  resetTimeout: 5000
};

const apiCall = async (url) => {
  const res = await axios.get(url);
  return res.data;
};

const breaker = new CircuitBreaker(apiCall, options);

breaker.fallback(() => {
  logger.warn('Circuit breaker fallback triggered');
  return { message: 'Service unavailable, fallback response' };
});

breaker.on('open', () => logger.warn('Circuit breaker OPEN'));
breaker.on('halfOpen', () => logger.info('Circuit breaker HALF-OPEN'));
breaker.on('close', () => logger.info('Circuit breaker CLOSED'));

module.exports = breaker;
