const buildJSON = require('./buildAdmissionJSONs.js');
const commonFunction = require('../util/commonFunctions.js');
let dbCommon = require('../sqlmap/commonQuery.js');
let dbAdmission = require('../sqlmap/admissionQuery.js');
let errorCodes = require('../util/errorCodes.js');
let errorCode = new errorCodes();
//Variables 
let applicationFor;
let schoolUUID;
let schoolingProgramId;
let academicSessionId;
let studyCenterUUID;
let statusId;
//
let applicationForms;

module.exports = require('express').Router().get('/:applicationFor/:schoolUUID/:schoolingProgramId/:academicSessionId/:optParam?*', async(req,res) =>
{
    try
    {
        studyCenterUUID = "";
        statusId = '';

        let tempParams = req.params?.applicationFor + "/" + req.params?.schoolUUID + "/" + req.params?.schoolingProgramId + "/" + req.params?.academicSessionId;
        req.params[0] = req.params['optParam'] ? '/' + req.params['optParam'] + req.params[0] : req.params[0];
        tempParams = tempParams + (req.params[0].toString().indexOf("/") == -1 ? ("/" + req.params[0]) : req.params[0]);
        
        tempParams = tempParams.toString().split("/");
        
        if(tempParams.length == 1)
        {
            applicationFor = tempParams[0];
        }
        else if(tempParams.length == 2)
        {
            applicationFor = tempParams[0];
            schoolUUID = tempParams[1];
        }
        else if(tempParams.length == 3)
        {
            applicationFor = tempParams[0];
            schoolUUID = tempParams[1];
            schoolingProgramId = commonFunction.validateNumber(tempParams[2]);
        }
        else if(tempParams.length == 4)
        {
            applicationFor = tempParams[0];
            schoolUUID = tempParams[1];
            schoolingProgramId = commonFunction.validateNumber(tempParams[2]);
            academicSessionId = commonFunction.validateNumber(tempParams[3]);
        }
        else if(tempParams.length == 5)
        {
            applicationFor = tempParams[0];
            schoolUUID = tempParams[1];
            schoolingProgramId = commonFunction.validateNumber(tempParams[2]);
            academicSessionId = commonFunction.validateNumber(tempParams[3]);
            studyCenterUUID = tempParams[4];
        }
        else if(tempParams.length == 6)
        {
            applicationFor = tempParams[0];
            schoolUUID = tempParams[1];
            schoolingProgramId = commonFunction.validateNumber(tempParams[2]);
            academicSessionId = commonFunction.validateNumber(tempParams[3]);
            studyCenterUUID = tempParams[4];
            statusId = commonFunction.validateNumber(tempParams[5]);
        }
        
        applicationForms = await dbAdmission.getApplicationForms(applicationFor, schoolUUID, schoolingProgramId, academicSessionId, studyCenterUUID, statusId);
        if(applicationForms.length >= 0)
        {
            res.status(200)
            return res.json({
                "applicationForms" : buildJSON.applicationForms(applicationForms),
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
