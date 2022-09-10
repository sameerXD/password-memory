const serviceUserModel = require('../models/Service_users.model').Service_user;

const create = async(data)=>{
    const postData = await serviceUserModel.create(data);
    return postData
}

const getById = async(id)=>{
    const getData = await serviceUserModel.findByPk(id);

    return getData;
}

const getByEmail = async(email)=>{
    const getData = await serviceUserModel.findOne({
        where:{
            email:email
        }
    });

    return getData;
}

const updateById = async(id, updateData)=>{
    const putData = await serviceUserModel.update(updateData, {
        where:{
            id:id
        }
    });

    return putData;
}



module.exports = {
    create,
    getById,
    getByEmail,
    updateById

}