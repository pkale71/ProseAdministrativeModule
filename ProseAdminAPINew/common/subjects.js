const buildJSON = require('./buildCommonJSONs');
const commonFunction = require('../util/commonFunctions');
let dbCommon = require('../sqlmap/commonQuery.js');
let errorCodes = require('../util/errorCodes.js');
let errorCode = new errorCodes();
//variables
let gradeCategoryId;
let gradeId;
let syllabusId;
let action;
//
let subjects;

module.exports = require('express').Router().get('/?*', async(req, res) => 
{
    try
    {
        gradeCategoryId = '';
        gradeId = '';
        syllabusId = '';
        action = '';
        let tempParams = req.params[0].split('/');
        if(tempParams.length == 1)
        {
            gradeCategoryId = commonFunction.validateNumber(tempParams[0]);
        }
        else if(tempParams.length == 2)
        {
            gradeCategoryId = commonFunction.validateNumber(tempParams[0]);
            gradeId = commonFunction.validateNumber(tempParams[1]);
        }
        else if(tempParams.length == 3)
        {
            gradeCategoryId = commonFunction.validateNumber(tempParams[0]);
            gradeId = commonFunction.validateNumber(tempParams[1]);
            syllabusId = commonFunction.validateNumber(tempParams[2]);
        }
        else if(tempParams.length == 4)
        {
            gradeCategoryId = commonFunction.validateNumber(tempParams[0]);
            gradeId = commonFunction.validateNumber(tempParams[1]);
            syllabusId = commonFunction.validateNumber(tempParams[2]);
            action = tempParams[3];
        }

        subjects = await dbCommon.getSubjects(gradeCategoryId, gradeId, syllabusId, action);
        if(subjects.length >= 0)
        {
            res.status(200);
            return res.json({
                "subjects" : buildJSON.subjects(subjects),
                "status_code" : 200,
                "success" : true,                            
                "message" : errorCode.getStatus(200)
            });
        }
    }
    catch(e)
    {
        res.status(500);
        return res.json({
            "status_code" : 500,
            "message" : "Something Went Wrong",
            "success" : false,
            "error" : e
        });
    }
});
