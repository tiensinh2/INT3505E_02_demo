const express = require("express");
const router = express.Router();
const transactions = require("../../data/transactions");

// Supported currencies & payment methods
const supportedCurrencies = ["USD", "VND", "EUR", "BTC"];
const supportedMethods = ["credit_card", "paypal", "crypto", "bank_transfer"];
const fees = { credit_card: 0.02, paypal: 0.03, crypto: 0.005, bank_transfer: 0.01 };

/**
 * @openapi
 * /payments:
 *   post:
 *     summary: Create a new payment
 *     tags: [Payments v2]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *                 example: 300
 *               currency:
 *                 type: string
 *                 example: USD
 *               method:
 *                 type: string
 *                 example: paypal
 *               metadata:
 *                 type: object
 *                 example: { order_id: "ORD001", note: "VIP" }
 *     responses:
 *       200:
 *         description: Payment processed successfully
 */
router.post("/", (req, res) => {
  const { amount, currency, method, metadata } = req.body;
  const userId = req.header("Authorization") || "guest";

  if (!amount || !currency || !method) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  if (!supportedCurrencies.includes(currency)) {
    return res.status(400).json({ error: "Unsupported currency" });
  }
  if (!supportedMethods.includes(method)) {
    return res.status(400).json({ error: "Unsupported payment method" });
  }

  const fee = amount * fees[method];
  const total = amount + fee;

  const transaction = {
    id: `tx_${Date.now()}`,
    version: "v2",
    status: "pending", // default
    amount,
    fee,
    total,
    currency,
    method,
    userId,
    metadata,
    timestamp: new Date().toISOString()
  };

  transactions.push(transaction);
  console.log(`Webhook: Payment processed for ${transaction.id}`);
  transaction.status = "success"; // mock success
  res.json(transaction);
});

/**
 * @openapi
 * /payments/history:
 *   get:
 *     summary: List all transactions (optional filter by userId)
 *     tags: [Payments v2]
 *     parameters:
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         description: Filter transactions by userId
 *     responses:
 *       200:
 *         description: Transaction history
 */
router.get("/history", (req, res) => {
  const { userId } = req.query;
  let result = transactions;
  if (userId) result = transactions.filter(t => t.userId === userId);
  res.json(result);
});

/**
 * @openapi
 * /payments/{id}:
 *   get:
 *     summary: Get a payment by ID
 *     tags: [Payments v2]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Transaction ID
 *     responses:
 *       200:
 *         description: Payment details
 *       404:
 *         description: Payment not found
 */
router.get("/:id", (req, res) => {
  const tx = transactions.find(t => t.id === req.params.id);
  if (!tx) return res.status(404).json({ error: "Transaction not found" });
  res.json(tx);
});

/**
 * @openapi
 * /payments/{id}:
 *   patch:
 *     summary: Update a payment (e.g., status, metadata)
 *     tags: [Payments v2]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Transaction ID
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 example: "canceled"
 *               metadata:
 *                 type: object
 *                 example: { note: "Changed note" }
 *     responses:
 *       200:
 *         description: Updated payment
 *       404:
 *         description: Transaction not found
 */
router.patch("/:id", (req, res) => {
  const tx = transactions.find(t => t.id === req.params.id);
  if (!tx) return res.status(404).json({ error: "Transaction not found" });

  const { status, metadata } = req.body;
  if (status) tx.status = status;
  if (metadata) tx.metadata = { ...tx.metadata, ...metadata };
  res.json(tx);
});

/**
 * @openapi
 * /payments/{id}:
 *   delete:
 *     summary: Cancel a payment (soft delete)
 *     tags: [Payments v2]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Transaction ID
 *     responses:
 *       200:
 *         description: Payment canceled
 *       404:
 *         description: Transaction not found
 */
router.delete("/:id", (req, res) => {
  const tx = transactions.find(t => t.id === req.params.id);
  if (!tx) return res.status(404).json({ error: "Transaction not found" });
  tx.status = "canceled";
  res.json({ message: `Transaction ${tx.id} canceled`, transaction: tx });
});

/**
 * @openapi
 * /payments/stats:
 *   get:
 *     summary: Get aggregated stats
 *     tags: [Payments v2]
 *     responses:
 *       200:
 *         description: Statistics of payments
 */
router.get("/stats", (req, res) => {
  const stats = supportedMethods.map(method => {
    const filtered = transactions.filter(t => t.method === method);
    const totalAmount = filtered.reduce((acc, t) => acc + t.amount, 0);
    const totalFee = filtered.reduce((acc, t) => acc + t.fee, 0);
    return { method, count: filtered.length, totalAmount, totalFee };
  });
  res.json(stats);
});

module.exports = router;
