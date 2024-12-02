const commonFunction = require('../util/commonFunctions.js');
let dbUser = require('../sqlmap/userQuery.js');
let dbCommon = require('../sqlmap/commonQuery.js');
let errorCodes = require('../util/errorCodes.js');
let errorCode = new errorCodes();
////////Variables 
let id;
let moduleId;
let userRoleId;
let userTypeId;
//////
let userUUID;
let userRole;
let userType;
let userModule;

module.exports = require('express').Router().post('/',async(req,res) =>
{
    try
    {
        let reqData = commonFunction.trimSpaces(req.body);
        let authData = reqData.authData;
        
        if(reqData.id != undefined && reqData.user != undefined && reqData.user.uuid != undefined && reqData.module != undefined && reqData.module.id != undefined && reqData.userRole != undefined && reqData.userRole.id != undefined && reqData.userType != undefined && reqData.userType.id != undefined)
        {
            if(reqData.id != "" && reqData.user.uuid != "" && reqData.module.id != "" && reqData.userRole.id != "" && reqData.userType.id != "")
            {
                id = commonFunction.validateNumber(reqData.id);
                userUUID = reqData.user.uuid;
                moduleId = commonFunction.validateNumber(reqData.module.id);
                userRoleId = commonFunction.validateNumber(reqData.userRole.id);
                userTypeId = commonFunction.validateNumber(reqData.userType.id);

                ///Check User Type Exist
                userType = await dbCommon.getUserType(moduleId, userRoleId, userTypeId);
                if(userType.length == 1)
                { 
                    ///Check User Role Exist
                    userRole = await dbCommon.getUserRole(moduleId, userRoleId);
                    if(userRole.length == 1)
                    {            
                /////Check User
                        let user = await dbUser.getUser(userUUID);
                        if(user.length > 0)
                        {
        ////Check User Module Exist
                            userModule = await dbUser.getUserModule(id);
                            if(userModule.length == 1)
                            {                    
                        ///update User Module
                                let updateJSON = {
                                    "id" : id,
                                    "userId" : user[0].userId,
                                    "moduleId" : moduleId,
                                    "userRoleId" : userRoleId,
                                    "userTypeId" : userTypeId,
                                    "createdById" : authData.id
                                }
                                let insertUserModuleResult = await dbUser.updateUserModule(updateJSON);
                                
                                if(insertUserModuleResult.affectedRows > 0)
                                {
                    ////insert User Module History 
                                    updateJSON["remark"] = "Assigned";
                                    let insertUserModuleHistoryResult = await dbUser.insertUserModuleHistory(updateJSON);
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
                                        "message" : "User Module Not Saved",
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
                                    "message" : "User Module Already Created For " + user[0].fullName,
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
                                "message" : "Invalid User",
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
                        "message" : "Invalid User Type",
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
