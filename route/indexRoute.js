const router = require("express").Router();
const userRouter = require("./userRoute");

router.use("/user", userRouter);

module.exports = router;