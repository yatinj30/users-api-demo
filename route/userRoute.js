const router = require("express").Router();
const userController = require("../controller/userController");

router.post("/login", userController.login);
router.post("/signup", userController.signup);
router.put("/change-password", userController.changePassword);

module.exports = router;