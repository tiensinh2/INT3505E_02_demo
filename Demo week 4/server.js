// server.js
import express from "express";
import session from "express-session";
import bodyParser from "body-parser";

const app = express();

// ------------------------------
// Body parser phải trước route
// ------------------------------
app.use(bodyParser.json());

// ------------------------------
// Cấu hình session
// ------------------------------
app.use(
  session({
    secret: "mysecret",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // chạy local HTTP
  })
);

// ------------------------------
// Route mặc định
// ------------------------------
app.get("/", (req, res) => {
  res.send("🚀 Server is running! Use API endpoints to test.");
});

// ------------------------------
// API session-based
// ------------------------------
app.post("/session/cart/add", (req, res) => {
  console.log("Received body:", req.body); // debug

  if (!req.body || req.body.productId === undefined || req.body.quantity === undefined) {
    return res.status(400).json({ error: "Missing productId or quantity" });
  }

  if (!req.session.cart) req.session.cart = [];

  req.session.cart.push({
    productId: req.body.productId,
    quantity: req.body.quantity,
  });

  res.json({ message: "Added to cart", cart: req.session.cart });
});

app.get("/session/cart", (req, res) => {
  res.json({ cart: req.session.cart || [] });
});

// ------------------------------
// API stateless
// ------------------------------
app.post("/stateless/cart", (req, res) => {
  if (!req.body || !req.body.cart) {
    return res.status(400).json({ error: "Missing cart array in body" });
  }
  res.json({ cart: req.body.cart });
});

// ------------------------------
// Start server
// ------------------------------
const PORT = 4000;
app.listen(PORT, "127.0.0.1", () => {
  console.log(`🚀 Server chạy ở http://127.0.0.1:${PORT}`);
});
