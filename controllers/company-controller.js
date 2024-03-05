const Company = require("../Models/Company");
const CompanyPayment = require("../Models/CompanyPayment");

const getAllCompanies = async (req, res, next) => {
  const { shop } = req.body;
  console.log(req.body);
  let companies;
  try {
    if (shop === "Admin") companies = await Company.find();
    else companies = await Company.find({ shop });
  } catch (err) {
    console.log(err);
  }
  if (!companies) {
    return res.status(404).json({ message: "No Company Found...." });
  }
  return res.status(200).json(companies);
};

const addCompany = async (req, res, next) => {
  let company;
  const {
    name,
    email,
    contact,
    cnic,
    description,
    address,
    shop,
    total,
    paid,
    remaining,
  } = req.body;
  try {
    company = new Company({
      name,
      email,
      contact,
      cnic,
      description,
      address,
      shop,
      total,
      paid,
      remaining,
    });
    await company.save();
  } catch (err) {
    console.log(err);
  }

  if (!company) {
    return res.status(500).json({ message: "Unable to Add Company" });
  }
  return res.status(201).json({ company });
};

const updateCompany = async (req, res, next) => {
  const companyId = req.params.id;
  const { name, email, contact, cnic, description, address } = req.body;
  let company;
  try {
    company = await Company.findOneAndUpdate(
      { _id: companyId },
      {
        $set: {
          name: name,
          email: email,
          contact: contact,
          cnic: cnic,
          description: description,
          address: address,
        },
      },
      { new: true },
      (err, data) => {
        if (data === null) {
          return res.status(404).json({ message: "Company not found" });
        } else {
          return res.status(200).json({ company });
        }
      }
    );
  } catch (err) {}
};

const deleteCompany = async (req, res, next) => {
  const companyId = req.params.id;
  try {
    const delCompany = await Company.findByIdAndDelete(companyId);
    if (!companyId) {
      return res.status(400).json({ message: "Bad Request" });
    } else {
      return res.status(201).json({ delCompany });
    }
  } catch (err) {
    return res.status(500).json(err);
  }
};

const updateCompanyTotal = async (req, res, next) => {
  const companyid = req.params.id;
  const { ctotal } = req.body;
  let companyy;
  try {
    const filter = { _id: companyid };
    const update = { $inc: { total: ctotal, remaining: ctotal } };
    companyy = await Company.updateOne(
      filter,
      update,
      { new: true },
      (err, data) => {
        if (data === null) {
          return res.status(404).json({ message: "Item not found" });
        } else {
          return res.status(200).json({ companyy });
        }
      }
    );
  } catch (err) {
    console.log(err.message);
  }
};

const updateCompanyPayment = async (req, res, next) => {
  const companyName = req.params.id;
  const companyShop = req.params.id1;
  const { curTotal } = req.body;
  let companyy;
  try {
    const newRem = Number(curTotal) * -1;
    const filter = { _id: companyName, shop: companyShop };
    const update = { $inc: { remaining: newRem, paid: curTotal } };
    companyy = await Company.updateOne(
      filter,
      update,
      { new: true },
      (err, data) => {
        if (data === null) {
          return res.status(404).json({ message: "Item not found" });
        } else {
          return res.status(200).json({ companyy });
        }
      }
    );
  } catch (err) {
    console.log(err.message);
  }
};

const addCompanyPayment = async (req, res, next) => {
  let companyPayment;
  const { companyid, name, cash, accountno, date, description, shop } =
    req.body;
  try {
    companyPayment = new CompanyPayment({
      companyid,
      name,
      cash,
      accountno,
      date,
      description,
      shop,
    });
    await companyPayment.save();
  } catch (err) {
    console.log(err);
  }

  if (!companyPayment) {
    return res.status(500).json({ message: "Unable to Add Company" });
  }
  return res.status(201).json({ companyPayment });
};

const getCompanyPayment = async (req, res, next) => {
  const { cid, sname, fromdate, todate } = req.body;
  const startDate = new Date(fromdate);
  const endDate = new Date(todate);
  let companyPayment;
  try {
    companyPayment = await CompanyPayment.find({
      companyid: cid,
      shop: sname,
      date: {
        $gte: startDate,
        $lte: endDate,
      },
    });
  } catch (err) {
    console.log(err);
  }

  if (!companyPayment) {
    return res.status(500).json({ message: "Unable to Add Company" });
  }
  return res.status(201).json(companyPayment);
};

exports.getAllCompanies = getAllCompanies;
exports.addCompany = addCompany;
exports.updateCompany = updateCompany;
exports.deleteCompany = deleteCompany;
exports.updateCompanyTotal = updateCompanyTotal;
exports.addCompanyPayment = addCompanyPayment;
exports.getCompanyPayment = getCompanyPayment;
exports.updateCompanyPayment = updateCompanyPayment;
