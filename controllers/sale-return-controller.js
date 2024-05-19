const Joi = require("joi");
const SubCategory = require("../Models/SubCategory");
const { createError, successMessage } = require("../utils/ResponseMessage");
const Category = require("../Models/Category");
const Company = require("../Models/Company");
const Transaction = require("../Models/Transaction");
const Product = require("../Models/Product");
const Item = require("../Models/Item");
const Customer = require("../Models/Customer");
const Return = require("../Models/Return");

const CreateTransaction = async (req, res, next) => {
  console.log("Return...........", req.body);
  const {
    customerId,
    date = Math.floor(Date.now() / 1000),
    items,
    discount,
    invoice_no,
  } = req.body;

  if (!customerId || !date || discount === "")
    return createError(res, 422, "Required fields are undefined!");

  if (!Array.isArray(items))
    return createError(res, 422, "Items must be an array of objects!");

  try {
    const productIds = await Promise.all(
      items.map(async (item) => {
        const { itemId, qty, price, purchase, amount } = item;

        // Save the product
        const savedProduct = await new Product({
          itemId,
          qty,
          price,
          purchase,
          amount,
        }).save();

        // Update the item and collect the response
        const response = await Item.findByIdAndUpdate(
          itemId,
          { $inc: { qty: qty, out_qty: -qty } }, // Decrement qty field by qty
          { new: true } // Return the updated document
        );

        return savedProduct._id;
      })
    );

    const totalAmount = items.reduce((acc, item) => acc + item.amount, 0);

    const return_items = await new Return({
      customerId,
      date: Math.floor(new Date(date) / 1000),
      discount,
      items: productIds,
      total_amount: totalAmount,
      invoice_no,
    }).save();

    if (!return_items) return createError(res, 400, "Unable to Return Items!");
    const updateCustomerAccount = await Customer.findByIdAndUpdate(
      customerId,
      { $inc: { return_amount: totalAmount, remaining: -totalAmount } }, // Decrement qty field by decrementQty
      { new: true }
    );
    return successMessage(res, return_items, "Return Successfully Added!");
  } catch (err) {
    console.log("Error Occur While Return: ", err);
    return createError(res, 500, err.message || err);
  }
};

const GetReturns = async (req, res) => {
  try {
    const { customerId } = req.body;
    console.log(req.body);

    if (!customerId) {
      return createError(res, 422, "Customer ID is required!");
    }

    // Convert dates to seconds (if they're not already)
    const transactions = await Return.find({
      customerId,
    })
      .populate("customerId")
      .populate({
        path: "items",
        populate: { path: "itemId" }, // Populate the itemId field inside the items array
      });

    const UpdatedTransactions = transactions
      .map((data) => {
        const itemsData = data.items.map((dt) => {
          return {
            date: data.date,
            invoice_no: data.invoice_no,
            name: dt.itemId.name,
            qty: dt.qty,
            purchase: dt.purchase,
            price: dt.price,
            amount: dt.amount,
          };
        });
        return itemsData;
      })
      .flat();

    return successMessage(
      res,
      UpdatedTransactions,
      "Returns retrieved successfully!"
    );
  } catch (err) {
    console.error("Error occurred while fetching returns data:", err);
    return createError(res, 500, err.message || "Internal Server Error");
  }
};

module.exports = {
  CreateTransaction,
  GetReturns,
};
