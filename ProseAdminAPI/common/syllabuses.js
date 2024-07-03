const buildJSON = require('./buildCommonJSONs.js');
const commonFunction = require('../util/commonFunctions.js');
let dbCommon = require('../sqlmap/commonQuery.js');
let errorCodes = require('../util/errorCodes.js');
let errorCode = new errorCodes();
////////Variables 
let academicSessionId;
let schoolingProgramId;
let action;
//////
let syllabuses;

module.exports = require('express').Router().get('/?*', async(req,res) =>
{
    try
    {
        academicSessionId = '';
        schoolingProgramId = '';
        let tempParams = req.params[0].split("/");
        if(tempParams.length == 1)
        {
            academicSessionId = commonFunction.validateNumber(tempParams[0]);
        }
        else if(tempParams.length == 2)
        {
            academicSessionId = commonFunction.validateNumber(tempParams[0]);
            schoolingProgramId = commonFunction.validateNumber(tempParams[1]);
        }
        else if(tempParams.length == 3)
        {
            academicSessionId = commonFunction.validateNumber(tempParams[0]);
            schoolingProgramId = commonFunction.validateNumber(tempParams[1]);
            action = tempParams[2];
        }
        syllabuses = await dbCommon.getSyllabuses(academicSessionId, schoolingProgramId, action);
        if(syllabuses.length >= 0)
        {
            res.status(200)
            return res.json({
                "syllabuses" : buildJSON.syllabuses(syllabuses),
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
