/**
 * PRODUCT ROUTES - RESTful API endpoints for plant nursery products
 * 
 * CE-2 Upgraded Version: Uses PostgreSQL + Redis Cloud Caching
 */

const express = require("express");
const { Op } = require("sequelize");
const { body, query, param, validationResult } = require("express-validator");
const { asyncHandler, createError } = require("../middleware/errorHandler");
const { Product } = require("../models");
const redisClient = require("../config/redisClient"); // ✅ Redis Cloud client

const router = express.Router();

async function getCachedJson(key) {
  if (!redisClient?.isOpen) return null;

  try {
    const cachedData = await redisClient.get(key);
    return cachedData ? JSON.parse(cachedData) : null;
  } catch (error) {
    console.warn(`Redis GET failed for ${key}:`, error.message);
    return null;
  }
}

async function setCachedJson(key, ttlSeconds, value) {
  if (!redisClient?.isOpen) return;

  try {
    await redisClient.setEx(key, ttlSeconds, JSON.stringify(value));
  } catch (error) {
    console.warn(`Redis SET failed for ${key}:`, error.message);
  }
}

async function deleteCacheKey(key) {
  if (!redisClient?.isOpen) return;

  try {
    await redisClient.del(key);
  } catch (error) {
    console.warn(`Redis DEL failed for ${key}:`, error.message);
  }
}

async function clearProductCache() {
  if (!redisClient?.isOpen) return;

  try {
    await redisClient.flushAll();
  } catch (error) {
    console.warn("Redis FLUSHALL failed:", error.message);
  }
}

function normalizeProduct(product) {
  const plainProduct = typeof product.get === "function" ? product.get({ plain: true }) : product;
  const { instock, ...rest } = plainProduct;

  return {
    ...rest,
    price: parseFloat(rest.price) || 0,
    rating:
      rest.rating !== null && rest.rating !== undefined
        ? parseFloat(rest.rating)
        : rest.rating,
    originalPrice:
      rest.originalPrice !== null && rest.originalPrice !== undefined
        ? parseFloat(rest.originalPrice)
        : null,
    inStock: instock !== undefined ? instock : true,
  };
}

function buildProductWhereClause(filters) {
  const where = {};

  if (filters.category && filters.category !== "all") {
    where.category = { [Op.like]: filters.category };
  }
  if (filters.size && filters.size !== "all") {
    where.size = { [Op.like]: filters.size };
  }
  if (filters.minPrice || filters.maxPrice) {
    where.price = {};
    if (filters.minPrice) where.price[Op.gte] = parseFloat(filters.minPrice);
    if (filters.maxPrice) where.price[Op.lte] = parseFloat(filters.maxPrice);
  }
  if (filters.inStock === "true") {
    where.instock = true;
  }
  if (filters.search) {
    where[Op.or] = [
      { name: { [Op.like]: `%${filters.search}%` } },
      { description: { [Op.like]: `%${filters.search}%` } },
    ];
  }

  return where;
}

function buildProductOrder(sort) {
  switch ((sort || "").toLowerCase()) {
    case "price-low":
      return [["price", "ASC"]];
    case "price-high":
      return [["price", "DESC"]];
    case "rating":
      return [["rating", "DESC"]];
    case "name":
      return [["name", "ASC"]];
    case "newest":
      return [["id", "DESC"]];
    case "featured":
      return [["badge", "DESC"], ["rating", "DESC"], ["id", "DESC"]];
    default:
      return [["id", "ASC"]];
  }
}

/* -------------------------------------------------------------------------- */
/*                            GET /api/products (Cached)                      */
/* -------------------------------------------------------------------------- */

router.get(
  "/",
  [
    query("category").optional().isIn(["indoor", "outdoor", "flowering", "succulent", "pots", "tools", "all"]),
    query("care").optional().isIn(["easy", "moderate", "expert", "all"]),
    query("size").optional().isIn(["small", "medium", "large", "all"]),
    query("minPrice").optional().isFloat({ min: 0 }),
    query("maxPrice").optional().isFloat({ min: 0 }),
    query("inStock").optional().isBoolean(),
    query("search").optional().isLength({ min: 1, max: 100 }),
    query("sort").optional().isIn(["price-low", "price-high", "rating", "name", "newest", "popular", "featured"]),
    query("page").optional().isInt({ min: 1 }),
    query("limit").optional().isInt({ min: 1, max: 100 }),
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: "Invalid query parameters", errors: errors.array() });
    }

    const cacheKey = `products:${JSON.stringify(req.query)}`;

    // ✅ Try Redis cache first
    const cachedData = await getCachedJson(cacheKey);
    if (cachedData) {
      console.log("⚡ Cache hit:", cacheKey);
      return res.json(cachedData);
    }
    console.log("🧭 Cache miss:", cacheKey);

    const {
      category,
      care,
      size,
      minPrice,
      maxPrice,
      inStock,
      search,
      sort,
      page = 1,
      limit = 12,
    } = req.query;

    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    const offset = (pageNumber - 1) * limitNumber;
    const where = buildProductWhereClause({ category, care, size, minPrice, maxPrice, inStock, search });
    const order = buildProductOrder(sort);

    const { rows, count } = await Product.findAndCountAll({
      where,
      order,
      limit: limitNumber,
      offset,
    });

    const products = rows.map(normalizeProduct);
    const totalProducts = count;
    const totalPages = Math.max(1, Math.ceil(totalProducts / limitNumber));

    const responseData = {
      success: true,
      data: {
        products,
        pagination: {
          currentPage: pageNumber,
          totalPages,
          totalProducts,
          productsPerPage: limitNumber,
          hasNextPage: pageNumber < totalPages,
          hasPrevPage: pageNumber > 1,
        },
        filters: {
          category: category || "all",
          care: care || "all",
          size: size || "all",
          minPrice: minPrice || null,
          maxPrice: maxPrice || null,
          inStock: inStock || null,
          search: search || null,
          sort: sort || "popular",
        },
      },
      message: `Found ${products.length} products (page ${page}/${totalPages})`,
    };

    // ✅ Store in Redis for 2 minutes
    await setCachedJson(cacheKey, 120, responseData);

    res.json(responseData);
  })
);

