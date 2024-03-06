const router = require("express").Router();
const authControllers = require("../controllers/authControllers");

router.post("/login", authControllers().login);
router.post("/logout", authControllers().logout);
router.post("/register", authControllers().register)
router.post("/refresh", authControllers().autoLogin);

module.exports = router;
