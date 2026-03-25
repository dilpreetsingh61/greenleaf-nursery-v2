const express = require("express");
const { body, query, validationResult } = require("express-validator");
const { Op } = require("sequelize");
const { asyncHandler } = require("../middleware/errorHandler");
const client = require("../config/redisClient");
const {
  sequelize,
  Product,
  Contact,
  NewsletterSubscriber,
  ServiceBooking,
} = require("../models");

const router = express.Router();

function normalizeProduct(product) {
  const plain = typeof product.get === "function" ? product.get({ plain: true }) : product;
  const { instock, ...rest } = plain;
  return {
    ...rest,
    price: parseFloat(rest.price) || 0,
    rating: rest.rating !== null && rest.rating !== undefined ? parseFloat(rest.rating) : 0,
    originalPrice:
      rest.originalPrice !== null && rest.originalPrice !== undefined
        ? parseFloat(rest.originalPrice)
        : null,
    inStock: instock !== undefined ? instock : true,
  };
}

router.get("/health", asyncHandler(async (req, res) => {
  const startTime = Date.now();
  let databaseHealth = "healthy";

  try {
    await sequelize.authenticate();
  } catch (error) {
    databaseHealth = "error";
    console.error("Health check - database error:", error.message);
  }

  const responseTime = Date.now() - startTime;
  const healthData = {
    status: databaseHealth === "healthy" ? "healthy" : "degraded",
    timestamp: new Date().toISOString(),
    responseTime: `${responseTime}ms`,
    version: "1.0.0",
    environment: process.env.NODE_ENV || "development",
    services: {
      api: "healthy",
      dataStore: databaseHealth,
    },
  };

  res.status(healthData.status === "healthy" ? 200 : 503).json({
    success: healthData.status === "healthy",
    data: healthData,
    message: `API is ${healthData.status}`,
  });
}));

router.get("/info", asyncHandler(async (req, res) => {
  res.json({
    success: true,
    data: {
      name: "Plant Nursery API",
      version: "1.0.0",
      description: "RESTful API for a plant nursery e-commerce website",
      author: "Plant Nursery Team",
      documentation: "/api/docs",
      endpoints: {
        products: {
          base: "/api/products",
          methods: ["GET", "POST", "PUT", "DELETE"],
          description: "Product management and catalog browsing",
        },
        cart: {
          base: "/api/cart",
          methods: ["GET", "POST", "PUT", "DELETE"],
          description: "Shopping cart management",
        },
        general: {
          base: "/api",
          methods: ["GET", "POST"],
          description: "General utilities, search, contact forms",
        },
      },
      features: [
        "Product catalog management",
        "Shopping cart functionality",
        "Search and filtering",
        "Contact form handling",
        "Newsletter subscriptions",
        "Health monitoring",
        "Input validation",
        "Error handling",
        "Request logging",
      ],
      lastUpdated: new Date().toISOString(),
    },
    message: "API information retrieved successfully",
  });
}));

router.get(
  "/search",
  [
    query("q").notEmpty().isLength({ min: 1, max: 100 }),
    query("limit").optional().isInt({ min: 1, max: 50 }),
    query("category").optional().isIn(["indoor", "outdoor", "flowering", "succulent", "pots", "tools"]),
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Invalid search parameters",
        errors: errors.array(),
      });
    }

    const { q, limit = 10, category } = req.query;
    const where = {
      [Op.or]: [
        { name: { [Op.like]: `%${q}%` } },
        { description: { [Op.like]: `%${q}%` } },
        { badge: { [Op.like]: `%${q}%` } },
        { size: { [Op.like]: `%${q}%` } },
      ],
    };

    if (category) where.category = category;

    const products = await Product.findAll({
      where,
      limit: parseInt(limit, 10),
      order: [["rating", "DESC"], ["id", "DESC"]],
    });

    const results = products.map(normalizeProduct);

    res.json({
      success: true,
      data: {
        results,
        query: q,
        category: category || "all",
        totalFound: results.length,
        limit: parseInt(limit, 10),
        hasMore: results.length === parseInt(limit, 10),
      },
      message: `Found ${results.length} results for "${q}"`,
    });
  })
);

