const serviceUserService = require('../../database/services/Service_user.service');
const {sendResponse} = require("../../utils/responseFunctions");
const userProjectService = require('../../database/services/User_projects.service');
const serviceUserFunctions = require('./service_user_functions');
const endUserService = require("../../database/services/End_user.service");

const {ValidationError} = require('sequelize');
var nodeEmoji = require('node-emoji')

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
        // if(getUser.email_auth==0) return sendResponse(req, res, {}, false, 'user is not authenticated', 'user email is not authenticated!', 400);

        const getProject = await userProjectService.getProjectByUserIdAndProjectName({name: req.body.projectName, service_user_id:req.user.id});
        
        if(getProject) return sendResponse(req, res, {}, false, 'project name already used', 'project name already used', 401); 
        let randomString;
        while(true){
            randomString = serviceUserFunctions.makeid(15);

            const getProjectBySecretId = await userProjectService.getBySecret(randomString);

            if(!getProjectBySecretId) break;
        }

        let encryptedSecret = await serviceUserFunctions.encryptPassword(randomString);


        const bodyData ={service_user_id: req.user.id,name:req.body.projectName, secret: encryptedSecret};

        const postData = await userProjectService.create(bodyData);

        return sendResponse(req, res, {secret: randomString}, true, '', 'Please do not share this secret', 200);

        
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
        if(payload == false) return sendResponse(req, res, {}, false, 'wrong jwt token', 'Wrong jwt token', 403);

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

// const generateProjectSecret = async(req, res, next)=>{
//     try{
//         const request_data = req.body;

//     }catch(err){
//         console.log(err);
//         if(err instanceof ValidationError){
//             return sendResponse(req, res, {}, false, err.errors[0].message, 'validation error', 400);
//         }
//         return sendResponse(req, res, {}, false, 'Internal server error', 'secret generation failed', 500);
//     }
// }

const getEmojiesForSignUp= async (req, res, next)=>{
    try{

        // emogi to unicode
        // let first = emojisList[0].codePointAt(0).toString(16);
        
        // unicode to emoji
        // let em = String.fromCodePoint(parseInt (first, 16));

        let emoji = req.query.emojiName;
        if(!emoji || emoji == '' || emoji == null) sendResponse(req, res, {}, true, '', '',200 );

        let result = nodeEmoji.search(emoji);
        return sendResponse(req, res, result, true, '', 'fetch list of emoji', 200);
    }catch(err){
    console.log(err);
    if(err instanceof ValidationError){
        return sendResponse(req, res, {}, false, err.errors[0].message, 'validation error', 400);
    }
    return sendResponse(req, res, {}, false, 'Internal server error', 'could not fetch emogies for signup', 500);
}
};

const savePatternUserPassword= async(req, res, next)=>{
    try{
        console.log(req.projectUser);
        const requestBodyParams = {
            project_id: req.projectUser.id,
            password:req.body.password,
            email:req.body.email,
            name:req.body.name,
            mobile:req.body.mobile,
            role: req.body.role
        };

        if(requestBodyParams.password==null || typeof(requestBodyParams.password)!='object'){
            return sendResponse(req, res, {}, false, 'password cannot be empty', 'password cannot be empty', 403);
        }

        if(requestBodyParams.password.length!=6){
            return sendResponse(req, res, {}, false, 'password length has to be 6', 'password length has to be 6', 403);
        }

        let password = "";
        requestBodyParams.password.forEach(x=>{password+=x});

        // encrypt password
        requestBodyParams.password = await serviceUserFunctions.encryptPassword(password);

        const postData = await endUserService.create(requestBodyParams);

        return sendResponse(req, res, postData, true, '', 'end user registered',200);

    }catch(err){
        console.log(err);
        if(err instanceof ValidationError){
            return sendResponse(req, res, {}, false, err.errors[0].message, 'validation error', 400);
        }
        return sendResponse(req, res, {}, false, 'Internal server error', 'could not fetch emogies for signup', 500);
    }
}

const matchPatternUserPassword= async(req, res, next)=>{
    try{
        console.log(req.projectUser);
        const requestBodyParams = {
            project_id: req.projectUser.id,
            password:req.body.password,
            email:req.body.email,
            name:req.body.name,
            mobile:req.body.mobile,
            role: req.body.role
        };

        if(requestBodyParams.password==null || typeof(requestBodyParams.password)!='object'){
            return sendResponse(req, res, {}, false, 'password cannot be empty', 'password cannot be empty', 403);
        }

        if(requestBodyParams.password.length!=6){
            return sendResponse(req, res, {}, false, 'password length has to be 6', 'password length has to be 6', 403);
        }

        let password = "";
        requestBodyParams.password.forEach(x=>{password+=x});

        const postData = await endUserService.getByEmailAndProjectID(requestBodyParams.email,req.projectUser.id);
        if(!postData)return sendResponse(req, res, postData, false, '', 'user not found ',404);

        // match encrypt password
        const passRes = serviceUserFunctions.comparePassword(password, postData.password);

        if(!passRes)return sendResponse(req, res, postData, false, '', 'wrong password ',401);
        return sendResponse(req, res, {accessToken:await serviceUserFunctions.createJwt({id:postData.id, email:postData.email, role:requestBodyParams.role})}, true, '', 'end user logged in ',200);

    }catch(err){
        console.log(err);
        if(err instanceof ValidationError){
            return sendResponse(req, res, {}, false, err.errors[0].message, 'validation error', 400);
        }
        return sendResponse(req, res, {}, false, 'Internal server error', 'could not fetch emogies for signup', 500);
    }
}

const getServiceUserProfile = async(req, res, next)=>{
    try{
        const getProfile = await serviceUserService.getById(req.user.id);
        if(!getProfile) return sendResponse(req, res, {}, false, 'user not found', 'user not found', 404);
        return sendResponse(req, res, getProfile, true, '','profile fetched', 200);
    }catch(err){
        console.log(err);
        if(err instanceof ValidationError){
            return sendResponse(req, res, {}, false, err.errors[0].message, 'validation error', 400);
        }
        return sendResponse(req, res, {}, false, 'Internal server error', 'could not fetch users profile', 500);
    }
}

const getServiceUserProjects = async(req, res, next)=>{
    try{
        const getProjects = await userProjectService.getProjectByServiceUserId(req.user.id);
        return sendResponse(req, res, getProjects, true, '','projects fetched', 200);

    }catch(err){
        console.log(err);
        if(err instanceof ValidationError){
            return sendResponse(req, res, {}, false, err.errors[0].message, 'validation error', 400);
        }
        return sendResponse(req, res, {}, false, 'Internal server error', 'could not fetch users projects', 500);
    }
}
module.exports = {
    registerUser,
    createProject,
    login,
    authenticateEmail,
    getEmojiesForSignUp,
    savePatternUserPassword,
    matchPatternUserPassword,
    getServiceUserProfile,
    getServiceUserProjects
}