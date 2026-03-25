const express = require("express");
const { Order } = require("../models");

const router = express.Router();

function normalizeOrder(order) {
  const plain = typeof order.get === "function" ? order.get({ plain: true }) : order;
  return {
    ...plain,
    totalAmount: parseFloat(plain.totalAmount) || 0,
  };
}

router.get("/my-orders", async (req, res) => {
  try {
    if (!req.session || !req.session.user) {
      return res.status(401).json({
        success: false,
        error: "Please log in to view orders",
      });
    }

    const orders = await Order.findAll({
      where: { userEmail: req.session.user.email },
      order: [["created_at", "DESC"]],
    });

    res.json({
      success: true,
      orders: orders.map(normalizeOrder),
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch orders",
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    if (!req.session || !req.session.user) {
      return res.status(401).json({
        success: false,
        error: "Please log in to view order details",
      });
    }

    const order = await Order.findOne({
      where: {
        id: req.params.id,
        userEmail: req.session.user.email,
      },
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        error: "Order not found",
      });
    }

    res.json({
      success: true,
      order: normalizeOrder(order),
    });
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch order details",
    });
  }
});

module.exports = router;
