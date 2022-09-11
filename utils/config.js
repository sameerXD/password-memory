require("dotenv").config()

const devPort = process.env.DEV_PORT;
const port =  process.env.PORT;
const accessTokenSecret = process.env.accessTokenSecret;
const email = process.env.email;
const password = process.env.password;
const db_username = process.env.db_username;
const db_password = process.env.db_password;
const db_uri = process.env.db_uri;

module.exports = {
    devPort,
    accessTokenSecret,
    email,
    password,
    db_password,
    db_username,
    db_uri,
    port
}