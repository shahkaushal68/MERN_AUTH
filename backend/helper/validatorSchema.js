const Joi = require('joi');

const userLog = Joi.object({
    userName: Joi.string(),
    email: Joi.string().email().lowercase().required(),
    password: Joi.string()
        .min(8)
        .required()
        .pattern(new RegExp("(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[-+_!@#$%^&*., ?])"))
        .messages({
            "any.required": "Password is mandatory.",
            "string.empty": "Password is mandatory",
        }),
});

const resestPassword = Joi.object({
    currentPassword: Joi.string().required(),
    newPassword:Joi.string()
    .min(8)
        .required()
        .pattern(new RegExp("(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[-+_!@#$%^&*., ?])"))
        .messages({
            "any.required": "Password is mandatory.",
            "string.empty": "Password is mandatory",
        }),
});

module.exports = {userLog, resestPassword}