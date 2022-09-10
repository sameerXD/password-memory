require("dotenv").config()

const devPort = process.env.DEV_PORT;
const accessTokenSecret = process.env.accessTokenSecret;

module.exports = {
    devPort,
    accessTokenSecret
}