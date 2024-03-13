const router = require("express").Router();
const ItemController = require("../controllers/item-controller");

router.post("/create", ItemController.addItem);
router.get("/all", ItemController.getAllItems);
router.get("/branch", ItemController.getBranchItems);
router.patch("/update", ItemController.updateItem);
router.delete("/delete", ItemController.deleteItem);

module.exports = router;
