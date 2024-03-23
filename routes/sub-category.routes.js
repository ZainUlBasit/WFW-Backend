const router = require("express").Router();
const SubCategoryController = require("../controllers/subcategory-controllers");

router.post("/create", SubCategoryController.addSubCategory);
router.get("/all", SubCategoryController.getAllSubCategories);
router.get("/branch", SubCategoryController.getBranchSubCategories);
router.patch("/update", SubCategoryController.updateSubCategory);
router.delete("/delete/:id", SubCategoryController.deleteSubCategory);
router.post("/edit-sub-cat", SubCategoryController.GetTriForEdit);

module.exports = router;
