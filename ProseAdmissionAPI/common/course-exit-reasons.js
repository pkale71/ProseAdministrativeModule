const buildJSON = require('./buildCommonJSONs.js');
const commonFunction = require('../util/commonFunctions.js');
let dbCommon = require('../sqlmap/commonQuery.js');
let errorCodes = require('../util/errorCodes.js');
let errorCode = new errorCodes();
//Variables 
let exitReasonTypeId;
let action;
//
let courseExitReasons;

module.exports = require('express').Router().get('/?*', async(req,res) =>
{
    try
    {
        exitReasonTypeId = '';
        action = '';

        let tempParams = req.params[0].split("/");
        if(tempParams.length == 1)
        {
            exitReasonTypeId = commonFunction.validateNumber(tempParams[0]);
            action = tempParams[1];
        }
        else if(tempParams.length == 2)
        {
            exitReasonTypeId = commonFunction.validateNumber(tempParams[0]);
            action = tempParams[1];
        }
                
        courseExitReasons = await dbCommon.getCourseExitReasons(exitReasonTypeId, action);
        if(courseExitReasons.length >= 0)
        {
            res.status(200)
            return res.json({
                "courseExitReasons" : buildJSON.courseExitReasons(courseExitReasons),
                "status_code" : 200,
                "success" : true,                            
                "message" : errorCode.getStatus(200)
            });
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
});
