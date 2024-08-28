const commonFunction = require('../util/commonFunctions.js');
let dbCommon = require('../sqlmap/commonQuery.js');
let errorCodes = require('../util/errorCodes.js');
let errorCode = new errorCodes();
////////Variables 
let subjectWiseChapterId;
let name;
let academicSessionId;
let syllabusWiseSubjectId;
//////
let syllabusWiseSubject;
let subjectWiseChapter;
let chapterWiseTopic;
let academicSession;

module.exports = require('express').Router().post('/',async(req,res) =>
{
    try
    {
        let reqData = commonFunction.trimSpaces(req.body);
        let authData = reqData.authData;
        
        if(reqData.id != undefined && reqData.name != undefined && reqData.academicSession != undefined && reqData.syllabusWiseSubject != undefined)
        {
            if(reqData.id != "" && reqData.name != "" && reqData.academicSession.id != "" && reqData.syllabusWiseSubject.id != "")
            {
                subjectWiseChapterId = commonFunction.validateNumber(reqData.id);
                name = reqData.name;
                academicSessionId = commonFunction.validateNumber(reqData.academicSession.id);
                syllabusWiseSubjectId = commonFunction.validateNumber(reqData.syllabusWiseSubject.id);

                ////check Subject Wise Chapter Exist
                chapterWiseTopic = await dbCommon.checkInUseSubjectWiseChapterExist(subjectWiseChapterId);
                if(chapterWiseTopic.length == 0)
                {
                    ////check Academic Session Exist
                    academicSession = await dbCommon.getAcademicSession(academicSessionId);
                    if(academicSession.length == 1)
                    {
                        ////check Syllabus Wise Subject Exist
                        syllabusWiseSubject = await dbCommon.checkSyllabusWiseSubjectExist(syllabusWiseSubjectId);
                        if(syllabusWiseSubject.length == 1)
                        {                       
                            ////Check duplicate Subject Wise Chapter
                            subjectWiseChapter = await dbCommon.duplicateSubjectWiseChapter(academicSessionId, syllabusWiseSubjectId, name, subjectWiseChapterId);
                            if(subjectWiseChapter.length == 0)
                            {                    
                        ///insert Subject Wise Chapter
                                let updateJSON = {
                                    "id" : subjectWiseChapterId,
                                    "academicSessionId" : academicSessionId,
                                    "syllabusWiseSubjectId" : syllabusWiseSubjectId,
                                    "name" : name,
                                    "createdById" : authData.id
                                }
                                let updateSubjectWiseChapterResult = await dbCommon.updateSubjectWiseChapter(updateJSON);
                                if(updateSubjectWiseChapterResult.affectedRows > 0)
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
                                        "message" : "Subject Wise Chapter Not Saved",
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
                                    "message" : "Subject Wise Chapter Already Exist",
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
                                "message" : "Subject Not Exist",
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
                }
                else
                {
                    res.status(500)
                    return res.json({
                        "status_code" : 500,
                        "message" : "Subject Wise Chapter Currently In Use",
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
