const buildJSON = require('./buildCommonJSONs.js');
const commonFunction = require('../util/commonFunctions.js');
let dbCommon = require('../sqlmap/commonQuery.js');
let errorCodes = require('../util/errorCodes.js');
let errorCode = new errorCodes();
//Variables 
let subjectGroupId;
let academicSessionId;
let action;
//
let subjectGroupAllocations;

module.exports = require('express').Router().get('/:subjectGroupId/:optParam?*', async(req,res) =>
{
    try
    {
        academicSessionId = "";
        action = "";
        let tempParams = req.params.subjectGroupId;
        req.params[0] = req.params['optParam'] ? '/' + req.params['optParam'] + req.params[0] : req.params[0];
        tempParams = tempParams + (req.params[0].toString().indexOf("/") == -1 ? ("/" + req.params[0]) : req.params[0]);
        tempParams = tempParams.toString().split("/");
        

        if(tempParams.length == 1)
        {
            subjectGroupId = commonFunction.validateNumber(tempParams[0]);
        }
        else if(tempParams.length == 2)
        {
            subjectGroupId = commonFunction.validateNumber(tempParams[0]);
            action = tempParams[1];
        }
        else if(tempParams.length == 3)
        {
            subjectGroupId = commonFunction.validateNumber(tempParams[0]);
            action = tempParams[1];
            academicSessionId = commonFunction.validateNumber(tempParams[2]);
        }
            
        subjectGroupAllocations = await dbCommon.getSubjectGroupAllocations(subjectGroupId, academicSessionId, action);
        if(subjectGroupAllocations.length >= 0)
        {
            res.status(200)
            return res.json({
                "subjectGroupAllocations" : buildJSON.subjectGroupAllocations(subjectGroupAllocations),
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
