// backend/index.js
const path = require('path');  // 🔹 thêm dòng này
const ExpressServer = require('./expressServer');

const PORT = process.env.PORT || 3000;
const OPENAPI_YAML = path.join(__dirname, 'api', 'openapi.yaml');

const server = new ExpressServer(PORT, OPENAPI_YAML);
server.launch();