/* -------------------------------------------------------------------------- */
/*                             GET /api/products/:id                          */
/* -------------------------------------------------------------------------- */

router.get(
  "/:id",
  [param("id").isInt({ min: 1 })],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: "Invalid product ID", errors: errors.array() });
    }

    const { id } = req.params;

    // ✅ Try Redis first
    const cacheKey = `product:${id}`;
    const cachedProduct = await getCachedJson(cacheKey);
    if (cachedProduct) {
      console.log("⚡ Cache hit:", cacheKey);
      return res.json(cachedProduct);
    }

    const product = await Product.findByPk(id);
    if (!product) throw createError(`Product with ID ${id} not found`, 404);

    const response = { success: true, data: normalizeProduct(product), message: "Product retrieved successfully" };

    // ✅ Store single product cache for 5 minutes
    await setCachedJson(cacheKey, 300, response);

    res.json(response);
  })
);

/* -------------------------------------------------------------------------- */
/*                           POST /api/products (Admin)                       */
/* -------------------------------------------------------------------------- */

router.post(
  "/",
  [
    body("name").notEmpty(),
    body("category").isIn(["indoor", "outdoor", "flowering", "succulent", "pots", "tools"]),
    body("price").isFloat({ min: 0 }),
    body("description").notEmpty(),
    body("size").isIn(["small", "medium", "large"]),
    body("care").isIn(["easy", "moderate", "expert"]),
    body("inStock").isBoolean(),
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: "Invalid product data", errors: errors.array() });
    }

    const {
      name, category, price, badge, description, inStock,
      image, lightRequirement, wateringFrequency, humidity,
      toxicity, origin, adultSize
    } = req.body;

    const createdProduct = await Product.create({
      name,
      category,
      price,
      badge: badge || null,
      description,
      instock: inStock,
      image: image || null,
      size: adultSize || null,
    });

    // ✅ Clear cache after product creation
    await clearProductCache();

    res.status(201).json({ success: true, data: normalizeProduct(createdProduct), message: "Product created successfully" });
  })
);

/* -------------------------------------------------------------------------- */
/*                           PUT /api/products/:id                            */
/* -------------------------------------------------------------------------- */

router.put(
  "/:id",
  [param("id").isInt({ min: 1 })],
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const updatePayload = {};
    const allowedFields = {
      name: "name",
      category: "category",
      price: "price",
      badge: "badge",
      description: "description",
      inStock: "instock",
      image: "image",
      size: "size",
      rating: "rating",
      originalPrice: "originalPrice",
    };

    for (const [key, value] of Object.entries(req.body)) {
      const targetKey = allowedFields[key];
      if (targetKey) {
        updatePayload[targetKey] = value;
      }
    }

    if (Object.keys(updatePayload).length === 0) {
      return res.status(400).json({ success: false, message: "No fields to update" });
    }

    const product = await Product.findByPk(id);
    if (!product) throw createError(`Product with ID ${id} not found`, 404);

    await product.update(updatePayload);

    // ✅ Invalidate product cache
    await deleteCacheKey(`product:${id}`);
    await clearProductCache(); // clear product list cache

    res.json({ success: true, data: normalizeProduct(product), message: "Product updated successfully" });
  })
);

/* -------------------------------------------------------------------------- */
/*                         DELETE /api/products/:id                           */
/* -------------------------------------------------------------------------- */

router.delete(
  "/:id",
  [param("id").isInt({ min: 1 })],
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const product = await Product.findByPk(id);
    if (!product) throw createError(`Product with ID ${id} not found`, 404);

    await product.destroy();

    // ✅ Clear cache after delete
    await deleteCacheKey(`product:${id}`);
    await clearProductCache();

    res.json({ success: true, message: `Product ${product.name} deleted successfully` });
  })
);

module.exports = router;
