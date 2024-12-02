const commonFunction = require('../util/commonFunctions.js');
let dbBusiness = require('../sqlmap/businessQuery.js');
let dbCommon = require('../sqlmap/commonQuery.js');
let errorCodes = require('../util/errorCodes.js');
let errorCode = new errorCodes();
let genUUID = require('uuid');
////////Variables 
let id;
let schoolUUID;
let academicSessionId;
let schoolSchoolingProgramId;
let startDate;
let endDate;
let admissionStartDate;
let admissionEndDate;
let batchTypeIds;
//////
let school;
let academicSession;
let schoolSchoolingProgram;
let batchTypes;
let schoolSchoolingProgramValidity;

module.exports = require('express').Router().post('/',async(req,res) =>
{
    try
    {
        let reqData = commonFunction.trimSpaces(req.body);
        let authData = reqData.authData;
        
        if(reqData.id != undefined && reqData.school != undefined && reqData.academicSession != undefined && reqData.schoolSchoolingProgram != undefined && reqData.startDate != undefined && reqData.endDate != undefined && reqData.admissionStartDate != undefined && reqData.admissionEndDate != undefined && reqData.batchTypeIds != undefined)
        {
            if(reqData.id != "" && reqData.school.uuid != "" && reqData.academicSession.id != "" && reqData.schoolSchoolingProgram.id != "" && reqData.startDate != "" && reqData.endDate != "" && reqData.admissionStartDate != "" && reqData.admissionEndDate != "" && reqData.batchTypeIds != "")
            {
                id = reqData.id;
                schoolUUID = reqData.school.uuid;
                academicSessionId = reqData.academicSession.id;
                schoolSchoolingProgramId = reqData.schoolSchoolingProgram.id;
                startDate = reqData.startDate;
                endDate = reqData.endDate;
                admissionStartDate = reqData.admissionStartDate;
                admissionEndDate = reqData.admissionEndDate;
                batchTypeIds = reqData.batchTypeIds;

                /////check schoolSchoolingProgramValidity
                schoolSchoolingProgramValidity = await dbBusiness.getSchoolSchoolingProgramValidity(id);
                if(schoolSchoolingProgramValidity.length == 0)
                {
                    res.status(500)
                    return res.json({
                        "status_code" : 500,
                        "message" : "Invalid School Schooling Program Updation",
                        "success" : false,
                        "error" : errorCode.getStatus(500)
                    })
                }
                /////check School Schooling Program
                schoolSchoolingProgram = await dbBusiness.getSchoolSchoolingProgram(schoolSchoolingProgramId);
                if(schoolSchoolingProgram.length == 0)
                { 
                    res.status(500)
                    return res.json({
                        "status_code" : 500,
                        "message" : "Invalid School Schooling Program",
                        "success" : false,
                        "error" : errorCode.getStatus(500)
                    })
                }
                /////check batchTypeIds
                if(batchTypeIds != "")
                {
                    let batchTypeIdArray = batchTypeIds.toString().split(",");
                    batchTypes = await dbCommon.getBatchTypeIds(batchTypeIds);
                    if(batchTypes.length != batchTypeIdArray.length)
                    {
                        res.status(500)
                        return res.json({
                            "status_code" : 500,
                            "message" : "Some Of Batch Types Are Invalid",
                            "success" : false,
                            "error" : errorCode.getStatus(500)
                        })
                    }
                }
            /////check startDate and endDate
                if(!commonFunction.isValidDate(startDate, "YYYY-MM-DD") || !commonFunction.isValidDate(endDate, "YYYY-MM-DD"))
                { 
                    res.status(500)
                    return res.json({
                        "status_code" : 500,
                        "message" : "Invalid Date Format In startDate or endDate",
                        "success" : false,
                        "error" : errorCode.getStatus(500)
                    })
                }
             /////check admissionStartDate and admissionEndDate
                if(!commonFunction.isValidDate(admissionStartDate, "YYYY-MM-DD") || !commonFunction.isValidDate(admissionEndDate, "YYYY-MM-DD"))
                { 
                    res.status(500)
                    return res.json({
                        "status_code" : 500,
                        "message" : "Invalid Date Format In admissionStartDate or admissionEndDate",
                        "success" : false,
                        "error" : errorCode.getStatus(500)
                    })
                }
                ////Check School Exist
                school = await dbBusiness.getSchool(schoolUUID);
                if(school.length == 1)
                {  
                /////check Academic Session
                    academicSession = await dbCommon.getAcademicSession(academicSessionId);
                    if(academicSession.length == 0)
                    { 
                        res.status(500)
                        return res.json({
                            "status_code" : 500,
                            "message" : "Invalid Academic Session",
                            "success" : false,
                            "error" : errorCode.getStatus(500)
                        })
                    }
                //duplicate school schooling program validity
                    schoolSchoolingProgramValidity = await dbBusiness.duplicateSchoolSchoolingProgramValidity(school[0].id, academicSessionId, schoolSchoolingProgramId, id);
                    if(schoolSchoolingProgramValidity.length > 0)
                    {
                        res.status(500)
                        return res.json({
                            "status_code" : 500,
                            "message" : "Schooling Program Validity Already Exist For Academic Session And School",
                            "success" : false,
                            "error" : errorCode.getStatus(500)
                        })
                    }
                    let updateJSON = {
                        "id" : id,
                        "academicSessionId" : academicSessionId,
                        "startDate" : startDate,
                        "endDate" : endDate,
                        "admissionStartDate" : admissionStartDate,
                        "admissionEndDate" : admissionEndDate,
                        "batchTypeIds" : batchTypeIds,
                        "createdById" : authData.id
                    }
                    let updateResult = await dbBusiness.updateSchoolSchoolingProgramValidity(updateJSON);
                    if(updateResult.affectedRows > 0)
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
                            "message" : "School Schooling Program Validity Not Saved",
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
                        "message" : "School Not Exist",
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