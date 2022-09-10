const {sequelize} = require('../db');
const Sequelize = require('sequelize');

const Service_user = sequelize.define('service_user', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: Sequelize.STRING,
      email:{
        type:Sequelize.STRING,
        unique: true
      },
      mobile:{
        type:Sequelize.STRING,
        unique: true
      },
      password:{
        type:Sequelize.STRING,
        allowNull: false,
      },
    //   to check if his email has been authenticated
      email_auth:{
        type:Sequelize.INTEGER,
        allowNull: false,
        defaultValue:0
      },
});

module.exports = {
    Service_user
}