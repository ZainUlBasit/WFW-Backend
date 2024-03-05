const CustomerReturn = require("../Models/CustomerReturn");

const addCustomerReturn = async (req, res, next) => {
  let Return;
  console.log(req.body);
  const {
    customerid,
    customer,
    shop,
    date,
    billNo,
    name,
    qty,
    unitprice,
    total,
  } = req.body;
  try {
    Return = new CustomerReturn({
      customerid,
      customer,
      shop,
      date,
      billNo,
      name,
      qty,
      unitprice,
      total,
    });
    await Return.save();
  } catch (err) {
    console.log(err);
  }

  if (!Return) {
    return res.status(500).json({ message: "Unable to Add Return...!" });
  }
  return res.status(201).json({ Return });
};

const GetReturns = async (req, res, next) => {
  const { cname, sname } = req.body;
  let customersReturn;
  try {
    customersReturn = await CustomerReturn.find({
      customerid: cname,
      shop: sname,
    });
    console.log("Data");
    console.log(customersReturn);
  } catch (err) {
    console.log(err);
  }

  if (!customersReturn) {
    return res.status(404).json({ message: "No Item Found" });
  }
  return res.status(200).json(customersReturn);
};

exports.addCustomerReturn = addCustomerReturn;
exports.GetReturns = GetReturns;
