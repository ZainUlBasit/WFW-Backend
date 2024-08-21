const router = require("express").Router();
const PaymentController = require("../controllers/payment-controller");

router.post("/create", PaymentController.addPayment);
router.post("/all", PaymentController.getAllPayments);
router.post("/branch", PaymentController.getBranchPayments);
router.post("/update", PaymentController.updatePayment);
router.post("/delete", PaymentController.deletePayment);
router.post("/delete-new", PaymentController.DeletePayment);

module.exports = router;
