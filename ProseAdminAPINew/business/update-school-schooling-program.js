const commonFunction = require('../util/commonFunctions.js');
let dbBusiness = require('../sqlmap/businessQuery.js');
let dbCommon = require('../sqlmap/commonQuery.js');
let errorCodes = require('../util/errorCodes.js');
let errorCode = new errorCodes();
let genUUID = require('uuid');
////////Variables 
let uuid;
let schoolUUID;
let academicSessionId;
let schoolingProgramId;
let startDate;
let endDate;
let admissionStartDate;
let admissionEndDate;
let batchTypeIds;
//////
let school;
let academicSession;
let schoolingProgram;
let batchTypes;
let schoolSchoolingProgram;

module.exports = require('express').Router().post('/',async(req,res) =>
{
    try
    {
        let reqData = commonFunction.trimSpaces(req.body);
        let authData = reqData.authData;
        
        if(reqData.uuid != undefined && reqData.school != undefined && reqData.academicSession != undefined && reqData.schoolingProgram != undefined && reqData.startDate != undefined && reqData.endDate != undefined && reqData.admissionStartDate != undefined && reqData.admissionEndDate != undefined && reqData.batchTypeIds != undefined)
        {
            if(reqData.uuid != "" && reqData.school.uuid != "" && reqData.academicSession.id != "" && reqData.schoolingProgram.id != "" && reqData.startDate != "" && reqData.endDate != "" && reqData.admissionStartDate != "" && reqData.admissionEndDate != "" && reqData.batchTypeIds != "")
            {
                uuid = reqData.uuid;
                schoolUUID = reqData.school.uuid;
                academicSessionId = reqData.academicSession.id;
                schoolingProgramId = reqData.schoolingProgram.id;
                startDate = reqData.startDate;
                endDate = reqData.endDate;
                admissionStartDate = reqData.admissionStartDate;
                admissionEndDate = reqData.admissionEndDate;
                batchTypeIds = reqData.batchTypeIds;

                /////check schoolSchoolingProgram
                schoolSchoolingProgram = await dbBusiness.getSchoolSchoolingProgram(uuid);
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
                /////check Schooling Program
                    schoolingProgram = await dbCommon.getSchoolingProgram(schoolingProgramId);
                    if(schoolingProgram.length == 0)
                    { 
                        res.status(500)
                        return res.json({
                            "status_code" : 500,
                            "message" : "Invalid Schooling Program",
                            "success" : false,
                            "error" : errorCode.getStatus(500)
                        })
                    }
                //duplicate school schooling program
                    schoolSchoolingProgram = await dbBusiness.duplicateSchoolSchoolingProgram(school[0].id, academicSessionId, schoolingProgramId, uuid);
                    if(schoolSchoolingProgram.length > 0)
                    {
                        res.status(500)
                        return res.json({
                            "status_code" : 500,
                            "message" : "Schooling Program Already Exist For Academic Session And School",
                            "success" : false,
                            "error" : errorCode.getStatus(500)
                        })
                    }
                    let updateJSON = {
                        "uuid" : uuid,
                        "academicSessionId" : academicSessionId,
                        "schoolingProgramId" : schoolingProgramId,
                        "startDate" : startDate,
                        "endDate" : endDate,
                        "admissionStartDate" : admissionStartDate,
                        "admissionEndDate" : admissionEndDate,
                        "batchTypeIds" : batchTypeIds,
                        "createdById" : authData.id
                    }
                    let updateResult = await dbBusiness.updateSchoolSchoolingProgram(updateJSON);
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
                            "message" : "Schooling Program Not Saved",
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
            "error" : e?.stack
        });
    }
})