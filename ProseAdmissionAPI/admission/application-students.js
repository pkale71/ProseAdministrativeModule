const buildJSON = require('./buildAdmissionJSONs.js');
const commonFunction = require('../util/commonFunctions.js');
let dbCommon = require('../sqlmap/commonQuery.js');
let dbAdmission = require('../sqlmap/admissionQuery.js');
let errorCodes = require('../util/errorCodes.js');
let errorCode = new errorCodes();
//Variables 
let academicSessionId;
//
let applicationStudents;

module.exports = require('express').Router().get('/:academicSessionId', async(req,res) =>{
    try
    {
        academicSessionId = req.params?.academicSessionId;
        
        applicationStudents = await dbAdmission.getApplicationStudents(academicSessionId);
        if(applicationStudents.length >= 0)
        {
            res.status(200)
            return res.json({
                "applicationStudents" : buildJSON.applicationForms(applicationStudents),
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