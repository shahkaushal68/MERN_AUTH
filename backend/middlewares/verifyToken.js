const { unAuthorized } = require("../helper/response");
const jwt = require('jsonwebtoken');

const validToken = (req,res,next) => {
    let token = req.headers.authorization
    if (!token) {
        return res.send(unAuthorized("Token is Required!"));
    }
    token = req.headers.authorization.replace('Bearer ', '');
    if (token) {
        jwt.verify(token, process.env.PRIVATE_KEY, function (err, decoded) {
            //console.log("err",err);
            if (err) return res.send(unAuthorized("Token is Invalid"));
            if (decoded) {
            //console.log(decoded);
            req.user = decoded;
            next();
            }
        });
    } else {
        return res.send(unAuthorized("You are not authnticated"));
    }
       
}

module.exports = {validToken}