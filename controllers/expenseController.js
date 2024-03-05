const Expense = require("../Models/Expense");

const getAllExpenses = async (req, res, next) => {
  let expenses;
  const { shop, toDate, fromDate } = req.body;
  const startDate = new Date(fromDate);
  const endDate = new Date(toDate);
  console.log(startDate);
  console.log(endDate);
  try {
    const query = {
      shop,
      date: {
        $gte: startDate,
        $lte: endDate,
      },
    };
    expenses = await Expense.find(query);
  } catch (err) {
    console.log(err);
  }

  if (!expenses) {
    return res.status(404).json({ message: "No Expense Found" });
  }
  return res.status(200).json(expenses);
};

const addExpense = async (req, res, next) => {
  const { date, desc, expense, shop } = req.body;
  let exp;
  try {
    exp = new Expense({
      date: new Date(date),
      desc,
      expense,
      shop,
    });
    await exp.save();
  } catch (err) {
    console.log(err);
  }

  if (!exp) {
    return res.status(500).json({ message: "Unable to Add Expense" });
  }
  return res.status(201).json({ exp });
};

exports.getAllExpenses = getAllExpenses;
exports.addExpense = addExpense;
