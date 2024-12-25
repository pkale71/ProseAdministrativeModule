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
let schoolingProgramIds;
//////
let school;
let user;
let schoolingPrograms;

module.exports = require('express').Router().post('/',async(req,res) =>
{
    try
    {
        let reqData = commonFunction.trimSpaces(req.body);
        let authData = reqData.authData;
        
        if(reqData.user != undefined && reqData.school != undefined && reqData.schoolingProgramIds != undefined && reqData.module != undefined)
        {
            if(reqData.user.uuid != "" && reqData.school.uuid != "" && reqData.schoolingProgramIds != "" && moduleId != "")
            {
                userUUID = reqData.user.uuid;
                moduleId = commonFunction.validateNumber(reqData.module.id);
                schoolUUID = reqData.school.uuid;
                schoolingProgramIds = reqData.schoolingProgramIds;

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

                if(schoolingProgramIds != "0")
                {
                    let schoolingProgramIdArray = schoolingProgramIds.toString().split(",");                
                ///Check Schooling Programs
                    schoolingPrograms = await dbCommon.getSchoolingProgram(schoolingProgramIds);
                    if(schoolingPrograms.length != schoolingProgramIdArray.length)
                    {    
                        res.status(500)
                        return res.json({
                            "status_code" : 500,
                            "message" : "All Schooling Programs Not Matched",
                            "success" : false,
                            "error" : errorCode.getStatus(500)
                        }) 
                    }
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
            ///Check School & Schooling Programs Exist
                if(schoolingProgramIds != "0")
                {
                    let userSchoolSchoolingPrograms = await dbUser.userSchoolSchoolingProgramsExist(user[0].userId, moduleId, school[0].id, schoolingProgramIds);
                    if(userSchoolSchoolingPrograms.length > 0)
                    {    
                        res.status(500)
                        return res.json({
                            "status_code" : 500,
                            "message" : "School & Schooling Programs Already Exist",
                            "success" : false,
                            "error" : errorCode.getStatus(500)
                        }) 
                    }
                }
                ///insert User School
                let insertJSON = {
                    "userId" : user[0].userId,
                    "moduleId" : moduleId,
                    "schoolId" : school[0].id,
                    "schoolingProgramIds" : schoolingProgramIds,
                    "createdById" : authData.id
                }
                let insertUserSchoolResult = await dbUser.insertUserSchoolSchoolingPrograms(insertJSON);
    ///////
                if(insertUserSchoolResult.affectedRows > 0)
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
                        "message" : "School & Schooling Programs Not Saved",
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
