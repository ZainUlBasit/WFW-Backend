const router = require("express").Router();
const CompanyController = require("../controllers/company-controller");

router.post("/create", CompanyController.CreateCompany);
router.get("/all", CompanyController.getAllCompanies);
router.get("/branch", CompanyController.getBranchCompanies);
router.patch("/update", CompanyController.updateCompany);
router.delete("/delete", CompanyController.deleteCompany);

module.exports = router;