router.post(
  "/contact",
  [
    body().custom((value) => {
      const hasFullName = typeof value.name === "string" && value.name.trim().length >= 2;
      const hasSplitName =
        typeof value.firstName === "string" &&
        value.firstName.trim().length >= 2 &&
        typeof value.lastName === "string" &&
        value.lastName.trim().length >= 2;

      if (!hasFullName && !hasSplitName) {
        throw new Error("Name is required");
      }

      return true;
    }),
    body("email").isEmail().normalizeEmail(),
    body("subject").notEmpty().isLength({ min: 5, max: 200 }),
    body("message").notEmpty().isLength({ min: 10, max: 1000 }),
    body("phone").optional().isMobilePhone("any", { strictMode: false }),
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Invalid contact form data",
        errors: errors.array(),
      });
    }

    const resolvedName =
      typeof req.body.name === "string" && req.body.name.trim()
        ? req.body.name.trim()
        : `${req.body.firstName || ""} ${req.body.lastName || ""}`.trim();

    const contact = await Contact.create({
      name: resolvedName,
      email: req.body.email,
      subject: req.body.subject,
      message: req.body.message,
      phone: req.body.phone || null,
    });

    res.status(201).json({
      success: true,
      data: {
        id: contact.id,
        submittedAt: contact.createdAt,
      },
      message: "Contact form submitted successfully. We will get back to you soon!",
    });
  })
);

router.post(
  "/newsletter/subscribe",
  [
    body("email").isEmail().normalizeEmail(),
    body("name").optional().isLength({ min: 2, max: 100 }),
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Invalid subscription data",
        errors: errors.array(),
      });
    }

    const [subscriber, created] = await NewsletterSubscriber.findOrCreate({
      where: { email: req.body.email },
      defaults: {
        email: req.body.email,
        isActive: true,
        subscribedAt: new Date(),
      },
    });

    if (!created && subscriber.isActive) {
      return res.status(409).json({
        success: false,
        message: "This email is already subscribed to our newsletter",
      });
    }

    if (!created) {
      await subscriber.update({
        isActive: true,
        subscribedAt: new Date(),
      });
    }

    res.status(201).json({
      success: true,
      message: "Successfully subscribed to our newsletter!",
    });
  })
);

router.post(
  "/services/book",
  [
    body("customerName").notEmpty().isLength({ min: 2, max: 100 }),
    body("customerEmail").isEmail().normalizeEmail(),
    body("customerPhone").optional().isLength({ min: 7, max: 20 }),
    body("preferredDate").notEmpty(),
    body("preferredTime").notEmpty(),
    body("serviceType").notEmpty().isLength({ min: 3, max: 100 }),
    body("serviceAddress").notEmpty().isLength({ min: 5 }),
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking data",
        errors: errors.array(),
      });
    }

    const booking = await ServiceBooking.create({
      customerName: req.body.customerName,
      customerEmail: req.body.customerEmail,
      customerPhone: req.body.customerPhone || null,
      preferredDate: req.body.preferredDate,
      preferredTime: req.body.preferredTime,
      serviceType: req.body.serviceType,
      serviceAddress: req.body.serviceAddress,
      status: "pending",
    });

    res.status(201).json({
      success: true,
      data: { id: booking.id },
      message: "Service booking received. We will contact you shortly.",
    });
  })
);

router.get(
  "/popular",
  [query("limit").optional().isInt({ min: 1, max: 20 })],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Invalid parameters",
        errors: errors.array(),
      });
    }

    const limit = parseInt(req.query.limit || "8", 10);
    const products = await Product.findAll({
      where: { instock: true },
      order: [["rating", "DESC"], ["id", "DESC"]],
      limit,
    });

    const popularProducts = products.map(normalizeProduct);

    res.json({
      success: true,
      data: {
        products: popularProducts,
        count: popularProducts.length,
        criteria: "Based on customer ratings and review counts",
      },
      message: `Retrieved ${popularProducts.length} popular products`,
    });
  })
);

