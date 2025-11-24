const promBundle = require('express-prom-bundle');

const metricsMiddleware = promBundle({ includeMethod: true, includePath: true });

module.exports = metricsMiddleware;
