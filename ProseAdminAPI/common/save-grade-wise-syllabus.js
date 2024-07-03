const commonFunction = require('../util/commonFunctions.js');
let dbCommon = require('../sqlmap/commonQuery.js');
let errorCodes = require('../util/errorCodes.js');
let errorCode = new errorCodes();
////////Variables 
let academicSessionId;
let gradeId;
let syllabusId;
//////
let syllabusWiseSubject;
let academicSession;
let grade;
let syllabus;

module.exports = require('express').Router().post('/',async(req,res) =>
{
    try
    {
        let reqData = commonFunction.trimSpaces(req.body);
        let authData = reqData.authData;
        
        if(reqData.academicSession != undefined && reqData.grade != undefined && reqData.syllabus != undefined)
        {
            if(reqData.academicSession.id != "" && reqData.grade.id != "" && reqData.syllabus.id != "")
            {
                academicSessionId = commonFunction.validateNumber(reqData.academicSession.id);
                gradeId = commonFunction.validateNumber(reqData.grade.id);
                syllabusId = commonFunction.validateNumber(reqData.syllabus.id);

                ////check Academic Session Exist
                academicSession = await dbCommon.getAcademicSession(academicSessionId);
                if(academicSession.length == 1)
                {
                     ////check Grade Exist
                    grade = await dbCommon.getGrade(gradeId);
                    if(grade.length == 1)
                    {
                         ////check Syllabus Exist
                         syllabus = await dbCommon.getSyllabus(syllabusId);
                        if(syllabus.length == 1)
                        {
                            ////Check dplicate Grade Wise Syllabus
                            syllabusWiseSubject = await dbCommon.duplicateGradeWiseSyllabus(academicSessionId, gradeId, syllabusId);
                            if(syllabusWiseSubject.length == 0)
                            {                    
                        ///insert Grade Wise Syllabus
                                let insertJSON = {
                                    "academicSessionId" : academicSessionId,                                
                                    "gradeId" : gradeId,
                                    "syllabusId" : syllabusId,
                                    "createdById" : authData.id
                                }
                                let insertGradeWiseSyllabusResult = await dbCommon.insertGradeWiseSyllabus(insertJSON);
                                let insertGradeWiseSyllabusId = insertGradeWiseSyllabusResult.insertId;
                    ///////
                                if(parseInt(insertGradeWiseSyllabusId) > 0)
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
                                        "message" : "Grade Wise Syllabus Not Saved",
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
                                    "message" : "Grade Wise Syllabus Already Exist",
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
                                "message" : "Syllabus Not Exist",
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
                            "message" : "Grade Not Exist",
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
