require("dotenv").config()

const devPort = process.env.DEV_PORT;
const accessTokenSecret = process.env.accessTokenSecret;
const email = process.env.email;
const password = process.env.password;

module.exports = {
    devPort,
    accessTokenSecret,
    email,
    password
}