const { createClient } = require("redis");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

const shouldDisableRedis =
  process.env.NODE_ENV === "test" || process.env.REDIS_DISABLED === "true";

const disabledClient = {
  get isOpen() {
    return false;
  },
  get: async () => null,
  setEx: async () => {},
  del: async () => {},
  ttl: async () => -1,
  dbSize: async () => 0,
  keys: async () => [],
  info: async () => "",
  flushAll: async () => {},
  quit: async () => {},
};

function buildRedisOptions() {
  const redisUrl = process.env.REDIS_URL;
  const redisTlsEnabled =
    process.env.REDIS_TLS === "true" ||
    (typeof redisUrl === "string" && redisUrl.startsWith("rediss://"));

  const baseSocket = {
    connectTimeout: parseInt(process.env.REDIS_CONNECT_TIMEOUT || "10000", 10),
    keepAlive: parseInt(process.env.REDIS_KEEP_ALIVE || "5000", 10),
    reconnectStrategy: () => false,
  };

  if (redisUrl) {
    return {
      url: redisUrl,
      socket: {
        ...baseSocket,
        tls: redisTlsEnabled,
      },
    };
  }

  return {
    username: process.env.REDIS_USERNAME || "default",
    password: process.env.REDIS_PASSWORD || "",
    socket: {
      ...baseSocket,
      host: process.env.REDIS_HOST || "localhost",
      port: parseInt(process.env.REDIS_PORT || "6379", 10),
      tls: redisTlsEnabled,
    },
  };
}

if (shouldDisableRedis) {
  module.exports = disabledClient;
} else {
  const client = createClient(buildRedisOptions());

  let redisReady = false;
  let hasLoggedFailure = false;

  const markUnavailable = (message) => {
    redisReady = false;

    if (hasLoggedFailure) {
      return;
    }

    hasLoggedFailure = true;
    console.warn(`Redis unavailable, continuing without cache: ${message}`);
  };

  client.on("ready", () => {
    redisReady = true;
    hasLoggedFailure = false;
    console.log("Connected to Redis");
  });

  client.on("end", () => {
    redisReady = false;
  });

  client.on("error", (err) => {
    markUnavailable(err.message);
  });

  client.connect().catch((err) => {
    markUnavailable(err.message);
  });

  module.exports = {
    get isOpen() {
      return redisReady && client.isOpen;
    },
    get: async (...args) => (redisReady ? client.get(...args) : null),
    setEx: async (...args) => {
      if (!redisReady) return;
      await client.setEx(...args);
    },
    del: async (...args) => {
      if (!redisReady) return;
      await client.del(...args);
    },
    ttl: async (...args) => (redisReady ? client.ttl(...args) : -1),
    dbSize: async (...args) => (redisReady ? client.dbSize(...args) : 0),
    keys: async (...args) => (redisReady ? client.keys(...args) : []),
    info: async (...args) => (redisReady ? client.info(...args) : ""),
    flushAll: async (...args) => {
      if (!redisReady) return;
      await client.flushAll(...args);
    },
    quit: async () => {
      redisReady = false;
      if (client.isOpen) {
        await client.quit();
      }
    },
  };
}
