"use strict";
const nodemailer = require("nodemailer");

const sendMail = async (email, subject, text, html) => {
    try {
        let transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: 587,
            secure: false,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        await transporter.sendMail({
            from: process.env.EMAIL_USER, // sender address
            to: email, // list of receivers
            subject: subject, // Subject line
            text: text, // plain text body
            html: html, // html body
        });
        //console.log("email sent successfully");
    } catch (error) {
        //console.log("email not sent");
        console.log("send mail error", error);
    }
}
module.exports = {sendMail}