const express = require("express");
const { v4: uuidv4 } = require("uuid");
const { body, param, validationResult } = require("express-validator");
const { asyncHandler, createError } = require("../middleware/errorHandler");
const { CartSession, CartItem, Product } = require("../models");

const router = express.Router();

function normalizeProduct(product) {
  const plain = typeof product.get === "function" ? product.get({ plain: true }) : product;
  const { instock, ...rest } = plain;
  return {
    ...rest,
    price: parseFloat(rest.price) || 0,
    originalPrice:
      rest.originalPrice !== null && rest.originalPrice !== undefined
        ? parseFloat(rest.originalPrice)
        : null,
    inStock: instock !== undefined ? instock : true,
  };
}

function calculateCartTotals(items) {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const taxRate = 0.085;
  const tax = subtotal * taxRate;
  const shippingThreshold = 75;
  const shippingCost = 9.99;
  const shipping = subtotal >= shippingThreshold ? 0 : shippingCost;
  const total = subtotal + tax + shipping;

  return {
    subtotal: Math.round(subtotal * 100) / 100,
    tax: Math.round(tax * 100) / 100,
    shipping: Math.round(shipping * 100) / 100,
    total: Math.round(total * 100) / 100,
    freeShipping: subtotal >= shippingThreshold,
    amountForFreeShipping: subtotal >= shippingThreshold ? 0 : Math.round((shippingThreshold - subtotal) * 100) / 100,
  };
}

async function getCartSessionOrThrow(sessionId) {
  const cartSession = await CartSession.findOne({
    where: { sessionId },
    include: [
      {
        model: CartItem,
        as: "items",
        include: [{ model: Product, as: "product" }],
      },
    ],
  });

  if (!cartSession) {
    throw createError(404, "Cart not found");
  }

  return cartSession;
}

function serializeCart(cartSession) {
  const items = (cartSession.items || []).map((item) => {
    const product = normalizeProduct(item.product);
    return {
      productId: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.image,
      size: product.size,
      quantity: item.quantity,
      addedAt: item.createdAt,
    };
  });

  return {
    sessionId: cartSession.sessionId,
    items,
    totals: calculateCartTotals(items),
    createdAt: cartSession.createdAt,
    updatedAt: cartSession.updatedAt,
    itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
  };
}

router.post("/create", asyncHandler(async (req, res) => {
  const cartSession = await CartSession.create({ sessionId: uuidv4() });
  req.session.cartId = cartSession.sessionId;

  res.status(201).json({
    success: true,
    data: serializeCart(cartSession),
    message: "New cart created successfully",
  });
}));

router.get(
  "/:sessionId",
  [param("sessionId").isUUID(4)],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: "Invalid session ID", errors: errors.array() });
    }

    const cartSession = await getCartSessionOrThrow(req.params.sessionId);
    res.json({
      success: true,
      data: serializeCart(cartSession),
      message: "Cart retrieved successfully",
    });
  })
);

router.post(
  "/:sessionId/items",
  [
    param("sessionId").isUUID(4),
    body("productId").isInt({ min: 1 }),
    body("quantity").optional().isInt({ min: 1, max: 99 }),
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: "Invalid request data", errors: errors.array() });
    }

    const { sessionId } = req.params;
    const { productId, quantity = 1 } = req.body;
    const cartSession = await getCartSessionOrThrow(sessionId);
    const product = await Product.findByPk(productId);

    if (!product) throw createError(404, "Product not found");
    if (!product.instock) throw createError(400, "Product is out of stock");

    const existingItem = await CartItem.findOne({
      where: {
        cartSessionId: cartSession.id,
        productId,
      },
    });

    if (existingItem) {
      const newQuantity = existingItem.quantity + quantity;
      if (newQuantity > 99) throw createError(400, "Maximum quantity per item is 99");
      await existingItem.update({ quantity: newQuantity });
    } else {
      await CartItem.create({
        cartSessionId: cartSession.id,
        productId,
        quantity,
      });
    }

    const refreshedCart = await getCartSessionOrThrow(sessionId);
    const serializedCart = serializeCart(refreshedCart);
    const io = req.app.get("io");
    if (io) {
      io.emit("cart:updated", {
        sessionId,
        action: "item_added",
        itemCount: serializedCart.itemCount,
        totals: serializedCart.totals,
        product: { id: product.id, name: product.name, quantity },
      });
    }

    res.json({
      success: true,
      data: serializedCart,
      message: `Added ${product.name} to cart successfully`,
    });
  })
);

