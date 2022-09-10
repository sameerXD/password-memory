const {sequelize} = require('../db');
const Sequelize = require('sequelize');
const {Service_user} = require('./Service_users.model');

const User_project = sequelize.define('user_project', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      service_user_id:{
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      secret:{
        type:Sequelize.STRING,
        allowNull: false,
        unique: true
      },

});

// one to many relationship with service user
Service_user.hasMany(User_project, {
    foreignKey:'service_user_id'
});

module.exports = {
    User_project
}