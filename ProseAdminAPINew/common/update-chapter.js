const commonFunction = require('../util/commonFunctions.js');
let dbCommon = require('../sqlmap/commonQuery.js');
let errorCodes = require('../util/errorCodes.js');
let errorCode = new errorCodes();
//Variables 
let chapterId;
let name;
let applicableFromYearId;
let subjectId;
//
let subject;
let chapter;
let topic;
let applicableFromYear;

module.exports = require('express').Router().post('/',async(req,res) =>
{
    try
    {
        let reqData = commonFunction.trimSpaces(req.body);
        let authData = reqData.authData;
        
        if(reqData.id != undefined && reqData.name != undefined && reqData.applicableFromYear != undefined && reqData.subject != undefined)
        {
            if(reqData.id != "" && reqData.name != "" && reqData.applicableFromYear.id != "" && reqData.subject.id != "")
            {
                chapterId = commonFunction.validateNumber(reqData.id);
                name = reqData.name;
                applicableFromYearId = commonFunction.validateNumber(reqData.applicableFromYear.id);
                subjectId = commonFunction.validateNumber(reqData.subject.id);

                //check chapter exist
                topic = await dbCommon.checkInUseChapterExist(chapterId);
                if(topic.length == 0)
                {
                    //check applicable from year exist
                    applicableFromYear = await dbCommon.getAcademicSession(applicableFromYearId);
                    if(applicableFromYear.length == 1)
                    {
                        //check subject exist
                        subject = await dbCommon.checkSubjectExist(subjectId);
                        if(subject.length == 1)
                        {                       
                            // check duplicate chapter
                            chapter = await dbCommon.duplicateChapter(subjectId, name, chapterId);
                            if(chapter.length == 0)
                            {                    
                                //insert chapter
                                let updateJSON = {
                                    "id" : chapterId,
                                    "applicableFromYearId" : applicableFromYearId,
                                    "subjectId" : subjectId,
                                    "name" : name,
                                    "createdById" : authData.id
                                }
                                let updateChapterResult = await dbCommon.updateChapter(updateJSON);
                                if(updateChapterResult.affectedRows > 0)
                                {
                                    res.status(200)
                                    return res.json({
                                        "status_code" : 200,
                                        "success" : true,                            
                                        "message" : errorCode.getStatus(200)
                                    });
                                }
                                else
                                {
                                    res.status(500)
                                    return res.json({
                                        "status_code" : 500,
                                        "message" : "Chapter Not Saved",
                                        "success" : false,
                                        "error" : errorCode.getStatus(500)
                                    });
                                }
                            }
                            else
                            {
                                res.status(500)
                                return res.json({
                                    "status_code" : 500,
                                    "message" : "Chapter Already Exist",
                                    "success" : false,
                                    "error" : errorCode.getStatus(500)
                                });
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
                            });
                        }
                    }
                    else
                    {
                        res.status(500)
                        return res.json({
                            "status_code" : 500,
                            "message" : "Applicable From Year Not Exist",
                            "success" : false,
                            "error" : errorCode.getStatus(500)
                        });
                    }
                }
                else
                {
                    res.status(500)
                    return res.json({
                        "status_code" : 500,
                        "message" : "Chapter Currently In Use",
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
            "error" : e?.stack
        });
    }
})