router.get(
  "/featured",
  [query("limit").optional().isInt({ min: 1, max: 20 })],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Invalid parameters",
        errors: errors.array(),
      });
    }

    const limit = parseInt(req.query.limit || "6", 10);
    const featuredBadges = ["popular", "new", "sale", "exotic", "beginner-friendly"];
    const products = await Product.findAll({
      where: {
        instock: true,
        badge: { [Op.in]: featuredBadges },
      },
      order: [["rating", "DESC"], ["id", "DESC"]],
      limit,
    });

    const featuredProducts = products.map(normalizeProduct);

    res.json({
      success: true,
      data: {
        products: featuredProducts,
        count: featuredProducts.length,
        badges: featuredBadges,
      },
      message: `Retrieved ${featuredProducts.length} featured products`,
    });
  })
);

router.get("/categories", asyncHandler(async (req, res) => {
  const products = (await Product.findAll()).map(normalizeProduct);

  const categoryCounts = products.reduce((counts, product) => {
    const category = product.category;
    counts[category] = (counts[category] || 0) + 1;
    return counts;
  }, {});

  const categories = Object.entries(categoryCounts).map(([name, count]) => ({
    name,
    count,
    inStockCount: products.filter((product) => product.category === name && product.inStock).length,
  }));

  res.json({
    success: true,
    data: {
      categories,
      totalCategories: categories.length,
      totalProducts: products.length,
    },
    message: "Product categories retrieved successfully",
  });
}));

router.get("/redis/stats", asyncHandler(async (req, res) => {
  try {
    const info = await client.info("stats");
    const dbSize = await client.dbSize();
    const keys = await client.keys("/api/*");

    const keyDetails = await Promise.all(
      keys.slice(0, 5).map(async (key) => ({
        key,
        ttl: (await client.ttl(key)) > 0 ? `${await client.ttl(key)}s` : "expired/no expiry",
      }))
    );

    const infoLines = info.split("\r\n");
    const stats = {};
    infoLines.forEach((line) => {
      if (line.includes(":")) {
        const [key, value] = line.split(":");
        stats[key] = value;
      }
    });

    res.json({
      success: true,
      data: {
        enabled: true,
        totalKeys: dbSize,
        cachedEndpoints: keys.length,
        sampleKeys: keyDetails,
        cacheHits: stats.keyspace_hits || "N/A",
        cacheMisses: stats.keyspace_misses || "N/A",
        hitRate:
          stats.keyspace_hits && stats.keyspace_misses
            ? `${((parseInt(stats.keyspace_hits, 10) / (parseInt(stats.keyspace_hits, 10) + parseInt(stats.keyspace_misses, 10))) * 100).toFixed(2)}%`
            : "N/A",
        evictedKeys: stats.evicted_keys || "0",
        expiredKeys: stats.expired_keys || "0",
        uptime: stats.uptime_in_seconds ? `${Math.floor(parseInt(stats.uptime_in_seconds, 10) / 3600)}h` : "N/A",
      },
      message: "Redis cache statistics retrieved successfully",
    });
  } catch (error) {
    res.json({
      success: false,
      data: {
        enabled: false,
        error: "Redis not available or not configured",
      },
      message: "Redis cache is not available",
    });
  }
}));

router.post("/redis/clear", asyncHandler(async (req, res) => {
  try {
    const keys = await client.keys("/api/*");
    if (keys.length > 0) {
      await client.del(keys);
    }

    res.json({
      success: true,
      data: {
        clearedKeys: keys.length,
      },
      message: `Redis cache cleared (${keys.length} keys removed)`,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to clear Redis cache",
      error: error.message,
    });
  }
}));

module.exports = router;
