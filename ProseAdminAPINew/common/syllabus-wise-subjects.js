const buildJSON = require('./buildCommonJSONs.js');
const commonFunction = require('../util/commonFunctions.js');
let dbCommon = require('../sqlmap/commonQuery.js');
let errorCodes = require('../util/errorCodes.js');
let errorCode = new errorCodes();
////////Variables 
let gradeCategoryId;
let gradeId;
let academicSessionId;
let syllabusId;
let action;
//////
let syllabusWiseSubjects;

module.exports = require('express').Router().get('/?*', async(req,res) =>
{
    try
    {
        gradeCategoryId = '';
        academicSessionId = '';
        syllabusId = '';
        gradeId = '';
        action = '';
        
        let tempParams = req.params[0].split("/");
        if(tempParams.length == 1)
        {
            academicSessionId = commonFunction.validateNumber(tempParams[0]);
        }
        else if(tempParams.length == 2)
        {
            academicSessionId = commonFunction.validateNumber(tempParams[0]);
            syllabusId = commonFunction.validateNumber(tempParams[1]);
        }
        else if(tempParams.length == 3)
        {
            academicSessionId = commonFunction.validateNumber(tempParams[0]);
            syllabusId = commonFunction.validateNumber(tempParams[1]);
            gradeCategoryId = commonFunction.validateNumber(tempParams[2]);
        }
        else if(tempParams.length == 4)
        {
            academicSessionId = commonFunction.validateNumber(tempParams[0]);
            syllabusId = commonFunction.validateNumber(tempParams[1]);
            gradeCategoryId = commonFunction.validateNumber(tempParams[2]);
            gradeId = commonFunction.validateNumber(tempParams[3]);
        }
        else if(tempParams.length == 5)
        {
            academicSessionId = commonFunction.validateNumber(tempParams[0]);
            syllabusId = commonFunction.validateNumber(tempParams[1]);
            gradeCategoryId = commonFunction.validateNumber(tempParams[2]);
            gradeId = commonFunction.validateNumber(tempParams[3]);
            action = tempParams[4];
        }
        
        syllabusWiseSubjects = await dbCommon.getSyllabusWiseSubjects(academicSessionId, syllabusId, gradeCategoryId, gradeId, action);
        if(syllabusWiseSubjects.length >= 0)
        {
            res.status(200)
            return res.json({
                "syllabusWiseSubjects" : buildJSON.syllabusWiseSubjects(syllabusWiseSubjects),
                "status_code" : 200,
                "success" : true,                            
                "message" : errorCode.getStatus(200)
            })
        }      
    } 
    catch(e)
    {
        res.status(500)
        return res.json({
            "status_code" : 500,
            "message" : "Something Went Wrong",
            "success" : false,
            "error" : e,
        });
    }
})
