// templates/server-base.js
require('dotenv').config();
const express = require('express');
const helmet = require('helmet');

const app = express();

// middleware bảo mật cơ bản
app.use(helmet());
app.use(express.json());

module.exports = app;
