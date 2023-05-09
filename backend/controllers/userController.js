const { successResponse, failResponse } = require("../helper/response");
const User = require("../models/userModel");

const getUserDetails = async (req,res) => {
    try {
        const userId = req.user.id;
        const userDetails = await User.findById(userId, "-password");
        //console.log("userId", userDetails);
        if(!userDetails) return res.send(failResponse("User is not Found"));
        res.send(successResponse("User Details fetch Successfully", userDetails));
    } catch (error) {
        console.log("get User Details", error);
        res.send(failResponse("_",{},error));
    }
}

module.exports = {getUserDetails} 