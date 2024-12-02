const commonFunction = require('../util/commonFunctions.js');
let dbCommon = require('../sqlmap/commonQuery.js');
let errorCodes = require('../util/errorCodes.js');
let errorCode = new errorCodes();
//Variables 
let id;
let groupName;
let minSubject;
let maxSubject;
let syllabusId;
let gradeCategoryId;
let gradeId;
//
let syllabus;
let gradeCategory;
let grade;
let subjectGroup;

module.exports = require('express').Router().post('/',async(req,res) =>
{
    try
    {
        let reqData = commonFunction.trimSpaces(req.body);
        let authData = reqData.authData;
        
        if(reqData.id != undefined && reqData.groupName != undefined && reqData.minSubject != undefined && reqData.maxSubject != undefined && reqData.syllabus != undefined && reqData.gradeCategory != undefined && reqData.grade != undefined)
        {
            if(reqData.id != "" && reqData.groupName != "" && reqData.minSubject != "" && reqData.maxSubject != "" && reqData.syllabus.id != "" && reqData.gradeCategory.id != "" && reqData.grade.id != "")
            {
                id = commonFunction.validateNumber(reqData.id);
                groupName = reqData.groupName;
                minSubject = commonFunction.validateNumber(reqData.minSubject);
                maxSubject = commonFunction.validateNumber(reqData.maxSubject);
                syllabusId = commonFunction.validateNumber(reqData.syllabus.id);
                gradeCategoryId = commonFunction.validateNumber(reqData.gradeCategory.id);
                gradeId = commonFunction.validateNumber(reqData.grade.id);
                
                //check duplicate subject group   
                subjectGroup = await dbCommon.duplicateSubjectGroup(groupName, id);
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
                
                //update Subject Group
                let updateJSON = {
                    "id" : id,
                    "groupName" : groupName,
                    "syllabusId" : syllabusId,
                    "gradeCategoryId" : gradeCategoryId,
                    "gradeId" : gradeId,
                    "minSubject" : minSubject,
                    "maxSubject" : maxSubject,
                    "createdById" : authData.id
                }
                let updateSubjectGroupResult = await dbCommon.updateSubjectGroup(updateJSON);
                
                if(updateSubjectGroupResult.affectedRows > 0)
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
