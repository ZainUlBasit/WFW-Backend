const CompanyTransaction = require("../Models/CompanyTransaction");

const addCompanyTransaction = async (req, res, next) => {
  let transaction;
  const {
    company_id,
    item_name,
    purchase,
    qty,
    desc,
    invoice,
    truck,
    date,
    total,
    shop,
  } = req.body;
  try {
    transaction = new CompanyTransaction({
      company_id,
      item_name,
      purchase,
      qty,
      desc,
      invoice,
      truck,
      date: new Date(date),
      total,
      shop,
    });
    await transaction.save();
  } catch (err) {
    console.log(err);
  }

  if (!transaction) {
    return res.status(500).json({ message: "Unable to Add Transaction...!" });
  }
  return res.status(201).json({ transaction });
};

const getCompanyTransaction = async (req, res, next) => {
  const { cid, sname, fromdate, todate } = req.body;
  const startDate = new Date(fromdate);
  const endDate = new Date(todate);
  let companyTransaction;
  try {
    if (sname === "Admin") {
      companyTransaction = await CompanyTransaction.find({
        companyid: cid,
        date: {
          $gte: startDate,
          $lte: endDate,
        },
      });
    } else {
      companyTransaction = await CompanyTransaction.find({
        companyid: cid,
        shop: sname,
        date: {
          $gte: startDate,
          $lte: endDate,
        },
      });
    }
    console.log(companyTransaction);
  } catch (err) {
    console.log(err);
  }

  if (!companyTransaction) {
    return res.status(404).json({ message: "No Item Found" });
  }
  return res.status(200).json(companyTransaction);
};

const getAllCompanyTransaction = async (req, res, next) => {
  const { sname } = req.body;
  console.log(sname);
  let companyTransaction;
  try {
    companyTransaction = await CompanyTransaction.find({ shop: sname });
    console.log(companyTransaction);
  } catch (err) {
    console.log(err);
  }

  if (!companyTransaction) {
    return res.status(404).json({ message: "No Item Found" });
  }
  return res.status(200).json(companyTransaction);
};

exports.addCompanyTransaction = addCompanyTransaction;
exports.getCompanyTransaction = getCompanyTransaction;
exports.getAllCompanyTransaction = getAllCompanyTransaction;
