const Bank = require("../Models/Bank");

const AddBank = async (req, res, next) => {
  const { bankname, accountno, shop } = req.body;
  let newBank;
  try {
    newBank = new Bank({
      bankname,
      accountno,
      amount: 0,
      shop,
    });
    await newBank.save();
  } catch (err) {
    console.log(err);
  }
  if (!newBank) {
    return res.status(500).json({ message: "Unable to Add Bank" });
  }
  return res.status(201).json({ newBank });
};

const GetBank = async (req, res, next) => {
  console.log(req.body);
  let banks;
  try {
    banks = await Bank.find();
  } catch (err) {
    console.log(err);
  }
  if (!banks) {
    return res.status(404).json({ message: "No Bank Found...." });
  }
  return res.status(200).json(banks);
};

const AddAmount = async (req, res, next) => {
  const { bankid, amount } = req.body;
  let bank;
  try {
    const filter = { _id: bankid };
    const update = { $inc: { amount: amount } };

    bank = await Bank.updateOne(filter, update, { new: true }, (err, data) => {
      if (data === null) {
        return res.status(404).json({ message: "Account not found" });
      } else {
        return res.status(200).json({ bank });
      }
    });
  } catch (err) {
    console.log(err.message);
  }
};

exports.AddBank = AddBank;
exports.GetBank = GetBank;
exports.AddAmount = AddAmount;
