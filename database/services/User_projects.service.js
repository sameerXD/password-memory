const userProjectModel = require('../models/User_projects.model').User_project;

const create = async(data)=>{
    const postData = await userProjectModel.create(data);
    return postData
}
const getBySecret= async(secret)=>{
    const getData = await userProjectModel.findOne({
        where:{
            secret:secret
        }
    });

    return getData;
}

module.exports = {
    create,
    getBySecret
}