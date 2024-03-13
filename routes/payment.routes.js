const router = require("express").Router();
const PaymentController = require("../controllers/payment-controller");

router.post("/create", PaymentController.addPayment);
router.get("/all", PaymentController.getAllPayments);
router.get("/branch", PaymentController.getBranchPayments);
router.patch("/update", PaymentController.updatePayment);
router.delete("/delete", PaymentController.deletePayment);

module.exports = router;
