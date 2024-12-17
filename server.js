require("dotenv").config();
const express = require("express");
const port = process.env.PORT || 8000;
const app = express();
const http = require("http");
const server = http.createServer(app);
const mongoose = require("mongoose");
const path = require("path");
const cookieParser = require("cookie-parser");
const cors = require("cors");

// Import all routes
const AuthRoutes = require("./routes/auth.routes");
const CompanyRoutes = require("./routes/company.routes");
const ItemRoutes = require("./routes/item.routes");
const CategoryRoutes = require("./routes/category.routes");
const SubCategoryRoutes = require("./routes/sub-category.routes");
const CustomerRoutes = require("./routes/customer.routes");
const SalesRoutes = require("./routes/sale.routes");
const SalesReturnRoutes = require("./routes/sale-return.routes");
const ReportRoutes = require("./routes/report.routes");
const PaymentRoutes = require("./routes/payment.routes");
const StockRoutes = require("./routes/stock-routes");
const TransactionRoutes = require("./routes/transaction-route");

global.rootDirectory = path.resolve(__dirname);

// CORS configuration
const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = [
      "http://localhost:3000",
      "https://wfw-expert-system.vercel.app",
      "https://www.irshadcartondealer.com",
      "http://localhost:5174",
      "http://localhost:5173",
      "http://localhost:5176",
    ];
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

// Middleware
app.use(cors(corsOptions)); // Enable CORS
app.options("*", cors(corsOptions)); // Handle preflight requests
app.use(cookieParser());
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(process.env.mongooseUrl, {
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Database connected");
  })
  .catch((err) => {
    console.error("Database connection error:", err);
  });

// Routes
app.use("/api/auth", AuthRoutes);
app.use("/api/company", CompanyRoutes);
app.use("/api/item", ItemRoutes);
app.use("/api/category", CategoryRoutes);
app.use("/api/sub-category", SubCategoryRoutes);
app.use("/api/customer", CustomerRoutes);
app.use("/api/sale", SalesRoutes);
app.use("/api/sale-return", SalesReturnRoutes);
app.use("/api/report", ReportRoutes);
app.use("/api/payment", PaymentRoutes);
app.use("/api/stock", StockRoutes);
app.use("/api/transaction", TransactionRoutes);

// Default route for debugging CORS issues
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", req.headers.origin || "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header("Access-Control-Allow-Credentials", "true");
  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }
  next();
});

// Start server
server.listen(port, () => {
  console.log(`Listening to port ${port}`);
});
