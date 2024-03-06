const router = require("express").Router();
const SaleController = require("../controllers/sale-controller");

router.post("/create", SaleController.addSale);
router.get("/all", SaleController.GetAllSale);
router.get("/branch", SaleController.GetBranchSales);
router.patch("/update", SaleController.UpdateSales);
router.delete("/delete", SaleController.DeleteSale);

module.exports = router;
