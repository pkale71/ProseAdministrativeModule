const buildJSON = require('./buildCommonJSONs.js');
const commonFunction = require('../util/commonFunctions.js');
let dbCommon = require('../sqlmap/commonQuery.js');
let errorCodes = require('../util/errorCodes.js');
let errorCode = new errorCodes();
//Variables 
let schoolUUID;
let academicSessionId;
let syllabusId;
let gradeCategoryId;
let gradeId;
let batchTypeId;
let action;
//
let gradeSections;

module.exports = require('express').Router().get('/:schoolUUID/:academicSessionId/:syllabusId/:gradeCategoryId/:gradeId/:optParam?*', async(req,res) =>
{
    try
    {
        schoolUUID = "";
        academicSessionId = "";
        syllabusId = "";
        gradeCategoryId = "";
        gradeId = "";
        batchTypeId = "";
        action = "";

        let tempParams = req.params?.schoolUUID + '/' + req.params?.academicSessionId + '/' + req.params?.syllabusId + '/' + req.params?.gradeCategoryId + '/' + req.params?.gradeId;


        req.params[0] = req.params['optParam'] ? '/' + req.params['optParam'] + req.params[0] : req.params[0];
        tempParams = tempParams + (req.params[0].toString().indexOf("/") == -1 ? ("/" + req.params[0]) : req.params[0]);
        tempParams = tempParams.toString().split("/");

        if(tempParams.length == 1)
        {
            schoolUUID = tempParams[0];
        }
        else if(tempParams.length == 2)
        {
            schoolUUID = tempParams[0];
            academicSessionId = commonFunction.validateNumber(tempParams[1]);
        }
        else if(tempParams.length == 3)
        {
            schoolUUID = tempParams[0];
            academicSessionId = commonFunction.validateNumber(tempParams[1]);
            syllabusId = commonFunction.validateNumber(tempParams[2]);
        }
        else if(tempParams.length == 4)
        {
            schoolUUID = tempParams[0];
            academicSessionId = commonFunction.validateNumber(tempParams[1]);
            syllabusId = commonFunction.validateNumber(tempParams[2]);
            gradeCategoryId = commonFunction.validateNumber(tempParams[3]);
        }
        else if(tempParams.length == 5)
        {
            schoolUUID = tempParams[0];
            academicSessionId = commonFunction.validateNumber(tempParams[1]);
            syllabusId = commonFunction.validateNumber(tempParams[2]);
            gradeCategoryId = commonFunction.validateNumber(tempParams[3]);
            gradeId = commonFunction.validateNumber(tempParams[4]);
        }
        else if(tempParams.length == 6)
        {
            schoolUUID = tempParams[0];
            academicSessionId = commonFunction.validateNumber(tempParams[1]);
            syllabusId = commonFunction.validateNumber(tempParams[2]);
            gradeCategoryId = commonFunction.validateNumber(tempParams[3]);
            gradeId = commonFunction.validateNumber(tempParams[4]);
            batchTypeId = commonFunction.validateNumber(tempParams[5]);
        }
        else if(tempParams.length == 7)
        {
            schoolUUID = tempParams[0];
            academicSessionId = commonFunction.validateNumber(tempParams[1]);
            syllabusId = commonFunction.validateNumber(tempParams[2]);
            gradeCategoryId = commonFunction.validateNumber(tempParams[3]);
            gradeId = commonFunction.validateNumber(tempParams[4]);
            batchTypeId = commonFunction.validateNumber(tempParams[5]);
            action = tempParams[6];
        }
    
        gradeSections = await dbCommon.getGradeSections(schoolUUID, academicSessionId, syllabusId, gradeCategoryId, gradeId, batchTypeId, action);
        if(gradeSections.length >= 0)
        {
            res.status(200)
            return res.json({
                "gradeSections" : buildJSON.gradeSections(gradeSections),
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
