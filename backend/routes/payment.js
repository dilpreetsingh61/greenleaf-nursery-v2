const express = require("express");
const { Order } = require("../models");

const router = express.Router();

router.post("/checkout", async (req, res) => {
  try {
    const { name, email, amount, method, cart, shippingInfo } = req.body;

    if (!name || !email || !amount || !method) {
      return res.status(400).json({
        success: false,
        error: "Missing required payment details.",
      });
    }

    const transactionId = `TXN${Math.floor(Math.random() * 1_000_000_000)}`;
    const orderNumber = `ORD${Date.now()}${Math.floor(Math.random() * 1000)}`;

    await Order.create({
      userEmail: email,
      userName: name,
      items: cart || [],
      shippingInfo: shippingInfo || {},
      totalAmount: amount,
      paymentMethod: method,
      transactionId,
      orderNumber,
      paymentStatus: "success",
    });

    res.status(200).json({
      success: true,
      message: "Payment processed successfully",
      transactionId,
      orderNumber,
      details: { name, email, amount, method },
    });
  } catch (err) {
    console.error("Payment error:", err.message);
    res.status(500).json({ success: false, error: "Internal payment error" });
  }
});

module.exports = router;
