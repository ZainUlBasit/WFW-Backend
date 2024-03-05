const moment = require("moment/moment");
const CustomerTransaction = require("../Models/CustomerTransaction");
//******************************************************
// working
//******************************************************
const addManyCustomerTransaction = async (req, res, next) => {
  let transaction;
  let { data } = req.body;
  data = data.map((dt) => {
    return {
      ...dt,
      date: new Date(dt.date),
    };
  });
  try {
    transaction = await CustomerTransaction.insertMany(data);
  } catch (err) {
    console.log(err);
  }

  if (!transaction) {
    return res.status(500).json({ message: "Unable to Add Transaction...!" });
  }
  return res.status(201).json({ transaction });
};
const addCustomerTransaction = async (req, res, next) => {
  let transaction;
  let {
    customerid,
    shop,
    date,
    billNo,
    name,
    qty,
    unitprice,
    purchase,
    total,
  } = req.body;
  date = new Date(date);
  try {
    transaction = new CustomerTransaction({
      customerid,
      shop,
      date,
      billNo,
      name,
      qty,
      unitprice,
      purchase,
      total,
    });
    console.log(transaction);
    await transaction.save();
  } catch (err) {
    console.log(err);
  }

  if (!transaction) {
    return res.status(500).json({ message: "Unable to Add Transaction...!" });
  }
  return res.status(201).json({ transaction });
};
//******************************************************
// working
//******************************************************
const deleteCustomerTransaction = async (req, res, next) => {
  const billNo = req.params.id;
  const customerid = req.params.id1;
  try {
    const delItem = CustomerTransaction.deleteMany(
      { billNo, customerid },
      (err, result) => {
        if (err) {
          console.error("Failed to delete documents:", err);
          return;
        }
        console.log("Documents deleted successfully");
        console.log("Deleted documents:", result.deletedCount);
        return res.status(201).json(result);
      }
    );
  } catch (err) {
    console.log(err.message);
  }
};
//******************************************************
// working
//******************************************************
const getCustomerTransaction = async (req, res, next) => {
  const { cid, sname, fromdate, todate } = req.body;
  const startDate = new Date(fromdate);
  const endDate = new Date(todate);
  let customersTransaction;
  try {
    if (sname === "Admin") {
      customersTransaction = await CustomerTransaction.find({
        customerid: cid,
        date: {
          $gte: startDate,
          $lte: endDate,
        },
      });
    } else {
      customersTransaction = await CustomerTransaction.find({
        customerid: cid,
        shop: sname,
        date: {
          $gte: startDate,
          $lte: endDate,
        },
      });
    }
    console.log(customersTransaction);
  } catch (err) {
    console.log(err);
  }

  if (!customersTransaction) {
    return res.status(404).json({ message: "No Item Found" });
  }
  return res.status(200).json(customersTransaction);
};
//******************************************************
// working
//******************************************************
const getAllCustomerTransaction = async (req, res, next) => {
  const { sname } = req.body;
  let customersTransaction;
  try {
    if (sname === "Admin")
      customersTransaction = await CustomerTransaction.find({});
    else customersTransaction = await CustomerTransaction.find({ shop: sname });
  } catch (err) {
    console.log(err);
  }

  if (!customersTransaction) {
    return res.status(404).json({ message: "No Item Found" });
  }
  return res.status(200).json(customersTransaction);
};
const getAllTransactionSortedByDate = async (req, res, next) => {
  const { sname } = req.body;
  let customersTransaction;
  try {
    if (sname === "Admin")
      customersTransaction = await CustomerTransaction.find({}).sort({
        date: 1,
      });
    else customersTransaction = await CustomerTransaction.find({ shop: sname });
  } catch (err) {
    console.log(err);
  }

  if (!customersTransaction) {
    return res.status(404).json({ message: "No Item Found" });
  }
  return res.status(200).json(customersTransaction);
};
const getAllTransactionSortedByBillNo = async (req, res, next) => {
  const { sname } = req.body;
  let customersTransaction;
  try {
    if (sname === "Admin")
      customersTransaction = await CustomerTransaction.find({}).sort({
        billNo: -1,
      });
    else customersTransaction = await CustomerTransaction.find({ shop: sname });
  } catch (err) {
    console.log(err);
  }

  if (!customersTransaction) {
    return res.status(404).json({ message: "No Item Found" });
  }
  return res.status(200).json(customersTransaction);
};

exports.addCustomerTransaction = addCustomerTransaction;
exports.addManyCustomerTransaction = addManyCustomerTransaction;
exports.deleteCustomerTransaction = deleteCustomerTransaction;
exports.getCustomerTransaction = getCustomerTransaction;
exports.getAllCustomerTransaction = getAllCustomerTransaction;
exports.getAllTransactionSortedByDate = getAllTransactionSortedByDate;
exports.getAllTransactionSortedByBillNo = getAllTransactionSortedByBillNo;
