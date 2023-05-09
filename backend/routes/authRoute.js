const express = require('express');
const { register, login, verifyUser, changePassword, changeEmail } = require('../controllers/authController');
const { userLog, resestPassword } = require('../helper/validatorSchema');
const { joiValidate } = require('../middlewares/validate');
const { validToken } = require('../middlewares/verifyToken');
const router = express.Router();
//const validator = require('express-joi-validation').createValidator({});

router.post('/register', joiValidate(userLog), register);
router.post('/login', login);
router.get("/verifyUser/:token", verifyUser);
router.post("/changePassword", joiValidate(resestPassword), validToken, changePassword);
router.post("/changeEmail", validToken, changeEmail);
  
module.exports = router