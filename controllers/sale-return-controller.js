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
    discount = 0,
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

const DeleteTransaction = async (req, res, next) => {
  const { id: returnId } = req.params;

  if (!returnId) {
    return createError(res, 422, "Return ID is required!");
  }

  try {
    // Find the return document to get details
    const returnItems = await Return.findById(returnId).populate("items");

    if (!returnItems) {
      return createError(res, 404, "Return not found!");
    }

    // Reverse the update on the Customer
    await Customer.findByIdAndUpdate(
      returnItems.customerId,
      {
        $inc: {
          return_amount: -returnItems.total_amount,
          remaining: returnItems.total_amount,
        },
      },
      { new: true }
    );

    // Reverse the updates on Items
    await Promise.all(
      returnItems.items.map(async (item) => {
        const { itemId, qty } = item;

        // Revert item quantity
        await Item.findByIdAndUpdate(
          itemId,
          { $inc: { qty: qty, out_qty: -qty } },
          { new: true }
        );

        // Remove the product
        await Product.findByIdAndDelete(item._id);
      })
    );

    // Remove the return document
    const deletedReturn = await Return.findByIdAndDelete(returnId);

    if (!deletedReturn) {
      return createError(res, 400, "Unable to delete return!");
    }

    return successMessage(res, deletedReturn, "Return Successfully Deleted!");
  } catch (err) {
    console.log("Error Occur While Deleting Return: ", err);
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
            return_id: data._id,
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

const DeleteInvoice = async (req, res) => {
  const { customerId, invoice_no: current_invoice_no } = req.body;

  try {
    const transactions = await Return.find({
      customerId,
      invoice_no: current_invoice_no,
    })
      .populate("customerId")
      .populate("items");

    const UpdatedTransactions = transactions
      .map((data) => {
        const itemsData = data.items.map((dt) => {
          return {
            date: data.date,
            invoice_no: data.invoice_no,
            qty: dt.qty,
            purchase: dt.purchase,
            price: dt.price,
            amount: dt.amount,
            itemId: dt.itemId,
          };
        });
        return itemsData;
      })
      .flat();

    const totalAmount = transactions.reduce((total, cust) => {
      return total + Number(cust.total_amount);
    }, 0);
    const totalDiscount = transactions.reduce((total, cust) => {
      return total + Number(cust.discount);
    }, 0);

    await Promise.all(
      UpdatedTransactions.map(async (item) => {
        const { itemId, qty } = item;
        const response = await Item.findByIdAndUpdate(
          itemId,
          { $inc: { qty: -qty, out_qty: qty } }, // Decrement qty field by decrementQty
          { new: true } // Return the updated document
        );
      })
    );

    const updateCustomerAccount = await Customer.findByIdAndUpdate(
      customerId,
      {
        $inc: {
          remaining: Number(totalAmount),
          return_amount: -Number(totalAmount),
        },
      }, // Decrement qty field by decrementQty
      { new: true }
    );

    const deleteTransaction = await Return.deleteOne({
      invoice_no: current_invoice_no,
    });

    if (!deleteTransaction)
      return createError(
        res,
        400,
        "Unable to delete invoice no " + current_invoice_no
      );
    else
      return successMessage(
        res,
        200,
        "Invoice no" + current_invoice_no + " successfully deleted!"
      );
  } catch (error) {
    return createError(res, 400, error.message || "Internal server error!");
  }
};

module.exports = {
  DeleteTransaction,
  CreateTransaction,
  GetReturns,
  DeleteInvoice,
};
