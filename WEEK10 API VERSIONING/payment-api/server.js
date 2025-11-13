const express = require("express");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger");

const app = express();
app.use(express.json());

// Import routes
const paymentsV1 = require("./routes/v1/payments");
const paymentsV2 = require("./routes/v2/payments");

// Mount versioned routes
app.use("/api/v1/payments", paymentsV1);
app.use("/api/v2/payments", paymentsV2);

// Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  console.log(`📘 Swagger Docs at http://localhost:${PORT}/api-docs`);
});
