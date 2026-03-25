const express = require("express");
const https = require("https");
const http = require("http");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const compression = require("compression");
const rateLimit = require("express-rate-limit");
const session = require("express-session");
const MySQLStoreFactory = require("express-mysql-session");
const cookieParser = require("cookie-parser");
const { Server } = require("socket.io");
require("dotenv").config();

const { errorHandler, asyncHandler } = require("./middleware/errorHandler");
const { logger } = require("./middleware/logger");
const { initializeDatabase, sequelize } = require("./models");
const redisClient = require("./config/redisClient");

const productRoutes = require("./routes/products");
const cartRoutes = require("./routes/cart");
const apiRoutes = require("./routes/api");
const paymentRoutes = require("./routes/payment");
const newsletterRoutes = require("./routes/newsletter");
const contactRoutes = require("./routes/contacts");

const app = express();
const PORT = process.env.PORT || 3000;
const SESSION_SECRET = process.env.SESSION_SECRET || "change_this_in_env";
const frontendPath = path.join(__dirname, "..", "frontend", "dist");
const frontendIndexPath = path.join(frontendPath, "index.html");
const MySQLStore = MySQLStoreFactory(session);

let sessionStore;

function createSessionMiddleware() {
  const baseConfig = {
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 * 7 },
  };

  if (process.env.NODE_ENV === "test") {
    return session(baseConfig);
  }

  sessionStore = new MySQLStore({
    host: process.env.MYSQL_HOST || "localhost",
    port: parseInt(process.env.MYSQL_PORT || "3306", 10),
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    createDatabaseTable: true,
    schema: {
      tableName: "sessions",
      columnNames: {
        session_id: "session_id",
        expires: "expires",
        data: "data",
      },
    },
  });

  return session({
    ...baseConfig,
    store: sessionStore,
  });
}

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: [
          "'self'",
          "'unsafe-inline'",
          "https://fonts.googleapis.com",
          "https://cdnjs.cloudflare.com",
          "https://cdn.jsdelivr.net",
          "https://unpkg.com",
        ],
        fontSrc: [
          "'self'",
          "https://fonts.gstatic.com",
          "https://cdnjs.cloudflare.com",
          "https://cdn.jsdelivr.net",
          "https://unpkg.com",
        ],
        scriptSrc: [
          "'self'",
          "'unsafe-inline'",
          "https://cdn.jsdelivr.net",
          "https://cdnjs.cloudflare.com",
        ],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
  })
);

app.use(
  cors({
    origin: ["http://localhost:3000", "http://127.0.0.1:3000"],
    credentials: true,
  })
);

app.use(compression());
if (process.env.NODE_ENV !== "production") app.use(morgan("dev"));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(createSessionMiddleware());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: "Too many requests. Please try again later." },
});
app.use("/api/", limiter);

app.use(express.static(frontendPath));
app.disable("etag");

app.get("/favicon.ico", (req, res) => {
  res.sendFile(path.join(frontendPath, "images", "favicon.ico"));
});

app.use((req, res, next) => {
  res.locals.currentUser = req.session?.user || null;
  next();
});
app.use(logger);

app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api", apiRoutes);
app.use("/api/auth", require("./routes/auth"));
app.use("/api/admin", require("./routes/admin"));
app.use("/api/orders", require("./routes/orders"));
app.use("/api/payment", paymentRoutes);
app.use("/api/subscribe", newsletterRoutes);
app.use("/api/contact", contactRoutes);

app.get(
  "/health",
  asyncHandler(async (req, res) => {
    await sequelize.authenticate();
    res.json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      env: process.env.NODE_ENV || "development",
      database: "mysql",
      frontend: fs.existsSync(frontendIndexPath) ? "react-dist" : "missing-build",
    });
  })
);

app.use("*", (req, res) => {
  if (req.originalUrl.startsWith("/api/")) {
    return res.status(404).json({ success: false, error: "API endpoint not found" });
  }

  if (!fs.existsSync(frontendIndexPath)) {
    return res
      .status(500)
      .send("Frontend build not found. Run npm run build in the frontend directory.");
  }

  return res.sendFile(frontendIndexPath);
});

app.use(errorHandler);

const USE_HTTPS = process.env.USE_HTTPS === "true";
const HTTPS_PORT = process.env.HTTPS_PORT || 3443;

let server;
let httpsServer;
let io;
let isShuttingDown = false;

async function startServers() {
  await initializeDatabase();
  console.log("Connected to MySQL");

  if (USE_HTTPS) {
    const sslKeyPath = path.join(__dirname, "ssl", "server.key");
    const sslCertPath = path.join(__dirname, "ssl", "server.cert");

    try {
      const sslOptions = {
        key: fs.readFileSync(sslKeyPath),
        cert: fs.readFileSync(sslCertPath),
      };

      httpsServer = https.createServer(sslOptions, app);
      const httpApp = express();
      httpApp.use((req, res) => {
        res.redirect(301, `https://${req.headers.host.split(":")[0]}:${HTTPS_PORT}${req.url}`);
      });
      server = http.createServer(httpApp);
      server.listen(PORT);
      httpsServer.listen(HTTPS_PORT);
    } catch (error) {
      console.error("SSL certificate error, falling back to HTTP:", error.message);
      server = http.createServer(app);
      server.listen(PORT);
    }
  } else {
    server = http.createServer(app);
    server.listen(PORT);
  }

  io = new Server(httpsServer || server, {
    cors: {
      origin: ["http://localhost:3000", "http://127.0.0.1:3000", "https://localhost:3443", "https://127.0.0.1:3443"],
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    socket.on("cart:update", (data) => io.emit("cart:updated", data));
  });

  app.set("io", io);

  console.log(`Server running on http://localhost:${PORT}`);
  if (USE_HTTPS && httpsServer) {
    console.log(`HTTPS server running on https://localhost:${HTTPS_PORT}`);
  }
}

async function gracefulShutdown(signal) {
  if (isShuttingDown) return;
  isShuttingDown = true;

  console.log(`Received ${signal}. Server stopping...`);

  const forceExitTimer = setTimeout(() => {
    console.error("Shutdown timed out. Forcing exit.");
    process.exit(1);
  }, 10000);

  try {
    if (io) io.close();

    await Promise.allSettled([
      new Promise((resolve) => {
        if (!httpsServer) return resolve();
        httpsServer.close(() => resolve());
      }),
      new Promise((resolve) => {
        if (!server) return resolve();
        server.close(() => resolve());
      }),
      sessionStore?.close ? sessionStore.close() : Promise.resolve(),
      sequelize.close(),
      redisClient?.isOpen ? redisClient.quit() : Promise.resolve(),
    ]);

    clearTimeout(forceExitTimer);
    process.exit(0);
  } catch (error) {
    clearTimeout(forceExitTimer);
    console.error("Error during shutdown:", error);
    process.exit(1);
  }
}

if (require.main === module) {
  startServers().catch((error) => {
    console.error("Failed to start server:", error);
    process.exit(1);
  });
}

process.removeAllListeners("SIGINT");
process.removeAllListeners("SIGTERM");
process.on("SIGINT", () => gracefulShutdown("SIGINT"));
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("unhandledRejection", (reason) => {
  console.error("Unhandled Rejection:", reason);
  process.exit(1);
});
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  process.exit(1);
});

module.exports = app;
