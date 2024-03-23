const router = require("express").Router();
const SaleReturnController = require("../controllers/sale-return-controller");

router.post("/create", SaleReturnController.CreateTransaction);
// router.get("/all", SaleReturnController.GetAllSale);
// router.get("/branch", SaleReturnController.GetBranchSales);
// router.patch("/update", SaleReturnController.UpdateSales);
// router.delete("/delete", SaleReturnController.DeleteSale);

module.exports = router;
