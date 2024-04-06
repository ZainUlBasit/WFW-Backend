const router = require("express").Router();
const PaymentController = require("../controllers/payment-controller");

router.post("/create", PaymentController.addPayment);
router.post("/all", PaymentController.getAllPayments);
router.post("/branch", PaymentController.getBranchPayments);
router.patch("/update", PaymentController.updatePayment);
router.delete("/delete", PaymentController.deletePayment);

module.exports = router;
