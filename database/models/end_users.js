const {sequelize} = require('../db');
const Sequelize = require('sequelize');

const End_user = sequelize.define('end_user', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      project_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      name: Sequelize.STRING,
      email:{
        type:Sequelize.STRING,
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
      role:{
        type:Sequelize.STRING,
        allowNull: false,
      },
      status:{
        type:Sequelize.INTEGER,
        allowNull: false,
        defaultValue:1
      }
});

module.exports = {
    End_user
}