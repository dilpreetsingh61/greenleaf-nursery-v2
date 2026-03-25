const request = require("supertest");
const express = require("express");

let mockContacts = [];
let mockSubscribers = [];
const mockProducts = [
  {
    id: 1,
    name: "Snake Plant",
    description: "Easy indoor plant",
    category: "indoor",
    badge: "popular",
    size: "medium",
    rating: 4.8,
    price: 29.99,
    originalPrice: 39.99,
    instock: true,
    get() {
      return this;
    },
  },
];

jest.mock("../models", () => ({
  sequelize: {
    authenticate: jest.fn().mockResolvedValue(true),
  },
  Product: {
    findAll: jest.fn(async (options = {}) => {
      if (options.where?.instock === true) {
        return mockProducts.filter((product) => product.instock);
      }
      return mockProducts;
    }),
  },
  Contact: {
    create: jest.fn(async (payload) => {
      const contact = {
        id: mockContacts.length + 1,
        createdAt: new Date().toISOString(),
        ...payload,
      };
      mockContacts.push(contact);
      return contact;
    }),
  },
  NewsletterSubscriber: {
    findOrCreate: jest.fn(async ({ where, defaults }) => {
      const existing = mockSubscribers.find((subscriber) => subscriber.email === where.email);
      if (existing) {
        return [existing, false];
      }
      const subscriber = { id: mockSubscribers.length + 1, ...defaults };
      mockSubscribers.push(subscriber);
      return [subscriber, true];
    }),
  },
  ServiceBooking: {
    create: jest.fn(),
  },
}));

jest.mock("../config/redisClient", () => ({
  info: jest.fn().mockResolvedValue(""),
  dbSize: jest.fn().mockResolvedValue(0),
  keys: jest.fn().mockResolvedValue([]),
  ttl: jest.fn().mockResolvedValue(-1),
  del: jest.fn().mockResolvedValue(0),
}));

const apiRoutes = require("../routes/api");

const app = express();
app.use(express.json());
app.use("/api", apiRoutes);

describe("Integration Tests - API Endpoints", () => {
  beforeEach(() => {
    mockContacts = [];
    mockSubscribers = [];
  });

  describe("GET /api/health", () => {
    test("should return health status", async () => {
      const response = await request(app).get("/api/health").expect("Content-Type", /json/).expect(200);

      expect(response.body).toHaveProperty("success");
      expect(response.body).toHaveProperty("data");
      expect(response.body.data).toHaveProperty("status");
      expect(response.body.data.status).toBe("healthy");
    });

    test("should include timestamp and version", async () => {
      const response = await request(app).get("/api/health");

      expect(response.body.data).toHaveProperty("timestamp");
      expect(response.body.data).toHaveProperty("version");
      expect(response.body.data.version).toBe("1.0.0");
    });
  });

  describe("GET /api/info", () => {
    test("should return API information", async () => {
      const response = await request(app).get("/api/info").expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty("name");
      expect(response.body.data.name).toBe("Plant Nursery API");
      expect(response.body.data).toHaveProperty("endpoints");
    });
  });

  describe("GET /api/redis/stats", () => {
    test("should return Redis statistics or error gracefully", async () => {
      const response = await request(app).get("/api/redis/stats").expect(200);

      expect(response.body).toHaveProperty("data");
      expect(response.body.data).toHaveProperty("enabled");
    });
  });

  describe("GET /api/categories", () => {
    test("should return product categories", async () => {
      const response = await request(app).get("/api/categories").expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty("categories");
      expect(Array.isArray(response.body.data.categories)).toBe(true);
    });
  });

  describe("POST /api/newsletter/subscribe", () => {
    test("should reject invalid email", async () => {
      const response = await request(app).post("/api/newsletter/subscribe").send({ email: "invalid-email" }).expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body).toHaveProperty("errors");
    });

    test("should accept valid email", async () => {
      const response = await request(app)
        .post("/api/newsletter/subscribe")
        .send({
          email: "test@example.com",
          name: "Test User",
        })
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain("subscribed");
    });
  });

  describe("POST /api/contact", () => {
    test("should reject incomplete contact form", async () => {
      const response = await request(app)
        .post("/api/contact")
        .send({
          name: "Test",
          email: "test@example.com",
        })
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    test("should accept valid contact form", async () => {
      const response = await request(app)
        .post("/api/contact")
        .send({
          name: "Test User",
          email: "test@example.com",
          subject: "Test Subject Line",
          message: "This is a test message with enough characters to pass validation.",
        })
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty("id");
    });
  });
});

describe("Integration Tests - Error Handling", () => {
  test("should return 404 for non-existent endpoint", async () => {
    await request(app).get("/api/nonexistent").expect(404);
  });
});
