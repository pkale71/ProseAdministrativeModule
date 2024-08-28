const commonFunction = require('../util/commonFunctions.js');
let dbCommon = require('../sqlmap/commonQuery.js');
let errorCodes = require('../util/errorCodes.js');
let errorCode = new errorCodes();
////////Variables 
let syllabusWiseSubjectId;
let name;
let academicSessionId;
let gradeId;
let syllabusId;
//////
let syllabusWiseSubject;
let subjectWiseChapter;
let academicSession;
let grade;
let syllabus;
let gradeWiseSyllabus;

module.exports = require('express').Router().post('/',async(req,res) =>
{
    try
    {
        let reqData = commonFunction.trimSpaces(req.body);
        let authData = reqData.authData;
        
        if(reqData.id != undefined && reqData.name != undefined && reqData.academicSession != undefined && reqData.grade != undefined && reqData.syllabus != undefined)
        {
            if(reqData.id != "" && reqData.name != "" && reqData.academicSession.id != "" && reqData.grade.id != "" && reqData.syllabus.id != "")
            {
                syllabusWiseSubjectId = commonFunction.validateNumber(reqData.id),
                name = reqData.name;
                academicSessionId = commonFunction.validateNumber(reqData.academicSession.id);
                gradeId = commonFunction.validateNumber(reqData.grade.id);
                syllabusId = commonFunction.validateNumber(reqData.syllabus.id);

                ////check Syllabus Wise Subject Exist
                subjectWiseChapter = await dbCommon.checkInUseSyllabusWiseSubjectExist(syllabusWiseSubjectId);
                if(subjectWiseChapter.length == 0)
                {
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
                                ////check Grade Wise Syllabus Exist
                                gradeWiseSyllabus = await dbCommon.getGradeWiseSyllabus(academicSessionId, gradeId, syllabusId);
                                if(gradeWiseSyllabus.length == 1)
                                {
                                    ////Check duplicate Syllabus Wise Subject
                                    syllabusWiseSubject = await dbCommon.duplicateSyllabusWiseSubject(academicSessionId, gradeId, syllabusId, name, syllabusWiseSubjectId);
                                    if(syllabusWiseSubject.length == 0)
                                    {                    
                                ///insert Grade Wise Syllabus
                                        let updateJSON = {
                                            "id" : syllabusWiseSubjectId,
                                            "academicSessionId" : academicSessionId,
                                            "gradeWiseSyllabusId" : gradeWiseSyllabus[0].id,
                                            "name" : name,
                                            "createdById" : authData.id
                                        }
                                        let updateSyllabusWiseSubjectResult = await dbCommon.updateSyllabusWiseSubject(updateJSON);
                            ///////
                                        if(updateSyllabusWiseSubjectResult.affectedRows > 0)
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
                                                "message" : "Syllabus Wise Subject Not Saved",
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
                                            "message" : "Syllabus Wise Subject Already Exist",
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
                                        "message" : "Grade Wise Syllabus Not Exist",
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
                        "message" : "Syllabus Wise Subject Currently In Use",
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
