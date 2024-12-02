const express = require('express');
const userRoute = express.Router();
let errorCodes = require('../util/errorCodes');
let errorCode = new errorCodes();
let uploads = require('../util/multerConfig.js');

///////Routes
userRoute.use('/authenticate', require('./authenticate.js'));
userRoute.use('/authenticateModuleUser', require('./authenticate-module-user.js'));
userRoute.use('/changePassword', require('../util/validateToken.js'), require('./change-password.js'));
userRoute.use('/signout', require('../util/validateToken.js'), require('./signout.js'));
userRoute.use('/getUser', require('../util/validateToken.js'), require('./user.js'));
userRoute.use('/getUsers', require('../util/validateToken.js'), require('./users.js'));
userRoute.use('/getModuleUsers', require('../util/validateToken.js'), require('./users-by-module.js'));
userRoute.use('/saveUser', uploads, require('./save-user.js'));
userRoute.use('/updateUser', require('../util/validateToken.js'), require('./update-user.js'));
userRoute.use('/deleteUser', require('../util/validateToken.js'), require('./delete-user.js'));
userRoute.use('/approveDenyUser', require('../util/validateToken.js'), require('./approve-deny-user.js'));
userRoute.use('/getUserModules', require('../util/validateToken.js'), require('./user-modules.js'));
userRoute.use('/saveUserModule', require('../util/validateToken.js'), require('./save-user-module.js'));
userRoute.use('/assignUserRoleTypeModule', require('../util/validateToken.js'), require('./assign-user-role-type-module.js'));
userRoute.use('/deleteUserModule', require('../util/validateToken.js'), require('./delete-user-module.js'));
userRoute.use('/approveDenyUserModule', require('../util/validateToken.js'), require('./approve-deny-user-module.js'));
userRoute.use('/updateStatus', require('../util/validateToken.js'), require('./update-status.js'));
userRoute.use('/getOnBoardingLinks', require('../util/validateToken.js'), require('./user-on-boarding-links.js'));
userRoute.use('/getOnBoardingLink', require('./user-on-boarding-link.js'));
userRoute.use('/saveOnBoardingLink', require('../util/validateToken.js'), require('./save-on-boarding-link.js'));
userRoute.use('/sendOnBoardingLink', require('../util/validateToken.js'), require('./send-user-on-boarding-link.js'));
userRoute.use('/deleteOnBoardingLink', require('../util/validateToken.js'), require('./delete-user-on-boarding-link.js'));

userRoute.use('/',(req,res,next) => 
{
    return res.status(400).json({
        "status_code" : 400,
        "message" : "Something went wrong",
        "status_name" : errorCode.getStatus(400),
        "error"     : "Wrong method or api"
    }) 
})
module.exports = userRoute