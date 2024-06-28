const commonFunction = require('../util/commonFunctions.js');
let dbCommon = require('../sqlmap/commonQuery.js');
let errorCodes = require('../util/errorCodes.js');
let errorCode = new errorCodes();
////////Variables 
let chapterWiseTopicId;
let name;
let academicSessionId;
let subjectWiseChapterId;
//////
let subjectWiseChapter;
let chapterWiseTopic;
let academicSession;

module.exports = require('express').Router().post('/',async(req,res) =>
{
    try
    {
        let reqData = commonFunction.trimSpaces(req.body);
        let authData = reqData.authData;
        
        if(reqData.id != undefined && reqData.name != undefined && reqData.academicSession != undefined && reqData.subjectWiseChapter != undefined)
        {
            if(reqData.id != "" && reqData.name != "" && reqData.academicSession.id != "" && reqData.subjectWiseChapter.id != "")
            {
                chapterWiseTopicId = commonFunction.validateNumber(reqData.id);
                name = reqData.name;
                academicSessionId = commonFunction.validateNumber(reqData.academicSession.id);
                subjectWiseChapterId = commonFunction.validateNumber(reqData.subjectWiseChapter.id);

                ////check Chapter Wise Topic Exist
                // chapterWiseTopic = await dbCommon.checkInUseSubjectWiseChapterExist(subjectWiseChapterId);
                // if(chapterWiseTopic.length == 0)
                // {
                    ////check Academic Session Exist
                    academicSession = await dbCommon.getAcademicSession(academicSessionId);
                    if(academicSession.length == 1)
                    {
                        ////check Subject Wise Chapter Exist
                        subjectWiseChapter = await dbCommon.checkSubjectWiseChapterExist(subjectWiseChapterId);
                        if(subjectWiseChapter.length == 1)
                        {                       
                            ////Check duplicate Chapter Wise Topic
                            chapterWiseTopic = await dbCommon.duplicateChapterWiseTopic(academicSessionId, subjectWiseChapterId, name, chapterWiseTopicId);
                            if(chapterWiseTopic.length == 0)
                            {                    
                        ///update Chapter Wise Topic
                                let updateJSON = {
                                    "id" : chapterWiseTopicId,
                                    "academicSessionId" : academicSessionId,
                                    "subjectWiseChapterId" : subjectWiseChapterId,
                                    "name" : name,
                                    "createdById" : authData.id
                                }
                                let updateChapterWiseTopicResult = await dbCommon.updateChapterWiseTopic(updateJSON);
                                ///////
                                if(updateChapterWiseTopicResult.affectedRows > 0)
                                {
                                    res.status(200)
                                    return res.json({
                                        "status_code" : 200,
                                        "success" : true,                            
                                        "message" : errorCode.getStatus(200)
                                    })
                                }
                                else
                                {
                                    res.status(500)
                                    return res.json({
                                        "status_code" : 500,
                                        "message" : "Chapter Wise Topic Not Saved",
                                        "success" : false,
                                        "error" : errorCode.getStatus(500)
                                    })
                                }
                            }
                            else
                            {
                                res.status(500)
                                return res.json({
                                    "status_code" : 500,
                                    "message" : "Chapter Wise Topic Already Exist",
                                    "success" : false,
                                    "error" : errorCode.getStatus(500)
                                })
                            }                        
                        }
                        else
                        {
                            res.status(500)
                            return res.json({
                                "status_code" : 500,
                                "message" : "Chapter Not Exist",
                                "success" : false,
                                "error" : errorCode.getStatus(500)
                            })
                        }
                    }
                    else
                    {
                        res.status(500)
                        return res.json({
                            "status_code" : 500,
                            "message" : "Academic Session Not Exist",
                            "success" : false,
                            "error" : errorCode.getStatus(500)
                        })
                    }
                // }
                // else
                // {
                //     res.status(500)
                //     return res.json({
                //         "status_code" : 500,
                //         "message" : "Chapter Wise Topic Currently In Use",
                //         "success" : false,
                //         "error" : errorCode.getStatus(500)
                //     })
                // }
            }
            else
            {
                res.status(500)
                return res.json({
                    "status_code" : 500,
                    "message" : "Some Values Are Not Filled",
                    "success" : false,
                    "error" : errorCode.getStatus(500)
                })
            }
        }
        else
        {
            res.status(500)
            return res.json({
                "status_code" : 500,
                "message" : "JSON Error",
                "success" : false,
                "error" : errorCode.getStatus(500)
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
            "error" : e
        });
    }
})
