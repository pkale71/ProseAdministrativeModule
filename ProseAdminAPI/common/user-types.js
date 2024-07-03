const commonFunction = require('../util/commonFunctions.js');
const buildJSON = require('./buildCommonJSONs.js');
let dbCommon = require('../sqlmap/commonQuery.js');
let errorCodes = require('../util/errorCodes.js');
let errorCode = new errorCodes();
////////Variables 
let moduleId;
let userRoleId;
let action;
//////
let userTypes;

module.exports = require('express').Router().get('/?*',async(req,res) =>
{
    try
    {
        moduleId = '';
        userRoleId = '';
        action = '';

        if(req.params)
        {
            let tempParams = req.params[0].split("/");
            if(tempParams.length == 1)
            {
                moduleId = commonFunction.validateNumber(tempParams[0]);
            }
            else if(tempParams.length == 2)
            {
                moduleId = commonFunction.validateNumber(tempParams[0]);
                userRoleId = commonFunction.validateNumber(tempParams[1]);
            }
            else if(tempParams.length == 3)
            {
                moduleId = commonFunction.validateNumber(tempParams[0]);
                userRoleId = commonFunction.validateNumber(tempParams[1]);
                action = tempParams[2];
            }
        }
    //////get userTypes
        userTypes = await dbCommon.getUserTypes(moduleId, userRoleId, action);
        if(userTypes.length >= 0)
        {
            res.status(200)
            return res.json({
                "userTypes" : buildJSON.userTypes(userTypes),
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
