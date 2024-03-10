const router = require("express").Router();
const { VerifyUserCookie } = require("../Middleware/auth");
const authControllers = require("../controllers/authControllers");

router.post("/login", authControllers().login);
router.post("/logout", VerifyUserCookie, authControllers().logout);
router.post("/register", authControllers().register);
router.get("/refresh", authControllers().autoLogin);

module.exports = router;
