const router = require("express").Router();
const TransactionController = require("../controllers/transaction-controllers");

router.post("/create", TransactionController.CreateTransaction);
router.post("/all", TransactionController.GetTransactions);

module.exports = router;
