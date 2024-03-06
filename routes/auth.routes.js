const router = require("express").Router();
const auth = require("../Middleware/auth");
const authControllers = require("../controllers/authControllers");

router.post("/login", authControllers().login);
router.post("/logout", auth, authControllers().logout);
router.post("/register", authControllers().register);
router.post("/refresh", authControllers().autoLogin);

module.exports = router;
