const commonFunction = require('../util/commonFunctions.js');
let dbCommon = require('../sqlmap/commonQuery.js');
let errorCodes = require('../util/errorCodes.js');
let errorCode = new errorCodes();
//Variables 
let id;
let name;
let exitReasonTypeId;
//
let courseExitReason;
let exitReasonType;

module.exports = require('express').Router().post('/',async(req,res) =>
{
    try
    {
        let reqData = commonFunction.trimSpaces(req.body);
        let authData = reqData.authData;
        
        if(reqData.id != undefined && reqData.name != undefined && reqData.exitReasonType != undefined)
        {
            if(reqData.id != "" && reqData.name != "" && reqData.exitReasonType.id != "")
            {
                id = commonFunction.validateNumber(reqData.id);
                name = reqData.name;
                exitReasonTypeId = commonFunction.validateNumber(reqData.exitReasonType.id);
                
                exitReasonType = await dbCommon.getExitReasonType(exitReasonTypeId);
                if(exitReasonType.length == 0)
                {
                    res.status(500)
                    return res.json({
                        "status_code" : 500,
                        "message" : "Invalid Exit Reason Type",
                        "success" : false,
                        "error" : errorCode.getStatus(500)
                    });
                }

                //check duplicate course exit reason   
                courseExitReason = await dbCommon.duplicateCourseExitReason(name, exitReasonTypeId, id);
                if(courseExitReason.length == 0)
                {                    
                    //update Course Exit Reason
                    let updateJSON = {
                        "id" : id,
                        "name" : name,
                        "exitReasonTypeId" : exitReasonTypeId,
                        "createdById" : authData.id
                    }
                    let updateCourseExitReasonResult = await dbCommon.updateCourseExitReason(updateJSON);
                    if(updateCourseExitReasonResult.affectedRows > 0)
                    {
                        res.status(200)
                        return res.json({
                            "status_code" : 200,
                            "success" : true,                            
                            "message" : errorCode.getStatus(200)
                        });
                    }
                    else
                    {
                        res.status(500)
                        return res.json({
                            "status_code" : 500,
                            "message" : "Course Exit Reason Not Saved",
                            "success" : false,
                            "error" : errorCode.getStatus(500)
                        });
                    }
                }
                else
                {
                    res.status(500)
                    return res.json({
                        "status_code" : 500,
                        "message" : "Course Exit Reason Already Exist",
                        "success" : false,
                        "error" : errorCode.getStatus(500)
                    });
                }
            }
            else
            {
                res.status(500)
                return res.json({
                    "status_code" : 500,
                    "message" : "Some Values Are Not Filled",
                    "success" : false,
                    "error" : errorCode.getStatus(500)
                });
            }
        }
        else
        {
            res.status(500)
            return res.json({
                "status_code" : 500,
                "message" : "JSON Error",
                "success" : false,
                "error" : errorCode.getStatus(500)
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
