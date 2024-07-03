const commonFunction = require('../util/commonFunctions.js');
let dbUser = require('../sqlmap/userQuery.js');
let errorCodes = require('../util/errorCodes.js');
let errorCode = new errorCodes();
////////Variables 
let id;
let action;
//////
let userModule;

module.exports = require('express').Router().post('/',async(req,res) =>
{
    try
    {
        let reqData = commonFunction.trimSpaces(req.body);
        let authData = reqData.authData;
        if(reqData.id != undefined && reqData.action != undefined)
        {
            if(reqData.id != "" && (reqData.action == "Approve" || reqData.action == "Deny"))
            {
                id = commonFunction.validateNumber(reqData.id);
                action = reqData.action;
                
                userModule = await dbUser.getUserModule(id);
                let updateUserModuleResult = await dbUser.approveDenyUserModule(id, action, authData.id);
                if(updateUserModuleResult.affectedRows > 0)
                {
                    ///insert User Module History
                    let insertJSON = {
                        "userId" : userModule[0].userId,
                        "moduleId" : userModule[0].moduleId,
                        "userRoleId" : userModule[0].userRoleId,
                        "userTypeId" : userModule[0].userTypeId,
                        "createdById" : authData.id,
                        "remark" : action
                    }
                    
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
                        "message" : "Invalid User Module",
                        "success" : false,
                        "error" : errorCode.getStatus(500),
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
                    "error" : errorCode.getStatus(500),
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
