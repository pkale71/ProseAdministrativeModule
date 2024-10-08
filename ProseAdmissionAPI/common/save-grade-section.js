const commonFunction = require('../util/commonFunctions.js');
let dbCommon = require('../sqlmap/commonQuery.js');
let errorCodes = require('../util/errorCodes.js');
let errorCode = new errorCodes();
//Variables 
let totalSection;
let schoolUUID;
let academicSessionId;
let syllabusId;
let gradeCategoryId;
let gradeId;
let batchTypeId;
//
let lastSectionASCII = 65;
let school;
let academicSession;
let syllabus;
let gradeCategory;
let grade;
let batchType;

module.exports = require('express').Router().post('/',async(req,res) =>
{
    try
    {
        let reqData = commonFunction.trimSpaces(req.body);
        let authData = reqData.authData;
        
        if(reqData.totalSection != undefined && reqData.school != undefined && reqData.academicSession != undefined && reqData.syllabus != undefined && reqData.gradeCategory != undefined && reqData.grade != undefined && reqData.batchType != undefined)
        {
            if(reqData.totalSection != "" && reqData.school.uuid != "" && reqData.academicSession.id != "" && reqData.syllabus.id != "" && reqData.gradeCategory.id != "" && reqData.grade.id != "" && reqData.batchType.id != "")
            {
                totalSection = reqData.totalSection;
                schoolUUID = reqData.school.uuid;
                academicSessionId = commonFunction.validateNumber(reqData.academicSession.id);
                syllabusId = commonFunction.validateNumber(reqData.syllabus.id);
                gradeCategoryId = commonFunction.validateNumber(reqData.gradeCategory.id);
                gradeId = commonFunction.validateNumber(reqData.grade.id);
                batchTypeId = commonFunction.validateNumber(reqData.batchType.id);
                
                let getSchoolUrl = global.adminPortalAPIUrl+"business/getSchool/"+schoolUUID;
                school = await commonFunction.getExternalAPI(getSchoolUrl);                
                if(!school)
                {
                    res.status(500)
                    return res.json({
                        "status_code" : 500,
                        "message" : "Invalid School",
                        "success" : false,
                        "error" : errorCode.getStatus(500)
                    });
                }

                let getAcademicSessionUrl = global.adminPortalAPIUrl+"common/getAcademicSession/"+academicSessionId;
                academicSession = await commonFunction.getExternalAPI(getAcademicSessionUrl);                
                if(!academicSession)
                {
                    res.status(500)
                    return res.json({
                        "status_code" : 500,
                        "message" : "Invalid Academic Session",
                        "success" : false,
                        "error" : errorCode.getStatus(500)
                    });
                }

                let getSyllabusUrl = global.adminPortalAPIUrl+"common/getSyllabus/"+syllabusId;
                syllabus = await commonFunction.getExternalAPI(getSyllabusUrl);                
                if(!syllabus)
                {
                    res.status(500)
                    return res.json({
                        "status_code" : 500,
                        "message" : "Invalid Syllabus",
                        "success" : false,
                        "error" : errorCode.getStatus(500)
                    });
                }

                let getGradeCategoryUrl = global.adminPortalAPIUrl+"common/getGradeCategory/"+gradeCategoryId;
                gradeCategory = await commonFunction.getExternalAPI(getGradeCategoryUrl);                
                if(!gradeCategory)
                {
                    res.status(500)
                    return res.json({
                        "status_code" : 500,
                        "message" : "Invalid Grade Category",
                        "success" : false,
                        "error" : errorCode.getStatus(500)
                    });
                }

                let getGradeUrl = global.adminPortalAPIUrl+"common/getGrade/"+gradeId;
                grade = await commonFunction.getExternalAPI(getGradeUrl);                
                if(!grade)
                {
                    res.status(500)
                    return res.json({
                        "status_code" : 500,
                        "message" : "Invalid Grade",
                        "success" : false,
                        "error" : errorCode.getStatus(500)
                    });
                }

                let getBatchTypeUrl = global.adminPortalAPIUrl+"common/getBatchType/"+batchTypeId;
                batchType = await commonFunction.getExternalAPI(getBatchTypeUrl);                
                if(!batchType)
                {
                    res.status(500)
                    return res.json({
                        "status_code" : 500,
                        "message" : "Invalid Grade",
                        "success" : false,
                        "error" : errorCode.getStatus(500)
                    });
                }

                //get last section for the combination   
                let lastGradeSection = await dbCommon.getLastGradeSection(school.id, academicSessionId, syllabusId, gradeCategoryId, gradeId, batchTypeId);
                if(lastGradeSection.length == 1)
                {
                    lastSectionASCII = parseInt(lastGradeSection[0].sectionAscii) + 1;                  
                }
                
                //insert Sections Are
                let insertJSON = {
                    "schoolId" : school.id,
                    "academicSessionId" : academicSessionId,
                    "syllabusId" : syllabusId,
                    "gradeCategoryId" : gradeCategoryId,
                    "gradeId" : gradeId,
                    "batchTypeId" : batchTypeId,
                    "totalSection" : totalSection,
                    "lastSectionASCII" : lastSectionASCII,
                    "createdById" : authData.id
                }
                let insertGradeSectionResult = await dbCommon.insertGradeSection(insertJSON);
                let insertGradeSectionId = insertGradeSectionResult.insertId;
    
                if(parseInt(insertGradeSectionId) > 0)
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
                        "message" : "Sections Are Not Saved",
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
            "error" : e?.stack
        });
    }
});
