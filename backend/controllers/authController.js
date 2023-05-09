const User = require("../models/userModel");
const bcrypt = require("bcryptjs"); 
const jwt = require('jsonwebtoken');
const {failResponse, successResponse, validationError, unAuthorized} = require('../helper/response');
const Token = require("../models/tokenModel");
const { sendMail } = require("../helper/sendMail");


//----------------------------------------For Registration Logic----------------------
const register = async (req,res) => {
    try {
        //console.log("req.body", req.body);
        //-------------------check email exist or not? ---------------
        const existingUser = await User.findOne({email:req.body.email});
        if(existingUser) return res.send(validationError("This email is already Register"));
        //--------------------------Convert passsword into Hash Password-------------------------
        const hashPassword = await bcrypt.hash(req.body.password, 10);
        //----------------Save new user in user table--------------------------------
        const newUser = await new User({...req.body, password: hashPassword}).save();
        //console.log("newUser", newUser);
        //--------------------Generate token------------------------------------------
        let token = jwt.sign({id:newUser._id}, process.env.PRIVATE_KEY, {expiresIn:"1d"});
        //console.log("token", token);
        //------------------Save Token into the token table------------------------
        const saveToken = await new Token({userId:newUser._id, token:token}).save();
        //console.log("saveToken", saveToken);
        //------------------create verification link for sending into the mail-----------------
        const verifyLink = `"http://localhost:3000/verify-email/${saveToken.token}"`
        await sendMail(newUser.email,"Registration Verification", "", `'<p>For Verify Email address, Please <a href=${verifyLink}>Click here</a> to </p>'`);
        res.send(successResponse("User Registration Successfully", newUser));
    } catch (error) {
        console.log("error", error);
        res.send(failResponse("_",{},error));
    }
}

//----------------------------------For Login Logic------------------------------------

const login = async (req,res) => {
    try {
        //console.log("req.body", req.body);
        const existingUser = await User.findOne({email:req.body.email});
        if(!existingUser) return res.send(failResponse("This email is not Register"));
        const comparePassword = await bcrypt.compare(req.body.password, existingUser.password);
        if(!comparePassword) return res.send(failResponse("Email / Password is wrong"));
        console.log("existingUser", existingUser);
        if(!existingUser.isVerify) return res.send(failResponse("This email is not Verify! Please verify email first"));
        if(existingUser?.isVerify === true && comparePassword){
            const token = jwt.sign({id:existingUser._id}, process.env.PRIVATE_KEY, {expiresIn:"1d"});
            await Token.findOneAndUpdate({userId:existingUser._id}, {token:token}, {new:true});
            //console.log("updateToken", updateToken);
            
            res.send(successResponse("User Successfully Login", {existingUser, token}));
        }
       
    } catch (error) {
        //console.log("error", error);
        res.send(failResponse("_",{},error));
    }
}

//----------------------------For Verify Email Logic------------------------------------

const verifyUser = async (req,res) => {
    try {
        const token = req.params.token;
        //console.log("token", token);
        if(!token) return res.send(validationError("Invalid Token"));
        const decoded = jwt.verify(token, process.env.PRIVATE_KEY);
        //console.log("decoded", decoded);
        const user = await User.findById(decoded.id);
        if(!user) return res.send(validationError("Invalid Link"));
        //console.log("user", user);
        if(user.tmpEmail !== '' && user.tmpEmailIsVerify === false){
            if(user.tmpEmailIsVerify === true) return res.send(unAuthorized("This Link is not Longer Available"))
            await User.findByIdAndUpdate(user._id, {email:user.tmpEmail, tmpEmailIsVerify:true, tmpEmail:''});
            res.send(successResponse("Email Verify Successfully"));
        }else{
            if(user.isVerify === true) return res.send(unAuthorized("This Link is not Longer Available"));
            await User.findByIdAndUpdate(user._id, {isVerify: true, tmpEmailIsVerify:true});
            res.send(successResponse("Email Verify Successfully"));
        }
    } catch (error) {
         //console.log("Verify User error", error);
         res.send(failResponse("_",{},error));
    }
}

//-------------------------------If Token is expire the send Link on email again Logic------------------------------------

const sendVefiryMailAgain  = async (req,res) => {
    try {
        const token = req.params.token
        //const recreatToken  = 
    } catch (error) {
        console.log("Again Verify User error", error);
        res.send(failResponse("_",{},error));
    }
}

//------------------------Change Password Logic-----------------------------

const changePassword = async(req,res) => {
    const {currentPassword, newPassword} = req.body;
    try {
        const user = await User.findById(req.user.id);
        if(!user) return res.send(failResponse("User is not found"));
        if(!currentPassword && !newPassword) return res.send(validationError("Please first Enter Both Password!"));
        const comparePassword = await bcrypt.compare(currentPassword, user.password);
        if(!comparePassword) return res.send(validationError("Current password isnot correct"));
        if(comparePassword){
            const newHasPass = await bcrypt.hash(newPassword, 10);
            await User.findByIdAndUpdate(req.user.id, {password: newHasPass});
            res.send(successResponse("Passowrd change Successfully"));
        }
    } catch (error) {
        //console.log("Reset Password", error);
        res.send(failResponse("_",{},error));
    }
}

//------------------------Change Email Logic-----------------------------

const changeEmail = async (req,res) => {
    try {
        const {currentPassword, newEmail} = req.body;
        const user = await User.findById(req.user.id);
        if(!user) return res.send(failResponse("User is not found"));
        if(!currentPassword && !newEmail) return res.send(validationError("Please first Enter Both Password and NewEmail!"));
        const comparePassword = await bcrypt.compare(currentPassword, user.password);
        if(!comparePassword) return res.send(validationError("Current password isnot correct"));
        if(newEmail === user.email) return res.send(validationError("This email already working! Please enter new email"));
        const updatedEmail = await User.findByIdAndUpdate(user._id, {tmpEmail: newEmail, tmpEmailIsVerify:false}, {new:true});
        let token = jwt.sign({id:user._id, email:user.email}, process.env.PRIVATE_KEY, {expiresIn:"1d"});
        //console.log("token", token);
        //------------------Save Token into the token table------------------------
        //const saveToken = await new Token.findOneAndUpdate({userId:user._id, token:token}).save();
        const saveToken = await Token.findOneAndUpdate({userId:user._id}, {token:token}, {new:true});
        console.log("saveToken", saveToken);
        //------------------create verification link for sending into the mail-----------------
        const verifyLink = `"http://localhost:3000/verify-email/${saveToken.token}"`;
        await sendMail(updatedEmail.tmpEmail, "Email Verification", "", `'<p>For Verify Email address, Please <a href=${verifyLink}>Click here</a> to </p>'`);
        res.send(successResponse("Email has been updated successfully! Please Verify email first", updatedEmail));
    } catch (error) {
        console.log("Reset email", error);
        res.send(failResponse("_",{},error));
    }
}


module.exports = {register, login, verifyUser, changePassword, changeEmail}