const buildJSON = require('./buildAdmissionJSONs.js');
const commonFunction = require('../util/commonFunctions.js');
let dbAdmission = require('../sqlmap/admissionQuery.js');
let errorCodes = require('../util/errorCodes.js');
let errorCode = new errorCodes();
//Variables 
//
let studentProfileCompletions;

module.exports = require('express').Router().get('/', async(req,res) =>
{
    try
    {
        studentProfileCompletions = await dbAdmission.getStudentProfileCompletions();
        if(studentProfileCompletions.length >= 0)
        {
            res.status(200)
            return res.json({
                "studentProfileCompletions" : buildJSON.studentProfileCompletion(studentProfileCompletions),
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
