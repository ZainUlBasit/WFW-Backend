const CustomerPayment = require("../Models/CustomerPayment");

const addCustomerPayment = async (req, res, next) => {
  let payment;
  console.log(req.body);
  const { custid, name, cash, accountno, date, description, shop } = req.body;
  try {
    payment = new CustomerPayment({
      custid,
      name,
      cash,
      accountno,
      date,
      description,
      shop,
    });
    await payment.save();
  } catch (err) {
    console.log(err);
  }

  if (!payment) {
    return res.status(500).json({ message: "Unable to Add Transaction...!" });
  }
  return res.status(201).json({ payment });
};

const getCustomerPayment = async (req, res, next) => {
  const { cid, sname, fromdate, todate } = req.body;
  console.log(req.body);
  const startDate = new Date(fromdate);
  const endDate = new Date(todate);
  console.log(req.body);
  let customersPayment;
  try {
    if (sname === "Admin") {
      customersPayment = await CustomerPayment.find({
        custid: cid,
        date: {
          $gte: startDate,
          $lte: endDate,
        },
      });
    } else {
      customersPayment = await CustomerPayment.find({
        custid: cid,
        shop: sname,
        date: {
          $gte: startDate,
          $lte: endDate,
        },
      });
    }
    console.log(customersPayment);
  } catch (err) {
    console.log(err);
  }

  if (!customersPayment) {
    return res.status(404).json({ message: "No Item Found" });
  }
  return res.status(200).json(customersPayment);
};

exports.addCustomerPayment = addCustomerPayment;
exports.getCustomerPayment = getCustomerPayment;
