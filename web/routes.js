const express = require("express");
const router = express.Router();
const authControllers = require("../controllers/authControllers");
const cusAuthControllers = require("../controllers/CusAuthControllers");
const auth = require("../Middleware/auth");

const companyController = require("../controllers/company-controller");
const userController = require("../controllers/user-controllers");
const itemController = require("../controllers/item-controller");
const customerController = require("../controllers/customer-controllers");
const categoryController = require("../controllers/category-controllers");
const subCategoryController = require("../controllers/subcategory-controllers");
const billController = require("../controllers/billController");
const expenseController = require("../controllers/expenseController");
const customerTransactionController = require("../controllers/customerTransactionCotroller");
const companyTransactionController = require("../controllers/companyTransactionCotroller");
const sellerController = require("../controllers/sellerController");
const CustomerReturnController = require("../controllers/customerReturnController");
const BankController = require("../controllers/BankController");
const CustomerPaymentController = require("../controllers/customerPaymentController");

const TitemController = require("../controllers/titem-controller");
const CustomerTransaction = require("../Models/CustomerTransaction");

router.post("/get-item", TitemController.getAllItems);
router.post("/post-item", TitemController.addItem);

// Mobile Auth Routes
router.post("/customer-register", cusAuthControllers().register);
router.post("/customer-login", cusAuthControllers().login);

// Get Invoices Number
router.get("/get-invoices/:id", async (req, res, next) => {
  const shop = req.params.id;
  let AllInvoices;
  try {
    AllInvoices = await CustomerTransaction.find({ shop: shop }).select(
      "billNo"
    );
  } catch (err) {
    console.log(err);
  }

  if (!AllInvoices) {
    return res.status(404).json({ message: "No Invoice Found" });
  }
  return res.status(200).json(AllInvoices);
});

// Bank Routes
router.post("/add_bank", BankController.AddBank);
router.get("/get_bank", BankController.GetBank);
router.patch("/add_amount", BankController.AddAmount);

// login and logout routes
router.post("/login", authControllers().login);
router.post("/signup", authControllers().register);
router.get("/refresh", authControllers().autoLogin);
router.get("/logout", auth, authControllers().logout);
router.get("/users", userController.getAllUsers);
router.post("/users", userController.addUser);

// Dashboard Routes
router.get("/get-top-seller", sellerController.getTopSeller);
router.get("/get-under-seller", sellerController.getUnderSeller);

// companies routes
router.post("/companies", companyController.getAllCompanies);
router.post("/add-company", companyController.addCompany);
router.put("/update-company/:id", companyController.updateCompany);
router.delete("/delete-company/:id", companyController.deleteCompany);
router.patch("/update-company-total/:id", companyController.updateCompanyTotal);

// items routes
router.post("/item", itemController.getAllItems);
router.post("/add-item", itemController.addItem);
router.post("/add-many-item", itemController.addManyItem);
router.put("/update-item/:id", itemController.updateItem);
router.put("/update-item-qty/:id", itemController.updateItemQty);
router.delete("/delete-item/:id", itemController.deleteItem);

// Category routes
router.post("/category", categoryController.getAllCategories);
router.post("/add-category", categoryController.addCategory);
router.put("/update-category/:id", categoryController.updateCategory);
router.delete("/delete-category/:id", categoryController.deleteCategory);

// sub category routes
router.post("/subcategory", subCategoryController.getAllSubCategories);
router.put(
  "/update-subcategory/:subcategory",
  subCategoryController.updateSubCategory
);
router.delete(
  "/delete-subcategory/:id",
  subCategoryController.deleteSubCategory
);
router.post("/add-subcategory", subCategoryController.addSubCategory);

// customers routes
router.post("/customer", customerController.getAllCustomers);
router.post("/check_customer", customerController.CheckCustomers);
router.post("/add-customer", customerController.addCustomer);
router.post("/customer-return", CustomerReturnController.addCustomerReturn);
router.post("/get-returns", CustomerReturnController.GetReturns);
router.post(
  "/update-customer-total/:id",
  customerController.updateCustomerTotal
);

// ===================================================
// bill no
// ===================================================
router.get("/get-bill-no", billController.getCurrentBill);
router.put("/update-bill-no", billController.updateBillNo);

// Expenses
router.post("/get-expense", expenseController.getAllExpenses);
router.post("/add-expense", expenseController.addExpense);

// Customer Transactions
router.post(
  "/add_many_customer_transaction",
  customerTransactionController.addManyCustomerTransaction
);
router.post(
  "/customer-transaction",
  customerTransactionController.addCustomerTransaction
);
router.post(
  "/get-customer-transaction",
  customerTransactionController.getCustomerTransaction
);
router.delete(
  "/del-customer-transaction/:id/:id1",
  customerTransactionController.deleteCustomerTransaction
);
router.post(
  "/get-all-customer-transaction",
  customerTransactionController.getAllCustomerTransaction
);
router.post(
  "/get_all_transactions_sorted_by_date",
  customerTransactionController.getAllTransactionSortedByDate
);
router.post(
  "/get_all_transactions_sorted_by_billno",
  customerTransactionController.getAllTransactionSortedByBillNo
);

// Company Transactions
router.post(
  "/company-transaction",
  companyTransactionController.addCompanyTransaction
);
router.post(
  "/get-company-transaction",
  companyTransactionController.getCompanyTransaction
);
router.post(
  "/get_all_company_transaction",
  companyTransactionController.getAllCompanyTransaction
);

// Customer Payment
router.post("/customer-payment", customerController.addCustomerPayment);
router.post(
  "/update-customer-payment/:id/:id1",
  customerController.updateCustomerPayment
);
router.post("/get-customer-payment", customerController.getCustomerPayment);
// Company payment
router.post("/company-payment", companyController.addCompanyPayment);
router.post("/get-company-payment", companyController.getCompanyPayment);
// id = company name || id1 = company shop
router.post(
  "/update-company-payment/:id/:id1",
  companyController.updateCompanyPayment
);

module.exports = router;
