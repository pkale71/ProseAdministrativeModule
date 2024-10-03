const commonFunction = require('../util/commonFunctions.js');
let dbUser = require('../sqlmap/userQuery.js');
let dbCommon = require('../sqlmap/commonQuery.js');
let errorCodes = require('../util/errorCodes.js');
let errorCode = new errorCodes();
////////Variables 
let moduleId;
//////
let userUUID;
let module1;
let userModule;

module.exports = require('express').Router().post('/',async(req,res) =>
{
    try
    {
        let reqData = commonFunction.trimSpaces(req.body);
        let authData = reqData.authData;
        
        if(reqData.user != undefined && reqData.user.uuid != undefined && reqData.module != undefined && reqData.module.id != undefined)
        {
            if(reqData.user.uuid != "" && reqData.module.id != "")
            {
                userUUID = reqData.user.uuid;
                moduleId = commonFunction.validateNumber(reqData.module.id);

            ///Check Module Exist
                module1 = await dbCommon.getModule(moduleId);
                if(module1.length == 1)
                {            
            /////Check User Grade
                    let user = await dbUser.getUser(userUUID);
                    if(user[0].userGradeCode != 'HRADM' && user[0].userGradeCode != 'ACADM')
                    {
    ////Check Duplicate User Module
                        userModule = await dbUser.duplicateUserModule(userUUID, moduleId, '', '');
                        if(userModule.length == 0)
                        {                    
                    ///insert User Module
                            let insertJSON = {
                                "userId" : user[0].userId,
                                "moduleId" : moduleId,
                                "createdById" : authData.id
                            }
                            let insertUserModuleResult = await dbUser.insertUserModule(insertJSON);
                            let insertUserModuleId = insertUserModuleResult.insertId;
                ///////
                            if(parseInt(insertUserModuleId) > 0)
                            {
                ////insert User Module History 
                                insertJSON["remark"] = "Created";
                                let insertUserModuleHistoryResult = await dbUser.insertUserModuleHistory(insertJSON);
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
                            "message" : "User Module Not Assigned To " + user[0].userGradeName,
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
