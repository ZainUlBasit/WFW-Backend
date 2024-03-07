const Joi = require("joi");
const Company = require("../Models/Company");
const { createError, successMessage } = require("../utils/ResponseMessage");

const getAllCompanies = async (req, res, next) => {
  let companies;
  try {
    companies = await Company.find();
  } catch (err) {
    console.log(err);
    return createError(res, 400, "Internal Server Error. Please Try Again!");
  }
  if (!companies) {
    return createError(res, 404, "Companies record not found!");
  }
  return successMessage(res, companies, null);
};
const getBranchCompanies = async (req, res, next) => {
  const { branch } = req.body;

  const companySchema = Joi.object({
    branch: Joi.number().required(),
  });

  const { error } = companySchema.validate(req.body.values);
  if (error) return createError(res, 422, error.message);

  let companies;
  try {
    companies = await Company.find({ branch });
  } catch (err) {
    console.log(err);
    return createError(res, 400, "Internal Server Error. Please Try Again!");
  }
  if (!companies) {
    return createError(res, 404, "Companies record not found!");
  }
  return successMessage(res, companies, null);
};

const CreateCompany = async (req, res) => {
  let company;
  const { name, email, contact, cnic, description, address, branch } = req.body;
  console.log(req.body);

  const companySchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    contact: Joi.string().required(),
    cnic: Joi.string().required(),
    description: Joi.string().required(),
    address: Joi.string().required(),
    branch: Joi.string().required(),
  });

  const { error } = companySchema.validate(req.body);
  if (error) {
    return createError(res, 422, error.message);
  }

  try {
    company = await new Company({
      name,
      email,
      contact,
      cnic,
      description,
      address,
      branch,
    }).save();
  } catch (err) {
    console.log(err);
    return createError(res, 400, "Internal Server Error. Please Try Again!");
  }
  if (!company) {
    return createError(res, 400, "Unable to Add Company!");
  }
  return successMessage(res, company, "Company Successfully Added!");
};

const updateCompany = async (req, res, next) => {
  // const companyId = req.params.id;
  const { companyId, payload } = req.body;
  // check the payload
  const reqStr = Joi.string().required();
  const reqNum = Joi.number().required();
  const companyPayloadSchema = Joi.object({
    name: reqStr,
    email: reqStr.email(),
    contact: reqStr,
    cnic: reqStr,
    description: reqStr,
    address: reqStr,
    branch: reqNum,
  });
  const CompanyUpdateSchema = Joi.object({
    companyId: reqStr,
    payload: Joi.object().min(1).required().keys(companyPayloadSchema),
  });
  // check if the validation returns error
  const { error } = CompanyUpdateSchema.validate(req.body.values);
  if (error) {
    return createError(res, 422, error.message);
  }
  let company;
  try {
    // find company by id
    company = await Company.findById(companyId);
    // if company not found
    if (!company)
      return createError(res, 404, "Company with such id was not found!");

    // Update company properties
    Object.assign(company, payload);
    // Save the updated company
    await company.save();
    return successMessage(res, company, "Company Successfully Updated!");
  } catch (err) {
    return createError(res, 500, error.message || error);
  }
};

const deleteCompany = async (req, res, next) => {
  const { companyId } = req.body;
  if (!companyId) return createError(res, 422, "Invalid Company Id!");
  try {
    const delCompany = await Company.findByIdAndDelete(companyId);
    if (!delCompany)
      return createError(
        res,
        400,
        "Such Company with companyId does not exist!"
      );
    return successMessage(
      res,
      delCompany,
      `Company ${delCompany.name} is successfully deleted!`
    );
  } catch (error) {
    return createError(res, 500, error.message || error);
  }
};

// all done crud operation

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

module.exports = {
  getAllCompanies,
  getBranchCompanies,
  CreateCompany,
  updateCompany,
  deleteCompany,
  updateCompanyTotal,
  addCompanyPayment,
  getCompanyPayment,
  updateCompanyPayment,
};
