const commonFunction = require('../util/commonFunctions.js');
const buildJSON = require('./buildUserJSONs.js');
let dbUser = require('../sqlmap/userQuery.js');
let errorCodes = require('../util/errorCodes.js');
let errorCode = new errorCodes();
////////Variables 
//////
let userSchoolSchoolingPrograms;

module.exports = require('express').Router().get('/:uuid/:moduleId',async(req,res) =>
{
    try
    {
        let uuid = req.params?.uuid;
        let moduleId = req.params?.moduleId;
        
    //////get userSchoolSchoolingPrograms
        userSchoolSchoolingPrograms = await dbUser.getUserSchoolSchoolingPrograms(uuid, moduleId);
        if(userSchoolSchoolingPrograms.length >= 0)
        {
            res.status(200)
            return res.json({
                "userSchoolSchoolingPrograms" : buildJSON.userSchoolSchoolingPrograms(userSchoolSchoolingPrograms),
                "status_code" : 200,
                "success" : true,                            
                "message" : errorCode.getStatus(200)
            })
        }
        else
        {
            res.status(500)
            return res.json({
                "status_code" : 500,
                "message" : "Invalid User",
                "success" : false,
                "error" : errorCode.getStatus(500)
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
