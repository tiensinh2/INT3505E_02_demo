const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Payment API Demo (Versioning)",
      version: "2.0.0",
      description: "Demo Payment API with v1 deprecated and v2 advanced features",
    },
    servers: [
      { url: "http://localhost:3000/api/v1", description: "Version 1 (deprecated)" },
      { url: "http://localhost:3000/api/v2", description: "Version 2 (current)" }
    ],
  },
  apis: ["./routes/**/*.js"],
};

module.exports = swaggerJsdoc(options);
