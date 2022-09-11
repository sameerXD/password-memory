const jwt = require('jsonwebtoken');
const config = require('../utils/config');
const {sendResponse} = require('../utils/responseFunctions');
const userProjectService = require("../database/services/User_projects.service");
const serviceUserFunctions = require("../controller/service_user/service_user_functions");
const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        jwt.verify(authHeader, config.accessTokenSecret, (err, user) => {
            if (err) {
                // wrong jwt 
                return sendResponse(req, res, {}, false, 'Wrong jwt passed', 'faulty jwt', 403);
            }

            req.user = user;
            next();
        });
    } else {
        return sendResponse(req, res, {}, false, 'No jwt found in header', 'No jwt found in header', 401);
    }
};

const projectAuth = async(req, res, next)=>{
            // auth the service user 

            let getProject = await userProjectService.getProjectByUserIdAndProjectName({projectName:req.body.projectName, userId:req.body.userId});

            if(!getProject) return sendResponse(req, res, {}, false,  'project not found', 'project not found', 404);
    
            // compare secrets of project
    
            const secretRes = await serviceUserFunctions.comparePassword(req.body.projectSecret, getProject.secret);
    
            if(!secretRes) return  sendResponse(req, res, {}, false, 'auth failed', 'wrong project secret', 403);
            req.projectUser = getProject;
            next();
}

module.exports = {
    authenticateJWT,
    projectAuth
}