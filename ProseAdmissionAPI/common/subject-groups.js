const buildJSON = require('./buildCommonJSONs.js');
const commonFunction = require('../util/commonFunctions.js');
let dbCommon = require('../sqlmap/commonQuery.js');
let errorCodes = require('../util/errorCodes.js');
let errorCode = new errorCodes();
//Variables 
let syllabusId;
let gradeCategoryId;
let gradeId;
let action;
//
let subjectGroups;

module.exports = require('express').Router().get('/?*', async(req,res) =>
{
    try
    {
        syllabusId = "";
        gradeCategoryId = "";
        gradeId = "";
        action = "";

        let tempParams = req.params[0].split("/");

        if(tempParams.length == 1)
        {
            syllabusId = commonFunction.validateNumber(tempParams[0]);
        }
        else if(tempParams.length == 2)
        {
            syllabusId = commonFunction.validateNumber(tempParams[0]);
            gradeCategoryId = commonFunction.validateNumber(tempParams[1]);
        }
        else if(tempParams.length == 3)
        {
            syllabusId = commonFunction.validateNumber(tempParams[0]);
            gradeCategoryId = commonFunction.validateNumber(tempParams[1]);
            gradeId = commonFunction.validateNumber(tempParams[2]);
        }
        else if(tempParams.length == 4)
        {
            syllabusId = commonFunction.validateNumber(tempParams[0]);
            gradeCategoryId = commonFunction.validateNumber(tempParams[1]);
            gradeId = commonFunction.validateNumber(tempParams[2]);
            action = tempParams[3];
        }
            
        subjectGroups = await dbCommon.getSubjectGroups(syllabusId, gradeCategoryId, gradeId, action);
        if(subjectGroups.length >= 0)
        {
            res.status(200)
            return res.json({
                "subjectGroups" : buildJSON.subjectGroups(subjectGroups),
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
