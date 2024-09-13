const buildJSON = require('./buildCommonJSONs.js');
const commonFunction = require('../util/commonFunctions.js');
let dbCommon = require('../sqlmap/commonQuery.js');
let errorCodes = require('../util/errorCodes.js');
let errorCode = new errorCodes();
///Variables 
let gradeCategoryId;
let gradeId;
let syllabusId;
let subjectId;
let chapterId;
let action;
//
let topics;

module.exports = require('express').Router().get('/?*', async(req,res) =>
{
    try
    {
        gradeCategoryId = '';
        gradeId = '';
        syllabusId = '';
        subjectId = '';
        chapterId = '';
        action = '';

        let tempParams = req.params[0].split("/");
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
            subjectId = commonFunction.validateNumber(tempParams[3]);
        }
        else if(tempParams.length == 5)
        {
            gradeCategoryId = commonFunction.validateNumber(tempParams[0]);
            gradeId = commonFunction.validateNumber(tempParams[1]);
            syllabusId = commonFunction.validateNumber(tempParams[2]);
            subjectId = commonFunction.validateNumber(tempParams[3]);
            chapterId = commonFunction.validateNumber(tempParams[4]);
        }
        else if(tempParams.length == 6)
        {
            gradeCategoryId = commonFunction.validateNumber(tempParams[0]);
            gradeId = commonFunction.validateNumber(tempParams[1]);
            syllabusId = commonFunction.validateNumber(tempParams[2]);
            subjectId = commonFunction.validateNumber(tempParams[3]);
            chapterId = commonFunction.validateNumber(tempParams[4]);
            action = tempParams[5];
        }

        topics = await dbCommon.getChapterWiseTopics(academicSessionId, syllabusId, gradeCategoryId, gradeId, subjectId, chapterId, action);
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
