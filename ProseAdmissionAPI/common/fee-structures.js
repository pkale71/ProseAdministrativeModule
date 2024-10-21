const buildJSON = require('./buildCommonJSONs.js');
const commonFunction = require('../util/commonFunctions.js');
let dbCommon = require('../sqlmap/commonQuery.js');
let errorCodes = require('../util/errorCodes.js');
let errorCode = new errorCodes();
//Variables 
let schoolUUID;
let schoolingProgramId;
let academicSessionId;
let batchYearId;
let syllabusId;
let gradeCategoryId;
let action;
//
let feeStructures;

module.exports = require('express').Router().get('/:schoolUUID/:schoolingProgramId/:academicSessionId/:batchYearId/:syllabusId/:gradeCategoryId/:optParam?*', async(req,res) =>
{
    try
    {
        schoolUUID = "";
        schoolingProgramId = "";
        academicSessionId = "";
        batchYearId = "";
        syllabusId = "";
        gradeCategoryId = "";
        action = '';

        let tempParams = req.params?.schoolUUID + '/' + req.params?.schoolingProgramId + '/' + req.params?.academicSessionId + '/' + req.params?.batchYearId + '/' + req.params?.syllabusId + '/' + req.params?.gradeCategoryId;

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
            schoolingProgramId = commonFunction.validateNumber(tempParams[1]);
        }
        else if(tempParams.length == 3)
        {
            schoolUUID = tempParams[0];
            schoolingProgramId = commonFunction.validateNumber(tempParams[1]);
            academicSessionId = commonFunction.validateNumber(tempParams[2]);
        }
        else if(tempParams.length == 4)
        {
            schoolUUID = tempParams[0];
            schoolingProgramId = commonFunction.validateNumber(tempParams[1]);
            academicSessionId = commonFunction.validateNumber(tempParams[2]);
            batchYearId = commonFunction.validateNumber(tempParams[3]);
        }
        else if(tempParams.length == 5)
        {
            schoolUUID = tempParams[0];
            schoolingProgramId = commonFunction.validateNumber(tempParams[1]);
            academicSessionId = commonFunction.validateNumber(tempParams[2]);
            batchYearId = commonFunction.validateNumber(tempParams[3]);
            syllabusId = commonFunction.validateNumber(tempParams[4]);
        }
        else if(tempParams.length == 6)
        {
            schoolUUID = tempParams[0];
            schoolingProgramId = commonFunction.validateNumber(tempParams[1]);
            academicSessionId = commonFunction.validateNumber(tempParams[2]);
            batchYearId = commonFunction.validateNumber(tempParams[3]);
            syllabusId = commonFunction.validateNumber(tempParams[4]);
            gradeCategoryId = commonFunction.validateNumber(tempParams[5]);
        }
        else if(tempParams.length == 7)
        {
            schoolUUID = tempParams[0];
            schoolingProgramId = commonFunction.validateNumber(tempParams[1]);
            academicSessionId = commonFunction.validateNumber(tempParams[2]);
            batchYearId = commonFunction.validateNumber(tempParams[3]);
            syllabusId = commonFunction.validateNumber(tempParams[4]);
            gradeCategoryId = commonFunction.validateNumber(tempParams[5]);
            action = tempParams[6];
        }
        
        feeStructures = await dbCommon.getFeeStructures(schoolUUID, schoolingProgramId, academicSessionId, batchYearId, syllabusId, gradeCategoryId, action);
        if(feeStructures.length >= 0)
        {
            res.status(200)
            return res.json({
                "feeStructures" : buildJSON.feeStructures(feeStructures),
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
