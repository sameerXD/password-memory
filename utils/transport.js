import nodemailer from "nodemailer";
import Locals from './locals';
// const nodemailer = require("nodemailer");

const config = require('./config');
const hostname= "smtp.gmail.com";
const username= config.email;
const password= config.password;

const transporter = nodemailer.createTransport({
    host: hostname,
    port: 465,
    secure: true,
    requireTLS: true,
    auth: {
        user: username,
        pass: password,
    },
    logger: true
})

export default transporter