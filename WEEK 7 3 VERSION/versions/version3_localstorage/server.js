const path = require('path');
const express = require('express');
const cookieParser = require('cookie-parser');
const app = require('../../templates/server-base'); // giữ nguyên nếu có
const authRoutes = require('../../routes/authRoutes');

const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('../../config/swagger');

app.use(express.json());
app.use(cookieParser());

// API routes
app.use('/api', authRoutes);

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Serve static files (optional)
app.use(express.static(path.join(__dirname, 'public')));

const PORT = process.env.PORT || 4003;
app.listen(PORT, () => console.log(`✅ Version 3 running on port ${PORT}`));
