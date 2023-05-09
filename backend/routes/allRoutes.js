const express = require('express');
const router = express.Router();

const authRouter = require("./authRoute");
const userRouter = require("./userRoute");

// router.use("/v1", require("./v1/index"));
router.use('/v1/auth', authRouter);
router.use('/v1/user', userRouter);


module.exports =router