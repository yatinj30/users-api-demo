const router = require("express").Router();
const userController = require("../controller/userController");
const userValidation = require("../validation/userValidation");

router.post("/login", userValidation.loginValidation, userController.login);
router.post("/signup", userValidation.signUpValidation, userController.signup);
router.put("/change-password", userValidation.changePasswordValidation, userController.changePassword);

module.exports = router;