const jwt = require('jsonwebtoken');
const config = require('../utils/config');
const {sendResponse} = require('../utils/responseFunctions');

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

module.exports = {
    authenticateJWT
}