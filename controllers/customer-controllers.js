const Customer = require("../Models/Customer");
const CustomerPayment = require("../Models/CustomerPayment");
const bcrypt = require("bcrypt");
const CusDto = require("../Services/CustomerDTO");

//******************************************************
// working
//******************************************************
const getAllCustomers = async (req, res, next) => {
  const { shop } = req.body;
  let customers;
  try {
    if (shop === "Admin") customers = await Customer.find();
    else customers = await Customer.find({ shop: shop });
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
  const { fullname, email, password, contact, cnic, address, shop, ref, page } =
    req.body;
  const cust = await Customer.exists({ email });
  if (cust) {
    return res.status(409).json({ message: "Email already registered" });
  }
  try {
    customer = new Customer({
      fullname,
      email,
      password,
      contact,
      cnic,
      address,
      shop,
      ref,
      page,
      discount: 0,
      paid: 0,
      remaining: 0,
      total: 0,
    });
    await customer.save();
  } catch (err) {
    console.log(err);
  }

  if (!customer) {
    return res.status(500).json({ message: "Unable to Add Customer" });
  }
  return res.status(200).json(customer);
};

// *****************************************************
// *****************************************************
const AddNewProperty = async (req, res, next) => {
  const { id } = req.body;
  try {
    // Define the new property and its value to be added
    let duedate;
    let returndate;
    let newValue = new Date();
    const update = { duedate: newValue, returndate: newValue };

    // Use `updateMany()` to add the new property to all documents in the "items" collection
    const updateResult = await Customer.findOneAndUpdate({ _id: id }, update, {
      new: true,
    });
    if (!updateResult) res.status(404).json("Customer Not found");
    else res.status(200).json({ updateResult });
    console.log("Update Result:", updateResult);
  } catch (error) {
    console.error("Error updating documents:", error);
  }
};
// xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
// xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
//******************************************************
// working
//******************************************************
const updateCustomerTotal = async (req, res, next) => {
  const customerID = req.params.id;
  const { curTotal, curDiscount } = req.body;
  let customer;
  try {
    const filter = { _id: customerID };
    const increments = {
      total: curTotal,
      remaining: curTotal,
      discount: curDiscount,
    };
    const update = { $inc: increments };
    customer = await Customer.updateOne(
      filter,
      update,
      { new: true },
      (err, data) => {
        if (data === null) {
          return res.status(404).json({ message: "Customer not found" });
        } else {
          return res.status(200).json({ customer });
        }
      }
    );
  } catch (err) {
    console.log(err.message);
  }
};
//******************************************************
// working
//******************************************************
const updateCustomerPayment = async (req, res, next) => {
  const customerid = req.params.id;
  const customershop = req.params.id1;
  const { newPaid } = req.body;
  let customer;
  try {
    const filter = { _id: customerid, shop: customershop };
    const newRem = newPaid * -1;
    const increments = {
      remaining: newRem,
      paid: newPaid,
    };
    const update = { $inc: increments };
    customer = await Customer.updateOne(
      filter,
      update,
      { new: true },
      (err, data) => {
        if (data === null) {
          return res.status(404).json({ message: "Customer not found" });
        } else {
          return res.status(200).json({ customer });
        }
      }
    );
  } catch (err) {
    console.log(err.message);
  }
};
//******************************************************
// working
//******************************************************
const addCustomerPayment = async (req, res, next) => {
  let customerPayment;
  const { custid, name, cash, accountno, date, description, shop } = req.body;
  try {
    customerPayment = new CustomerPayment({
      custid,
      name,
      cash,
      accountno,
      date,
      description,
      shop,
    });
    await customerPayment.save();
  } catch (err) {
    console.log(err);
  }

  if (!customerPayment) {
    return res.status(500).json({ message: "Unable to Add Company" });
  }
  return res.status(201).json({ customerPayment });
};
//******************************************************
// working
//******************************************************
const getCustomerPayment = async (req, res, next) => {
  const { cid, sname, fromdate, todate } = req.body;
  console.log(req.body);
  const startDate = new Date(fromdate);
  const endDate = new Date(todate);
  let customerPayment;
  const filter = { custid: cid, shop: sname };
  try {
    if (sname === "Admin") {
      customerPayment = await CustomerPayment.find({
        custid: cid,
        date: {
          $gte: startDate,
          $lte: endDate,
        },
      });
    } else {
      customerPayment = await CustomerPayment.find({
        custid: cid,
        shop: sname,
        date: {
          $gte: startDate,
          $lte: endDate,
        },
      });
    }
  } catch (err) {
    console.log(err);
  }

  if (!customerPayment) {
    return res.status(500).json({ message: "Unable to Add Company" });
  }
  return res.status(201).json(customerPayment);
};

exports.getAllCustomers = getAllCustomers;
exports.addCustomer = addCustomer;
exports.AddNewProperty = AddNewProperty;
exports.updateCustomerTotal = updateCustomerTotal;
exports.addCustomerPayment = addCustomerPayment;
exports.getCustomerPayment = getCustomerPayment;
exports.updateCustomerPayment = updateCustomerPayment;
exports.CheckCustomers = CheckCustomers;
