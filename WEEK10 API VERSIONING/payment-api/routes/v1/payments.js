const express = require("express");
const router = express.Router();

/**
 * @openapi
 * /payments:
 *   post:
 *     summary: Process payment (v1 - deprecated)
 *     description: Legacy API, use v2 instead
 *     tags: [Payments v1]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *                 example: 100
 *               card_number:
 *                 type: string
 *                 example: "4111111111111111"
 *     responses:
 *       200:
 *         description: Payment processed successfully
 */

router.use((req, res, next) => {
  res.setHeader(
    "Warning",
    '299 - "API v1 is deprecated. Please migrate to /api/v2/payments"'
  );
  next();
});

router.post("/", (req, res) => {
  const { amount, card_number } = req.body;
  if (!amount || !card_number) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  res.json({
    version: "v1",
    status: "success",
    message: "Payment processed via credit card",
    transaction_id: "tx_abc123"
  });
});

module.exports = router;
