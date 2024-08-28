const commonFunction = require('../util/commonFunctions.js');
const buildJSON = require('./buildCommonJSONs.js');
let dbCommon = require('../sqlmap/commonQuery.js');
let errorCodes = require('../util/errorCodes.js');
let errorCode = new errorCodes();
////////Variables
let moduleId;
let action; 
//////
let userRoles;

module.exports = require('express').Router().get('/?*',async(req,res) =>
{
    try
    {
        moduleId = '';
        action = '';

        let tempParams = req.params[0].split("/");
        if(tempParams.length == 1)
        {
            moduleId = commonFunction.validateNumber(tempParams[0]);
        }
        else if(tempParams.length == 2)
        {
            moduleId = commonFunction.validateNumber(tempParams[0]);
            action = tempParams[1];
        }
    //////get userRoles
        userRoles = await dbCommon.getUserRoles(moduleId, action);
        if(userRoles.length >= 0)
        {
            res.status(200)
            return res.json({
                "userRoles" : buildJSON.userRoles(userRoles),
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
            "message" : "Something Went Wrong",
            "success" : false,
            "error" : e
        });
    }
})
