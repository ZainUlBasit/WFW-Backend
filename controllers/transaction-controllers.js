const Joi = require("joi");
const SubCategory = require("../Models/SubCategory");
const { createError, successMessage } = require("../utils/ResponseMessage");
const Category = require("../Models/Category");
const Company = require("../Models/Company");
const Transaction = require("../Models/Transaction");
const Product = require("../Models/Product");
const Item = require("../Models/Item");
const Customer = require("../Models/Customer");

const CreateTransaction = async (req, res, next) => {
  console.log(req.body);
  const {
    customerId,
    date = Math.floor(Date.now() / 1000),
    items,
    discount,
  } = req.body;

  if (!customerId || !date || discount === "")
    return createError(res, 422, "Required fields are undefined!");

  if (!Array.isArray(items))
    return createError(res, 422, "Items must be an array of objects!");

  try {
    const productIds = await Promise.all(
      items.map(async (item) => {
        const { itemId, qty, price, purchase, amount } = item;
        const savedProduct = await new Product({
          itemId,
          qty,
          price,
          purchase,
          amount,
        }).save();
        return savedProduct._id;
      })
    );
    let totalAmount = 0;
    await Promise.all(
      items.map(async (item) => {
        const { itemId, qty, amount } = item;
        const response = await Item.findByIdAndUpdate(
          itemId,
          { $inc: { qty: -qty } }, // Decrement qty field by decrementQty
          { new: true } // Return the updated document
        );
        totalAmount += amount;
      })
    );

    const transaction = await new Transaction({
      customerId,
      date: Math.floor(new Date(date) / 1000),
      discount,
      items: productIds,
      total_amount: totalAmount,
    }).save();

    if (!transaction)
      return createError(res, 400, "Unable to Add Transaction!");
    const updateCustomerAccount = await Customer.findByIdAndUpdate(
      customerId,
      { $inc: { total: totalAmount, remaining: totalAmount } }, // Decrement qty field by decrementQty
      { new: true }
    );
    return successMessage(res, transaction, "Transaction Successfully Added!");
  } catch (err) {
    console.log("Error Occur While Transaction: ", err);
    return createError(res, 500, err.message || err);
  }
};

const GetTransactions = async (req, res) => {
  console.log(req.body);
  try {
    const {
      from = 0,
      to = Math.floor(Date.now() / 1000),
      customerId,
    } = req.body;

    if (!customerId) {
      return createError(res, 422, "Customer ID is required!");
    }

    // Convert dates to seconds (if they're not already)
    const fromDateInSeconds = Math.floor(new Date(from) / 1000);
    const toDateInSeconds = Math.floor(new Date(to) / 1000);

    console.log({
      customerId: customerId,
      fromDateInSeconds,
      toDateInSeconds,
    });

    // Retrieve transactions for the given customer within the specified date range
    const transactions = await Transaction.find({
      customerId,
      date: { $gte: fromDateInSeconds, $lte: toDateInSeconds },
    })
      .populate("customerId")
      .populate({
        path: "items",
        populate: { path: "itemId" }, // Populate the 'itemId' field within 'items'
      });

    console.log("Transactions:", transactions); // Debug: Print retrieved transactions

    return successMessage(
      res,
      transactions,
      "Transactions retrieved successfully!"
    );
  } catch (err) {
    console.error("Error occurred while fetching transactions:", err);
    return createError(res, 500, err.message || "Internal Server Error");
  }
};

module.exports = {
  CreateTransaction,
  GetTransactions,
};
