import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "https://stockmaster-lovat.vercel.app",
  "https://stockmaster-086q.onrender.com"
];


if (process.env.CORS_ORIGIN && process.env.CORS_ORIGIN !== '*') {
  allowedOrigins.push(process.env.CORS_ORIGIN);
}


app.use(
  cors({
    origin: function (origin, callback) {

      if (!origin) return callback(null, true);


      if (allowedOrigins.indexOf(origin) !== -1) {
        return callback(null, true);
      }


      if (origin.endsWith('.vercel.app')) {
        return callback(null, true);
      }


      if (process.env.CORS_ORIGIN === '*') {
        return callback(null, true);
      }


      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    },
    credentials: true,
  })
);

// Body parsers
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// Routes
import authRouter from "./src/routes/auth.route.js";
import productRouter from "./src/routes/product.route.js";
import categoryRouter from "./src/routes/category.route.js";
import contactRouter from "./src/routes/contact.route.js";
import locationRouter from "./src/routes/location.route.js";
import operationRouter from "./src/routes/operation.route.js";
import dashboardRouter from "./src/routes/dashboard.route.js";
import healthcheckRouter from "./src/routes/healthcheck.route.js";

// Route declarations
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/categories", categoryRouter);
app.use("/api/v1/contacts", contactRouter);
app.use("/api/v1/locations", locationRouter);
app.use("/api/v1/operations", operationRouter);
app.use("/api/v1/dashboard", dashboardRouter);
app.use("/api/v1/healthcheck", healthcheckRouter);

// Welcome route
app.get("/", (req, res) => {
  res.json({
    message: "🚀 StockMaster API is running!",
    version: "1.0.0",
    endpoints: {
      auth: "/api/v1/auth",
      products: "/api/v1/products",
      categories: "/api/v1/categories",
      contacts: "/api/v1/contacts",
      locations: "/api/v1/locations",
      operations: "/api/v1/operations",
      dashboard: "/api/v1/dashboard",
      healthcheck: "/api/v1/healthcheck",
    },
  });
});

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

// Global error handler - MUST BE LAST
app.use((err, req, res, next) => {
  console.error("🔥 Error:", {
    message: err.message,
    statusCode: err.statusCode,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });

  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({
    success: false,
    message,
    errors: err.errors || [],
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

export { app };
