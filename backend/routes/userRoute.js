const express = require('express');
const { getUserDetails } = require('../controllers/userController');
//const { userLog } = require('../helper/validatorSchema');
//const { joiValidate } = require('../middlewares/validate');
const router = express.Router();
//const validator = require('express-joi-validation').createValidator({});
const {validToken} = require("../middlewares/verifyToken");

router.get('/user-details', validToken,  getUserDetails);

module.exports = router