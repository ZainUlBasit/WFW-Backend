const router = require("express").Router();
const {
  VerifyUserCookie,
  VerifyBranch,
  VerifyBranchId,
  VerifyAdmin,
} = require("../Middleware/auth");
const CompanyController = require("../controllers/company-controller");

router.post(
  "/create",
  VerifyUserCookie,
  VerifyBranch,
  VerifyBranchId,
  CompanyController.CreateCompany
);
router.get(
  "/all",
  VerifyUserCookie,
  VerifyAdmin,
  CompanyController.getAllCompanies
);
router.get(
  "/branch",
  VerifyUserCookie,
  VerifyBranch,
  VerifyBranchId,
  CompanyController.getBranchCompanies
);
router.patch(
  "/update",
  VerifyUserCookie,
  VerifyBranch,
  VerifyBranchId,
  CompanyController.updateCompany
);
router.delete(
  "/delete",
  VerifyUserCookie,
  VerifyBranch,
  VerifyBranchId,
  CompanyController.deleteCompany
);

module.exports = router;
