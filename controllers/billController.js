const BillNo = require("../Models/BillNo");

const updateBillNo = async (req, res, next) => {
  const { shop } = req.body;
  let billno;
  try {
    const billFilter = { shop: shop };
    const billUpdate = { $inc: { currentbillno: 1 } };
    billno = BillNo.updateOne(billFilter, billUpdate, (err, result) => {
      if (err) {
        console.error("Failed to increment value:", err);
        res.status(500).send("Failed to increment value");
      } else {
        res.send("Bill number incremented...!");
      }
    });
  } catch (err) {
    console.log(err);
  }
};

const getCurrentBill = async (req, res, next) => {
  let billno;
  try {
    billno = await BillNo.find();
  } catch (err) {
    console.log(err);
  }

  if (!billno) {
    return res.status(404).json({ message: "No category found...!" });
  }
  return res.status(200).json(billno);
};

exports.updateBillNo = updateBillNo;
exports.getCurrentBill = getCurrentBill;
