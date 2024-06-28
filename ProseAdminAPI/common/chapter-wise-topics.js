const buildJSON = require('./buildCommonJSONs.js');
const commonFunction = require('../util/commonFunctions.js');
let dbCommon = require('../sqlmap/commonQuery.js');
let errorCodes = require('../util/errorCodes.js');
let errorCode = new errorCodes();
////////Variables 
let academicSessionId;
let syllabusId;
let gradeId;
let subjectId;
let chapterId;
let action;
//////
let chapterWiseTopics;

module.exports = require('express').Router().get('/?*', async(req,res) =>
{
    try
    {
        academicSessionId = '';
        syllabusId = '';
        gradeId = '';
        subjectId = '';
        chapterId = '';
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
            gradeId = commonFunction.validateNumber(tempParams[2]);
        }
        else if(tempParams.length == 4)
        {
            academicSessionId = commonFunction.validateNumber(tempParams[0]);
            syllabusId = commonFunction.validateNumber(tempParams[1]);
            gradeId = commonFunction.validateNumber(tempParams[2]);
            subjectId = commonFunction.validateNumber(tempParams[3]);
        }
        else if(tempParams.length == 5)
        {
            academicSessionId = commonFunction.validateNumber(tempParams[0]);
            syllabusId = commonFunction.validateNumber(tempParams[1]);
            gradeId = commonFunction.validateNumber(tempParams[2]);
            subjectId = commonFunction.validateNumber(tempParams[3]);
            chapterId = commonFunction.validateNumber(tempParams[4]);
            action = tempParams[5];
        }
        
        chapterWiseTopics = await dbCommon.getChapterWiseTopics(academicSessionId, syllabusId, gradeId, subjectId, chapterId, action);
        if(chapterWiseTopics.length >= 0)
        {
            res.status(200)
            return res.json({
                "chapterWiseTopics" : buildJSON.chapterWiseTopics(chapterWiseTopics),
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
