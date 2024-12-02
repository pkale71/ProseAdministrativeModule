const commonFunction = require('../util/commonFunctions.js');
const buildJSON = require('./buildUserJSONs.js');
let dbUser = require('../sqlmap/userQuery.js');
let errorCodes = require('../util/errorCodes.js');
let errorCode = new errorCodes();
////////Variables 
let uuid;
let moduleId;
let action;
//////
let userModules;

module.exports = require('express').Router().get('/:userUUID/:optParam?*',async(req,res) =>
{
    try
    {
        let action = '';
        let moduleId = '';
        let tempParams = req.params?.userUUID;
        req.params[0] = req.params['optParam'] ? '/' + req.params['optParam'] + req.params[0] : req.params[0];
        tempParams = tempParams + (req.params[0].toString().indexOf("/") == -1 ? ("/" + req.params[0]) : req.params[0]);
        
        uuid = tempParams[0];
        if(tempParams.length == 2)
        {
            action = tempParams[1];
        }
        if(tempParams.length == 3)
        {
            action = tempParams[1];
            moduleId = commonFunction.validateNumber(tempParams[2]);
        }
    //////get userModules
        userModules = await dbUser.getUserModules(uuid, action, moduleId);
        if(userModules.length >= 0)
        {
            res.status(200)
            return res.json({
                "userModules" : buildJSON.userModules(userModules),
                "status_code" : 200,
                "success" : true,                            
                "message" : errorCode.getStatus(200)
            })
        }      
    } 
    catch(e)
    {
        res.status(500)
        return res.json({
            "status_code" : 500,
            "message" : e,
            "success" : false,
            "error" : "Something Went Wrong",
        });
    }
})
