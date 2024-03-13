const router = require("express").Router();
const ReportController = require("../controllers/expenseController");

router.post("/create", ReportController.addExpense);
router.get("/all", ReportController.getAllExpenses);
router.get("/branch", ReportController.getBranchExpenses);
router.delete("/delete", ReportController.deleteExpense);

module.exports = router;
