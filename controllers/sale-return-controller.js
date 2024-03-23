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
          { $inc: { qty: qty } }, // Decrement qty field by qty
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

module.exports = {
  CreateTransaction,
};
