const commonFunction = require('../util/commonFunctions.js');
let dbCommon = require('../sqlmap/commonQuery.js');
let errorCodes = require('../util/errorCodes.js');
let errorCode = new errorCodes();
//Variables 
let groupName;
let minSubject;
let maxSubject;
let syllabusId;
let gradeCategoryId;
let gradeId;
let subjectIds;
//
let syllabus;
let gradeCategory;
let grade;
let subject;
let subjectGroup;

module.exports = require('express').Router().post('/',async(req,res) =>
{
    try
    {
        let reqData = commonFunction.trimSpaces(req.body);
        let authData = reqData.authData;
        
        if(reqData.groupName != undefined && reqData.minSubject != undefined && reqData.maxSubject != undefined && reqData.syllabus != undefined && reqData.gradeCategory != undefined && reqData.grade != undefined && reqData.subjects != undefined)
        {
            if(reqData.groupName != "" && reqData.minSubject != "" && reqData.maxSubject != "" && reqData.syllabus.id != "" && reqData.gradeCategory.id != "" && reqData.grade.id != "" && reqData.subjects != "")
            {
                groupName = reqData.groupName;
                minSubject = commonFunction.validateNumber(reqData.minSubject);
                maxSubject = commonFunction.validateNumber(reqData.maxSubject);
                syllabusId = commonFunction.validateNumber(reqData.syllabus.id);
                gradeCategoryId = commonFunction.validateNumber(reqData.gradeCategory.id);
                gradeId = commonFunction.validateNumber(reqData.grade.id);
                subjectIds = reqData.subjects;
                
                //check duplicate subject group   
                subjectGroup = await dbCommon.duplicateSubjectGroup(groupName, "", gradeId);
                if(subjectGroup.length > 0)
                {
                    res.status(500)
                    return res.json({
                        "status_code" : 500,
                        "message" : "Subject Group Name Already Exist",
                        "success" : false,
                        "error" : errorCode.getStatus(500)
                    });
                }

                let tempSubjectIds = subjectIds.toString().split(",");
                let getSubjectUrl = global.adminPortalAPIUrl+"common/getSubjectByIds/"+subjectIds;
                subject = await commonFunction.getExternalAPI(getSubjectUrl); 
                if(subject)
                {
                    if(tempSubjectIds.length != subject.length)
                    {
                        res.status(500)
                        return res.json({
                            "status_code" : 500,
                            "message" : "Some Subjects Are Invalid",
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
                        "message" : "Some Subjects Are Invalid",
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
                
                //insert Subject Group
                let insertJSON = {
                    "groupName" : groupName,
                    "syllabusId" : syllabusId,
                    "gradeCategoryId" : gradeCategoryId,
                    "gradeId" : gradeId,
                    "subjectIds" : subjectIds,
                    "minSubject" : minSubject,
                    "maxSubject" : maxSubject,
                    "createdById" : authData.id
                }
                let insertSubjectGroupResult = await dbCommon.insertSubjectGroup(insertJSON);
                let insertsubjectGroupId = insertSubjectGroupResult.insertId;
    
                if(parseInt(insertsubjectGroupId) > 0)
                {
                    res.status(200)
                    return res.json({
                        "id" : insertsubjectGroupId,
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
                        "message" : "Subject Group Are Not Saved",
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
