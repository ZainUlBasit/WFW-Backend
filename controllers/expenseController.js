const Expense = require("../Models/Expense");
const { createError, successMessage } = require("../utils/ResponseMessage");

const getAllExpenses = async (req, res, next) => {
  const { fromDate = 0, toDate = Math.floor(Date.now() / 1000) } = req.body;
  const startDate = Math.floor(new Date(fromDate) / 1000);
  const endDate = Math.floor(new Date(toDate) / 1000);
  let expenses;
  try {
    expenses = await Expense.find({
      date: {
        $gte: startDate,
        $lte: endDate,
      },
    });
    if (!expenses) return createError(res, 404, "No Expense Found");
    return successMessage(res, expenses, null);
  } catch (err) {
    console.log(err);
    return createError(res, 500, err.message || err);
  }
};
const getBranchExpenses = async (req, res, next) => {
  const {
    branch,
    fromDate = 0,
    toDate = Math.floor(Date.now() / 1000),
  } = req.body;
  const startDate = Math.floor(new Date(fromDate) / 1000);
  const endDate = Math.floor(new Date(toDate) / 1000);
  if (!branch) return createError(res, 422, "Invalid Branch #");
  let expenses;
  try {
    expenses = await Expense.find({
      branch,
      date: {
        $gte: startDate,
        $lte: endDate,
      },
    });
    if (!expenses) return createError(res, 404, "No Expense Found");
    return successMessage(res, expenses, null);
  } catch (err) {
    console.log(err);
  }
};
const addExpense = async (req, res, next) => {
  const {
    date = Math.floor(Date.now() / 1000),
    desc,
    expense,
    branch,
  } = req.body;

  const reqStr = Joi.string().required();
  const reqNum = Joi.number().required();

  const ExpenseSchema = Joi.object({
    date: Joi.number().default(Math.floor(Date.now() / 1000)),
    desc: reqStr,
    expense: reqNum,
    branch: reqNum,
  });

  const { error } = ExpenseSchema.validate(req.body.values);
  if (error) {
    return createError(res, 422, error.message);
  }

  let newExpense;
  try {
    newExpense = await new Expense({
      date: new Date(date),
      desc,
      expense,
      branch,
    }).save();
    if (!newExpense) return createError(res, 400, "Unable to add Expense!");
    return successMessage(res, newExpense, "Expense Successfully Added!");
  } catch (err) {
    console.log(err);
    return createError(res, 500, err.message || err);
  }
};

const deleteExpense = async (req, res, next) => {
  const { expneseId } = req.body;
  if (!expneseId) return createError(res, 422, "Invalid Expense Id!");
  try {
    const DeleteExpense = await Expense.findByIdAndDelete(expneseId);
    if (!DeleteExpense)
      return createError(
        res,
        400,
        "Such Expense with expenseId does not exist!"
      );
    return successMessage(
      res,
      DeleteExpense,
      `Expense ${DeleteExpense._id} is successfully deleted!`
    );
  } catch (err) {
    console.log(err);
    return createError(res, 500, err.message || err);
  }
};

module.exports = {
  getBranchExpenses,
  getAllExpenses,
  addExpense,
  deleteExpense,
};
