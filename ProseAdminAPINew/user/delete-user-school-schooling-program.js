const commonFunction = require('../util/commonFunctions.js');
let dbUser = require('../sqlmap/userQuery.js');
let dbCommon = require('../sqlmap/commonQuery.js');
let dbBusiness = require('../sqlmap/businessQuery.js');
let errorCodes = require('../util/errorCodes.js');
let errorCode = new errorCodes();
////////Variables 
let moduleId;
let userUUID;
let schoolUUID;
let schoolingProgramId;
//////
let school;
let user;
let schoolingProgram;

module.exports = require('express').Router().post('/',async(req,res) =>
{
    try
    {
        let reqData = commonFunction.trimSpaces(req.body);
        let authData = reqData.authData;
        
        if(reqData.user != undefined && reqData.school != undefined && reqData.schoolingProgram != undefined && reqData.module != undefined)
        {
            if(reqData.user.uuid != "" && reqData.school.uuid != "" && reqData.schoolingProgram.id != "" && moduleId != "")
            {
                userUUID = reqData.user.uuid;
                moduleId = commonFunction.validateNumber(reqData.module.id);
                schoolUUID = reqData.school.uuid;
                schoolingProgramId = reqData.schoolingProgram.id;

                ///Check User
                user = await dbUser.getUser(userUUID);
                if(user.length == 0)
                {    
                    res.status(500)
                    return res.json({
                        "status_code" : 500,
                        "message" : "Invalid User",
                        "success" : false,
                        "error" : errorCode.getStatus(500)
                    }) 
                }
            ///Check School
                school = await dbBusiness.getSchool(schoolUUID);
                if(school.length == 0)
                {    
                    res.status(500)
                    return res.json({
                        "status_code" : 500,
                        "message" : "Invalid School",
                        "success" : false,
                        "error" : errorCode.getStatus(500)
                    }) 
                }
            ///Check Schooling Program
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
                ///delete User School Schooling Program
                let deleteJSON = {
                    "userId" : user[0].userId,
                    "moduleId" : moduleId,
                    "schoolId" : school[0].id,
                    "schoolingProgramId" : schoolingProgramId
                }
                let deleteUserSchoolingProgramResult = await dbUser.deleteUserSchoolSchoolingProgram(deleteJSON);
    ///////
                if(deleteUserSchoolingProgramResult.affectedRows > 0)
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
                        "message" : "Schooling Program Not Deleted",
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