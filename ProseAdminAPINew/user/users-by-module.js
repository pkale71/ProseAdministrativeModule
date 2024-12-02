const commonFunction = require('../util/commonFunctions.js');
const buildJSON = require('./buildUserJSONs.js');
let dbUser = require('../sqlmap/userQuery.js');
let errorCodes = require('../util/errorCodes.js');
let errorCode = new errorCodes();
////////Variables 
let moduleId;
//////
let moduleUsers;

module.exports = require('express').Router().get('/:moduleId',async(req,res) =>
{
    try
    {
        moduleId = '';

        moduleId = commonFunction.validateNumber(req.params?.moduleId);
        
    //////get module Users
        moduleUsers = await dbUser.getUsersByModule(moduleId);
        if(moduleUsers.length >= 0)
        {
            res.status(200)
            return res.json({
                "moduleUsers" : buildJSON.usersByModule(moduleUsers),
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
