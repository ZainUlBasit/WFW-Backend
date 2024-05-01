const router = require("express").Router();
const CategoryController = require("../controllers/category-controllers");

router.post("/create", CategoryController.addCategory);
router.get("/all", CategoryController.getAllCategories);
router.get("/branch/:id", CategoryController.getBranchCategories);
router.patch("/update", CategoryController.updateCategory);
router.delete("/delete/:id", CategoryController.deleteCategory);

module.exports = router;
