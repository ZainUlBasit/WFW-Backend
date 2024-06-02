const Joi = require("joi");
const SubCategory = require("../Models/SubCategory");
const { createError, successMessage } = require("../utils/ResponseMessage");
const Category = require("../Models/Category");
const Company = require("../Models/Company");
const Transaction = require("../Models/Transaction");
const Product = require("../Models/Product");
const Item = require("../Models/Item");
const Customer = require("../Models/Customer");

const CheckBillNumber = async (req, res, next) => {
  const { invoice_no } = req.body;
  try {
    // Retrieve transactions for the given invoice number
    const transactions = await Transaction.find({ invoice_no });

    if (transactions.length > 0) {
      // If transactions exist with the given invoice number, return true
      return successMessage(
        res,
        { exists: true },
        "Invoice number already exists."
      );
    } else {
      // If no transactions are found with the given invoice number, return false
      return successMessage(
        res,
        { exists: false },
        "Invoice number is available."
      );
    }
  } catch (err) {
    console.error("Error occurred while checking invoice number:", err);
    return createError(res, 500, err.message || "Internal Server Error");
  }
};

const CreateTransaction = async (req, res, next) => {
  console.log(req.body);
  const {
    customerId,
    date = Math.floor(Date.now() / 1000),
    items,
    discount,
    invoice_no,
  } = req.body;

  if (
    !customerId ||
    !date ||
    discount === "" ||
    invoice_no === "" ||
    Number(invoice_no) < 0
  )
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
          { $inc: { qty: -qty, out_qty: qty } }, // Decrement qty field by decrementQty
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
      invoice_no,
    }).save();

    if (!transaction)
      return createError(res, 400, "Unable to Add Transaction!");
    const updateCustomerAccount = await Customer.findByIdAndUpdate(
      customerId,
      {
        $inc: {
          total: totalAmount,
          remaining: Number(totalAmount) - Number(discount),
          discount: discount,
        },
      }, // Decrement qty field by decrementQty
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

    // Retrieve transactions for the given customer within the specified date range
    const transactions = await Transaction.find({
      customerId,
      date: { $gte: fromDateInSeconds, $lte: toDateInSeconds },
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
            _id: data._id,
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
      "Transactions retrieved successfully!"
    );
  } catch (err) {
    console.error("Error occurred while fetching transactions:", err);
    return createError(res, 500, err.message || "Internal Server Error");
  }
};

const GetItemSummary = async (req, res) => {
  const { customerId } = req.body;

  if (!customerId) {
    return createError(res, 422, "Invalid Customer ID!");
  }

  try {
    const transactions = await Transaction.find({ customerId })
      .populate("customerId")
      .populate({
        path: "items",
        populate: { path: "itemId" }, // Populate the itemId field inside the items array
      });

    const arrayOfItems = transactions.flatMap((dt) => dt.items);

    const newArray = arrayOfItems.map((dt) => {
      // If item doesn't have code property, return a new object with necessary properties
      return {
        code: dt.itemId.code,
        name: dt.itemId.name,
        price: dt.itemId.sale,
        qty: dt.qty,
      };
    });

    const copyNewArray = [...newArray];

    const updatedArray = [];
    newArray.map((dt) => {
      let currentIndex = -1;
      const exists = updatedArray.some((item, index) => {
        if (item.code === dt.code) {
          currentIndex = index;
          return true;
        } else false;
      });
      if (exists) {
        let temp = updatedArray[currentIndex];
        temp = {
          ...temp,
          qty: temp.qty + dt.qty,
        };
        updatedArray[currentIndex] = temp;
      } else {
        updatedArray.push(dt);
      }
    });

    return successMessage(
      res,
      updatedArray,
      "Transactions retrieved successfully!"
    );
  } catch (err) {
    console.error("Error occurred while fetching transactions:", err);
    return createError(res, 500, err.message || "Internal Server Error");
  }
};

const DeleteInvoice = async (req, res) => {
  const { customerId, invoice_no: current_invoice_no } = req.body;

  try {
    const transactions = await Transaction.find({
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
          { $inc: { qty: qty, out_qty: -qty } }, // Decrement qty field by decrementQty
          { new: true } // Return the updated document
        );
      })
    );

    const updateCustomerAccount = await Customer.findByIdAndUpdate(
      customerId,
      {
        $inc: {
          total: -Number(totalAmount),
          remaining: -Number(totalAmount) + Number(totalDiscount),
          discount: -Number(totalDiscount),
        },
      }, // Decrement qty field by decrementQty
      { new: true }
    );

    const deleteTransaction = await Transaction.deleteOne({
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
  CreateTransaction,
  GetTransactions,
  GetItemSummary,
  DeleteInvoice,
  CheckBillNumber,
};
