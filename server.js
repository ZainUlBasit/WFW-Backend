require("dotenv").config();
const express = require("express");
const port = process.env.PORT || 8000;
const app = express();
const http = require("http");
const server = http.createServer(app);
// const Router = require("./web/routes");
const mongoose = require("mongoose");
const path = require("path");
const cookieParser = require("cookie-parser");
const cors = require("cors");
// ++++++++++++++++++++++++++++++++++++++++++
// Start Import all Routes
// ++++++++++++++++++++++++++++++++++++++++++
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
const TransactionkRoutes = require("./routes/transaction-route");

// xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
// End Import all Routes
// xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

global.rootDirectory = path.resolve(__dirname);

const corsOptions = {
  origin: ["https://www.irshadcartondealer.com"],
  credentials: true,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

app.use(cookieParser());
app.use(express.json());
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

mongoose
  .connect(process.env.mongooseUrl, {
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("database connected");
  })
  .catch((err) => {
    console.log(err);
  });

app.use("/api/auth", AuthRoutes);
app.use("/api/company", CompanyRoutes);
app.use("/api/item", ItemRoutes);
app.use("/api/category", CategoryRoutes);
app.use("/api/sub-category", SubCategoryRoutes);
app.use("/api/customer", CustomerRoutes);
// app.use("/api/sale", SalesRoutes);
app.use("/api/sale-return", SalesReturnRoutes);
app.use("/api/report", ReportRoutes);
app.use("/api/payment", PaymentRoutes);
app.use("/api/stock", StockRoutes);
app.use("/api/transaction", TransactionkRoutes);

server.listen(port, () => {
  console.log(`Listening to port ${port}`);
});
