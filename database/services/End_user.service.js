endUserModel = require("../models/end_users").End_user;

const create = async(data)=>{
    const postData = await endUserModel.create(data);
    return postData
}

const getById = async(id)=>{
    const getData = await endUserModel.findByPk(id);

    return getData;
}

const getByEmail = async(email)=>{
    const getData = await endUserModel.findOne({
        where:{
            email:email
        }
    });

    return getData;
}

const updateById = async(id, updateData)=>{
    const putData = await endUserModel.update(updateData, {
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