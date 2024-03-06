require("dotenv").config();
const express = require("express");
const port = process.env.PORT || 8000;
const app = express();
const http = require("http");
const server = http.createServer(app);
const Router = require("./web/routes");
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
// xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
// End Import all Routes
// xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

global.rootDirectory = path.resolve(__dirname);

const corsOptions = {
  origin: ["http://localhost:3000", "https://wfw-expert-system.vercel.app"],
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
api.use("/api/item", ItemRoutes);
api.use("/api/category", CategoryRoutes);
api.use("/api/sub-category", SubCategoryRoutes);
api.use("/api/sub-category", CustomerRoutes);
api.use("/api/customer", CustomerRoutes);
api.use("/api/sale", SalesRoutes);
api.use("/api/sale-return", SalesReturnRoutes);
api.use("/api/report", ReportRoutes);
api.use("/api/payment", PaymentRoutes);

server.listen(port, () => {
  console.log(`Listening to port ${port}`);
});
