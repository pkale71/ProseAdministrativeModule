const commonFunction = require('../util/commonFunctions.js');
let dbCommon = require('../sqlmap/commonQuery.js');
let errorCodes = require('../util/errorCodes.js');
let errorCode = new errorCodes();
//Variables 
let topicId;
let name;
let applicableFromYearId;
let chapterId;
//
let chapter;
let topic;
let applicableFromYear;

module.exports = require('express').Router().post('/',async(req,res) =>
{
    try
    {
        let reqData = commonFunction.trimSpaces(req.body);
        let authData = reqData.authData;

        if(reqData.id != undefined && reqData.name != undefined && reqData.applicableFromYear != undefined && reqData.chapter != undefined)
        {
            if(reqData.id != "" && reqData.name != "" && reqData.applicableFromYear.id != "" && reqData.chapter.id != "")
            {
                topicId = commonFunction.validateNumber(reqData.id);
                name = reqData.name;
                applicableFromYearId = commonFunction.validateNumber(reqData.applicableFromYear.id);
                chapterId = commonFunction.validateNumber(reqData.chapter.id);

                // check topic exist
                // topic = await dbCommon.checkInUseChapterExist(chapterId);
                // if(topic.length == 0)
                // {
                    // check applicable from year exist
                    applicableFromYear = await dbCommon.getAcademicSession(applicableFromYearId);
                    if(applicableFromYear.length == 1)
                    {
                        // check chapter exist
                        chapter = await dbCommon.checkChapterExist(chapterId);
                        if(chapter.length == 1)
                        {                       
                            // check duplicate topic
                            topic = await dbCommon.duplicateTopic(chapterId, name, topicId);
                            if(topic.length == 0)
                            {                    
                                // update topic
                                let updateJSON = {
                                    "id" : topicId,
                                    "applicableFromYearId" : applicableFromYearId,
                                    "chapterId" : chapterId,
                                    "name" : name,
                                    "createdById" : authData.id
                                }
                                let updateTopicResult = await dbCommon.updateTopic(updateJSON);
                                
                                if(updateTopicResult.affectedRows > 0)
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
                                        "message" : "Topic Not Saved",
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
                                    "message" : "Topic Already Exist",
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
                                "message" : "Chapter Not Exist",
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
                // }
                // else
                // {
                //     res.status(500)
                //     return res.json({
                //         "status_code" : 500,
                //         "message" : "Topic Currently In Use",
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
            "error" : e?.stack
        });
    }
})