router.put(
  "/:sessionId/items/:productId",
  [
    param("sessionId").isUUID(4),
    param("productId").isInt({ min: 1 }),
    body("quantity").isInt({ min: 1, max: 99 }),
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: "Invalid request data", errors: errors.array() });
    }

    const cartSession = await getCartSessionOrThrow(req.params.sessionId);
    const item = await CartItem.findOne({
      where: {
        cartSessionId: cartSession.id,
        productId: parseInt(req.params.productId, 10),
      },
    });

    if (!item) throw createError(404, "Item not found in cart");

    await item.update({ quantity: req.body.quantity });
    const refreshedCart = await getCartSessionOrThrow(req.params.sessionId);
    const serializedCart = serializeCart(refreshedCart);
    const io = req.app.get("io");
    if (io) {
      io.emit("cart:updated", {
        sessionId: req.params.sessionId,
        action: "item_quantity_updated",
        itemCount: serializedCart.itemCount,
        totals: serializedCart.totals,
        productId: parseInt(req.params.productId, 10),
        quantity: req.body.quantity,
      });
    }

    res.json({
      success: true,
      data: serializedCart,
      message: "Cart item updated successfully",
    });
  })
);

router.delete(
  "/:sessionId/items/:productId",
  [param("sessionId").isUUID(4), param("productId").isInt({ min: 1 })],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: "Invalid request parameters", errors: errors.array() });
    }

    const cartSession = await getCartSessionOrThrow(req.params.sessionId);
    const item = await CartItem.findOne({
      where: {
        cartSessionId: cartSession.id,
        productId: parseInt(req.params.productId, 10),
      },
      include: [{ model: Product, as: "product" }],
    });

    if (!item) throw createError(404, "Item not found in cart");

    const removedName = item.product?.name || "Item";
    await item.destroy();

    const refreshedCart = await getCartSessionOrThrow(req.params.sessionId);
    const serializedCart = serializeCart(refreshedCart);
    const io = req.app.get("io");
    if (io) {
      io.emit("cart:updated", {
        sessionId: req.params.sessionId,
        action: "item_removed",
        itemCount: serializedCart.itemCount,
        totals: serializedCart.totals,
        product: { id: parseInt(req.params.productId, 10), name: removedName },
      });
    }

    res.json({
      success: true,
      data: serializedCart,
      message: `Removed ${removedName} from cart successfully`,
    });
  })
);

router.delete(
  "/:sessionId/clear",
  [param("sessionId").isUUID(4)],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: "Invalid session ID", errors: errors.array() });
    }

    const cartSession = await getCartSessionOrThrow(req.params.sessionId);
    await CartItem.destroy({ where: { cartSessionId: cartSession.id } });

    const refreshedCart = await getCartSessionOrThrow(req.params.sessionId);
    const serializedCart = serializeCart(refreshedCart);
    const io = req.app.get("io");
    if (io) {
      io.emit("cart:updated", {
        sessionId: req.params.sessionId,
        action: "cart_cleared",
        itemCount: 0,
        totals: serializedCart.totals,
      });
    }

    res.json({
      success: true,
      data: serializedCart,
      message: "Cart cleared successfully",
    });
  })
);

router.get(
  "/:sessionId/summary",
  [param("sessionId").isUUID(4)],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: "Invalid session ID", errors: errors.array() });
    }

    const cartSession = await getCartSessionOrThrow(req.params.sessionId);
    const cart = serializeCart(cartSession);
    res.json({
      success: true,
      data: {
        sessionId: cart.sessionId,
        itemCount: cart.itemCount,
        totals: cart.totals,
        hasItems: cart.items.length > 0,
        updatedAt: cart.updatedAt,
      },
      message: "Cart summary retrieved successfully",
    });
  })
);

router.post(
  "/:sessionId/validate",
  [param("sessionId").isUUID(4)],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: "Invalid session ID", errors: errors.array() });
    }

    const cartSession = await getCartSessionOrThrow(req.params.sessionId);
    const validationIssues = [];

    for (const item of cartSession.items || []) {
      const product = item.product;
      if (!product) {
        validationIssues.push({
          type: "product_removed",
          productId: item.productId,
          message: "A product is no longer available and has been removed from your cart",
        });
        await item.destroy();
        continue;
      }

      if (!product.instock) {
        validationIssues.push({
          type: "out_of_stock",
          productId: product.id,
          message: `${product.name} is currently out of stock and has been removed from your cart`,
        });
        await item.destroy();
      }
    }

    const refreshedCart = await getCartSessionOrThrow(req.params.sessionId);
    const serializedCart = serializeCart(refreshedCart);

    res.json({
      success: true,
      data: {
        cart: serializedCart,
        isValid: validationIssues.length === 0,
        issues: validationIssues,
        hasChanges: validationIssues.length > 0,
      },
      message: validationIssues.length === 0 ? "Cart is valid" : `Cart validation found ${validationIssues.length} issues`,
    });
  })
);

module.exports = router;
