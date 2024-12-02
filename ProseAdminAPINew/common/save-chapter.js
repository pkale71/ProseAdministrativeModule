const commonFunction = require('../util/commonFunctions.js');
let dbCommon = require('../sqlmap/commonQuery.js');
let errorCodes = require('../util/errorCodes.js');
let errorCode = new errorCodes();
//Variables 
let names;
let applicableFromYearId;
let subjectId;
//
let subject;
let chapter;
let applicableFromYear;

module.exports = require('express').Router().post('/',async(req,res) =>
{
    try
    {
        let reqData = commonFunction.trimSpaces(req.body);
        let authData = reqData.authData;
        
        if(reqData.names != undefined && reqData.applicableFromYear != undefined && reqData.subject != undefined)
        {
            if(reqData.names.length > 0 && reqData.applicableFromYear.id != "" && reqData.subject.id != "")
            {
                names = reqData.names;
                applicableFromYearId = commonFunction.validateNumber(reqData.applicableFromYear.id);
                subjectId = commonFunction.validateNumber(reqData.subject.id);

                //check applicable from year exist
                applicableFromYear = await dbCommon.getAcademicSession(applicableFromYearId);
                if(applicableFromYear.length == 1)
                {
                    //check subject exist
                    subject = await dbCommon.checkSubjectExist(subjectId);
                    if(subject.length == 1)
                    {       
                        //check duplicate chapter   
                        chapter = await dbCommon.duplicateChapter(subjectId, names, "");
                        if(chapter.length == 0)
                        {                    
                            //insert Chapter
                            let insertJSON = {
                                "applicableFromYearId" : applicableFromYearId,
                                "subjectId" : subjectId,
                                "names" : names,
                                "createdById" : authData.id
                            }
                            let insertChapterResult = await dbCommon.insertChapter(insertJSON);
                            let insertChapterId = insertChapterResult.insertId;
                
                            if(parseInt(insertChapterId) > 0)
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
                                "message" : "Chapters Already Exist",
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
                    "message" : "Some Values Are Not Filled",
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
                "message" : "JSON Error",
                "success" : false,
                "error" : errorCode.getStatus(500)
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
