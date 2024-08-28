const commonFunction = require('../util/commonFunctions.js');
let dbCommon = require('../sqlmap/commonQuery.js');
let errorCodes = require('../util/errorCodes.js');
let errorCode = new errorCodes();
////////Variables 
let name;
let moduleId;
let userRoleId;
//////
let userRole;
let userType;
let module1;


module.exports = require('express').Router().post('/',async(req,res) =>
{
    try
    {
        let reqData = commonFunction.trimSpaces(req.body);
        let authData = reqData.authData;
        
        if(reqData.name != undefined && reqData.module != undefined && reqData.module.id != undefined && reqData.userRole != undefined && reqData.userRole.id != undefined)
        {
            if(reqData.name != "" && reqData.module.id != "" && reqData.userRole.id != "")
            {
                name = reqData.name;
                moduleId = commonFunction.validateNumber(reqData.module.id);
                userRoleId = commonFunction.validateNumber(reqData.userRole.id);

            ///Check Module Exist
                module1 = await dbCommon.getModule(moduleId);
                if(module1.length == 1)
                { 
                    ///Check User Role Exist
                    userRole = await dbCommon.getUserRole(moduleId, userRoleId);
                    if(userRole.length == 1)
                    { 
                    ////Check Duplicate User Type
                        userType = await dbCommon.duplicateUserType(moduleId, userRoleId, name);
                        if(userType.length == 0)
                        {                    
                    ///insert User Role
                            let insertJSON = {
                                "name" : name,
                                "moduleId" : moduleId,
                                "userRoleId" : userRoleId,
                                "createdById" : authData.id
                            }
                            let insertUserRoleResult = await dbCommon.insertUserType(insertJSON);
                            let insertUserRoleId = insertUserRoleResult.insertId;
                ///////
                            if(parseInt(insertUserRoleId) > 0)
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
                                    "message" : "User Role Not Saved",
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
                                "message" : "User Type Already Created For Current Module & User Role",
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
                            "message" : "Invalid User Role",
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
                        "message" : "Invalid Module",
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
