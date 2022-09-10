/**
 * This file has functions that will shape the response of api
 */


exports.sendResponse = (req, res, data, success, error, message, statusCode)=>{
    res.status(statusCode).json({data, success, error, message});
}