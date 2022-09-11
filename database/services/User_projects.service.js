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

const getProjectByUserIdAndProjectName = async(data)=>{
    const getData = await userProjectModel.findOne({
        where:{
            name:data.name,
            service_user_id: data.service_user_id
        }
    });
    return getData;
}

const getProjectByServiceUserId = async(serviceUserId)=>{
    const getData = await userProjectModel.findAll({
        where:{
            service_user_id:serviceUserId
        }
    });
    return getData;
}
module.exports = {
    create,
    getBySecret,
    getProjectByUserIdAndProjectName,
    getProjectByServiceUserId
}