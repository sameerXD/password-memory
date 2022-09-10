const serviceUserService = require('../../database/services/Service_user.service');
const {sendResponse} = require("../../utils/responseFunctions");
const userProjectService = require('../../database/services/User_projects.service');
const serviceUserFunctions = require('./service_user_functions');
const {ValidationError} = require('sequelize');
const registerUser = async(req, res, next)=>{
    try{
        const bodyData = req.body; 

        // validate password 
        const validatePassword = serviceUserFunctions.passValidator(bodyData.password);
        if(validatePassword!= true) return sendResponse(req, res, validatePassword, false, 'password is weak', 'password validation failed', 400);

        // encrypt password
        bodyData.password = await serviceUserFunctions.encryptPassword(bodyData.password);
        const postData = await serviceUserService.create(bodyData);
        return sendResponse(req, res, postData, true, '', 'service user created', 200);
    }catch(err){
        console.log(err);
        if(err instanceof ValidationError){
            return sendResponse(req, res, {}, false, err.errors[0].message, 'validation error', 400);
        }
        return sendResponse(req, res, {}, false, 'Internal server error', 'service user not created', 500);
    }
}

const login = async(req, res, next)=>{
    try{
        const bodyData = req.body; 

        const getUser = await serviceUserService.getByEmail(bodyData.email);

        if(!getUser) return sendResponse(req, res, {}, false, 'user do not exist', 'no user with this id found', 404);

        // compare password hash
        const passRes = serviceUserFunctions.comparePassword(bodyData.password, getUser.password);

        if(!passRes) return sendResponse(req, res, {}, false, 'Wrong password', 'password didnt match', 404);

        // create access token
        return sendResponse(req, res, {accessToken:await serviceUserFunctions.createJwt({id:getUser.id, email:getUser.email, role:'SERVICEUSER'})}, true, '', 'Login successfull', 200);
    }catch(err){
        console.log(err);
        if(err instanceof ValidationError){
            return sendResponse(req, res, {}, false, err.errors[0].message, 'validation error', 400);
        }
        return sendResponse(req, res, {}, false, 'Internal server error', 'login failed', 500);
    }
}
const createProject = async(req, res, next)=>{
    try{
        const getUser = await serviceUserService.getById(req.user.id);
        if(!getUser) return sendResponse(req, res, {}, false, 'user do not exist', 'no user with this id found', 404);
        if(getUser.email_auth==0) return sendResponse(req, res, {}, false, 'user is not authenticated', 'user email is not authenticated!', 400);


        let randomString;
        while(true){
            randomString = serviceUserFunctions.makeid(15);

            const getProjectBySecretId = await userProjectService.getBySecret(randomString);

            if(!getProjectBySecretId) break;
        }

        const bodyData ={service_user_id: req.user.id, secret: randomString};

        const postData = await userProjectService.create(bodyData);

        return sendResponse(req, res, postData, true, '', 'Please do not share this secret', 200);

        
    }catch(err){
        console.log(err);
        if(err instanceof ValidationError){
            return sendResponse(req, res, {}, false, err.errors[0].message, 'validation error', 400);
        }
        return sendResponse(req, res, {}, false, 'Internal server error', 'project not created', 500);
    }
}

const authenticateEmail = async(req, res, next)=>{
    try{
        let token = req.query.token;
        let payload = serviceUserFunctions.decryptJwt(token);
        if(payload == false) sendResponse(req, res, {}, false, 'wrong jwt token', 'Wrong jwt token', 403);

        const updatePayload = {
            email_auth : 1
        }

        const putData = serviceUserService.updateById(payload.id, updatePayload);

        return sendResponse(req, res, {}, true, '', 'Please do not share this secret', 200);

    }catch(err){
        console.log(err);
        if(err instanceof ValidationError){
            return sendResponse(req, res, {}, false, err.errors[0].message, 'validation error', 400);
        }
        return sendResponse(req, res, {}, false, 'Internal server error', 'email not authenticated', 500);
    }
}
module.exports = {
    registerUser,
    createProject,
    login,
    authenticateEmail
}