const commonFunction = require('../util/commonFunctions.js');
const dbCommon = require('../sqlmap/commonQuery.js');
const errorCodes = require('../util/errorCodes.js');
let errorCode = new errorCodes();

//variable
let name;
let gradeCategoryId;
let gradeId;
let syllabusId;
let applicableFromYearId;
let subjectId;
let totalSession;
let sessionDuration;
let hasPractical;
let isMandatory;
let subjectTypeId;
//
let gradeCategory;
let grade;
let syllabus;
let applicableFromYear;
let subject;
let subjectType;

module.exports = require('express').Router().post('/', async(req, res) => 
{
    try
    {
        let reqData = commonFunction.trimSpaces(req.body);
        let authData = reqData.authData;
        
        if(reqData.id != undefined && reqData.name != undefined && reqData.gradeCategory != undefined && reqData.grade != undefined && reqData.syllabus != undefined && reqData.applicableFromYear != undefined && reqData.subjectType != undefined && reqData.totalSession != undefined && reqData.sessionDuration != undefined && reqData.hasPractical != undefined && reqData.isMandatory != undefined)
        {
            if(reqData.id != '' && reqData.name != '' && reqData.gradeCategory.id != '' && reqData.grade.id != '' && reqData.syllabus.id != '' && reqData.applicableFromYear.id != '' && reqData.subjectType.id != '' && reqData.totalSession != '' && reqData.sessionDuration != '' && parseInt(reqData.hasPractical) >= 0 && parseInt(reqData.isMandatory) >= 0)
            {
                subjectId = commonFunction.validateNumber(reqData.id);
                name = reqData.name;
                gradeCategoryId = commonFunction.validateNumber(reqData.gradeCategory.id);
                gradeId = commonFunction.validateNumber(reqData.grade.id);
                syllabusId = reqData.syllabus.id;
                applicableFromYearId = commonFunction.validateNumber(reqData.applicableFromYear.id);
                subjectTypeId = commonFunction.validateNumber(reqData.subjectType.id);
                totalSession = commonFunction.validateNumber(reqData.totalSession);
                sessionDuration = commonFunction.validateNumber(reqData.sessionDuration);
                hasPractical = commonFunction.validateNumber(reqData.hasPractical, 'Yes');
                isMandatory = commonFunction.validateNumber(reqData.isMandatory, 'Yes');
                
                // check subject exist
                subject = await dbCommon.checkInUseSubjectExist(subjectId);
                if(subject.length == 0)
                {
                    // check subject type exist
                    subjectType = await dbCommon.getSubjectType(subjectTypeId);
                    if(subjectType.length == 1)
                    {
                        // check grade category exist
                        gradeCategory = await dbCommon.getGradeCategory(gradeCategoryId);
                        if(gradeCategory.length == 1)
                        {
                            // check grade exist
                            grade = await dbCommon.getGrade(gradeId);
                            if(grade.length == 1)
                            {
                                //check syllabus exist
                                syllabus = await dbCommon.getSyllabus(syllabusId);
                                if(syllabus.length == 1)
                                {
                                    // applicable from year exist
                                    applicableFromYear = await dbCommon.getAcademicSession(applicableFromYearId);
                                    if(applicableFromYear.length == 1)
                                    {
                                        // check duplicate subject
                                        subject = await dbCommon.duplicateSubject(gradeCategoryId, gradeId, syllabusId, name, subjectId);
                                        if(subject.length == 0)
                                        {
                                            //insert subject
                                            let updateJSON = {
                                                "id" : subjectId,
                                                "gradeCategoryId" : gradeCategoryId,
                                                "gradeId" : gradeId,
                                                "subjectTypeId" : subjectTypeId,
                                                "syllabusId" : syllabusId,
                                                "applicableFromYearId" : applicableFromYearId,
                                                "name" : name,
                                                "totalSession" : totalSession,
                                                "sessionDuration" : sessionDuration,
                                                "hasPractical" : hasPractical,
                                                "isMandatory" : isMandatory,
                                                "createdById" : authData.id
                                            }
                                            let updateSubjectResult = await dbCommon.updateSubject(updateJSON);
                                            if(updateSubjectResult.affectedRows > 0)
                                            {
                                                res.status(200);
                                                return res.json({
                                                    "status_code" : 200,
                                                    "success" : true,
                                                    "message" : errorCode.getStatus(200)
                                                });
                                            }
                                            else
                                            {
                                                res.status(500);
                                                return res.json({
                                                    "status_code" : 500,
                                                    "success" : false,
                                                    "message" : "Subject Not Saved",
                                                    "error" : errorCode.getStatus(500)
                                                });
                                            }

                                        }
                                        else
                                        {
                                            res.status(500);
                                            res.json({
                                                "status_code" : 500,
                                                "success" : false,
                                                "message" : "Subject Already Exist",
                                                "error" : errorCode.getStatus(500)
                                            });
                                        }
                                    } 
                                    else
                                    {
                                        res.status(500);
                                        res.json({
                                            "status_code" : 500,
                                            "success" : false,
                                            "message" : "Academic Session Not Exist",
                                            "error" : errorCode.getStatus(500)
                                        });
                                    }
                                }
                                else
                                {
                                    res.status(500);
                                    res.json({
                                        "status_code" : 500,
                                        "success" : false,
                                        "message" : "Syllabus Not Exist",
                                        "error" : errorCode.getStatus(500)
                                    });
                                }
                            }
                            else
                            {
                                res.status(500);
                                res.json({
                                    "status_code" : 500,
                                    "success" : false,
                                    "message" : "Grade Not Exist",
                                    "error" : errorCode.getStatus(500)
                                });
                            }
                        }
                        else
                        {
                            res.status(500);
                            res.json({
                                "status_code" : 500,
                                "success" : false,
                                "message" : "Grade Category Not Exist",
                                "error" : errorCode.getStatus(500)
                            });
                        }
                    }
                    else
                    {
                        res.status(500);
                        return res.json({
                            "status_code" : 500,
                            "success" : false,
                            "message" : "Subject Type Not Exist",
                            "error" : errorCode.getStatus(500)
                        });
                    }
                }
                else
                {
                    res.status(500);
                    res.json({
                        "status_code" : 500,
                        "success" : false,
                        "message" : "Subject Currently In Use",
                        "error" : errorCode.getStatus(500)
                    });
                }
            }
            else
            {
                res.status(500);
                res.json({
                    "status_code" : 500,
                    "success" : false,
                    "message" : "Some Values Are Not Filled",
                    "error" : errorCode.getStatus(500)
                });
            }
        }
        else
        {
            res.status(500);
            res.json({
                "status_code" : 500,
                "success" : false,
                "message" : "JSON Error",
                "error" : errorCode.getStatus(500)
            });
        }
    }
    catch(e)
    {
        res.status(500);
        res.json({
            "status_code" : 500,
            "success" : false,
            "message" : "Something Went Wrong",
            "error" : e
        });
    }
});