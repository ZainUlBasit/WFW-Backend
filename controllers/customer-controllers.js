const bcrypt = require("bcrypt");
const CusDto = require("../Services/CustomerDTO");
const Joi = require("joi");
const { createError, successMessage } = require("../utils/ResponseMessage");
const Customer = require("../Models/Customer");
const { isValidObjectId } = require("mongoose");

//******************************************************
// working
//******************************************************
const getAllCustomers = async (req, res, next) => {
  let customers;
  try {
    customers = await Customer.find();
    if (!customers) return createError(res, 404, "No Item Found");
    return successMessage(res, customers, null);
  } catch (err) {
    console.log(err);
    return createError(res, 500, err.message || err);
  }
};
const getBranchCustomers = async (req, res, next) => {
  const { branch } = req.body;

  const CustomerSchema = Joi.object({
    branch: Joi.number().required(),
  });

  const { error } = CustomerSchema.validate(req.body.values);
  if (error) return createError(res, 422, error.message);

  let customers;
  try {
    customers = await Customer.find({ branch });
    if (!customers) return createError(res, 404, "No Item Found");
    return successMessage(res, customers, null);
  } catch (err) {
    console.log(err);
    return createError(res, 500, err.message || err);
  }
};
const UpdateCustomer = async (req, res, next) => {
  const { customerId, payload } = req.body;
  const reqStr = Joi.string().required();
  const reqNum = Joi.number().required();
  const customerPayloadSchema = Joi.object({
    name: reqStr,
    email: reqStr,
    password: reqStr,
    cnic: reqStr,
    contact: reqStr,
    address: reqStr,
    branch: reqNum,
    ref: reqStr,
    page: reqNum,
  });
  const CustomerUpdateSchema = Joi.object({
    itemId: reqStr,
    payload: Joi.object().min(1).required().keys(customerPayloadSchema),
  });
  // check if the validation returns error
  const { error } = CustomerUpdateSchema.validate(req.body.values);
  if (error) return createError(res, 422, error.message);
  try {
    let customer = await Customer.findById(customerId);
    if (!customer)
      return createError(res, 404, "Customer with such id was not found!");
    // Update item properties
    Object.assign(customer, payload);
    // Save the updated item
    await customer.save();
    return successMessage(res, customer, "Customer Successfully Updated!");
  } catch (err) {
    console.log(err);
    return createError(res, 500, err.message || err);
  }
};
const deleteCustomer = async (req, res, next) => {
  const { customerId } = req.body;

  const CustomerSchema = Joi.object({
    customerId: Joi.string().required(),
  });
  const { error } = CustomerSchema.validate(req.body.values);
  if (error) return createError(res, 422, error.message);

  if (!isValidObjectId(customerId))
    return createError(res, 422, "Invalid Customer Id!");

  try {
    const DeleteCustomer = await Company.findByIdAndDelete(customerId);
    if (!DeleteCustomer)
      return createError(
        res,
        400,
        "Such Customer with customerId does not exist!"
      );
    else
      return successMessage(
        res,
        DeleteCustomer,
        `Item ${DeleteCustomer.name} is successfully deleted!`
      );
  } catch (err) {
    return createError(res, 500, err.message || err);
  }
};
//******************************************************
// working
//******************************************************
const CheckCustomers = async (req, res, next) => {
  const { email, password } = req.body;
  let customers;
  try {
    customers = await Customer.findOne({ email });
    // check email
    if (!customers) {
      return res.status(422).json({ message: "Email or password incorrect" });
    }
    // check password
    const isMatch = await bcrypt.compare(password, customers.password);
    if (!isMatch) {
      return res.status(403).json({ message: "Email or password incorrect" });
    }
    const cusData = CusDto(customers);
    // send data to frontend if available
    return res.status(201).json(cusData);
  } catch (err) {
    console.log(err);
  }

  if (!customers) {
    return res.status(404).json({ message: "No Item Found" });
  }
  return res.status(200).json(customers);
};
//******************************************************
// working
//******************************************************
const addCustomer = async (req, res, next) => {
  let customer;
  console.log(req.body);
  const { name, email, password, contact, cnic, address, branch, ref, page } =
    req.body;

  // schema validation
  const reqStr = Joi.string().required();
  const reqNum = Joi.number().required();
  const defNum = Joi.number().default(0);

  const customerSchema = Joi.object({
    name: reqStr,
    email: reqStr,
    password: reqStr,
    cnic: reqStr,
    contact: reqStr,
    address: reqStr,
    branch: reqNum,
    ref: reqStr,
    page: reqNum,
  });

  const { error } = customerSchema.validate(req.body.values);
  if (error) return createError(res, 422, error.message);

  customer = await Customer.exists({ email });
  if (customer) {
    return createError(res, 409, "Email already registered!");
  }

  try {
    customer = await new Customer({
      name,
      email,
      password,
      contact,
      cnic,
      address,
      branch,
      ref,
      page,
    }).save();

    if (!customer) return createError(res, 400, "Unable to Add Customer!");
    return successMessage(res, customer, "Customer Successfully Added!");
  } catch (err) {
    console.log(err);
    return createError(res, 500, err.message || err);
  }
};

module.exports = {
  getBranchCustomers,
  getAllCustomers,
  UpdateCustomer,
  deleteCustomer,
  addCustomer,
  CheckCustomers,
};
