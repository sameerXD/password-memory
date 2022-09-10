const express = require('express');
const router = express.Router();
const serviceUserController = require('../controller/service_user/service_user.controller');
const {authenticateJWT} = require('../middleware/serviceUser');
router.post('/registerServiceUser', serviceUserController.registerUser);
router.post('/login', serviceUserController.login);
router.post('/createProject', authenticateJWT ,serviceUserController.createProject);
router.put('/emailAuth', serviceUserController.authenticateEmail);

module.exports = router;