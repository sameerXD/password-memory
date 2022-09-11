const Sequelize = require("sequelize");
const config = require('../utils/config');

const sequelize = new Sequelize('password_memory_auth', config.db_username, config.db_password, {
    host: config.db_uri,
    dialect: 'mysql',
    port:25060,
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  })
async function testConnection(){
    try {
        await sequelize.authenticate();
        console.log('Database connection has been established successfully.');
      } catch (error) {
        console.error('Unable to connect to the database:', error);
      }
}

testConnection();

module.exports = {
    sequelize
}

