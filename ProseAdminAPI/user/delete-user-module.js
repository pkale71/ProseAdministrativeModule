const commonFunction = require('../util/commonFunctions.js');
let dbUser = require('../sqlmap/userQuery.js');
let errorCodes = require('../util/errorCodes.js');
let errorCode = new errorCodes();
////////Variables 
let id;
let userUUID;
//////
let user;
let userModule;

module.exports = require('express').Router().post('/',async(req,res) =>
{
    try
    {
        let reqData = commonFunction.trimSpaces(req.body);
        let authData = reqData.authData;
        if(reqData.id != undefined && reqData.user != undefined && reqData.user.uuid != undefined)
        {
            if(reqData.id != "" && reqData.user.uuid != "")
            {
                id = commonFunction.validateNumber(reqData.id);
                userUUID = reqData.user.uuid;

                user = await dbUser.getUser(userUUID);
                userModule = await dbUser.getUserModule(id);

                let deleteUserModuleResult = await dbUser.deleteUserModule(id, user[0].userId);
                if(deleteUserModuleResult.affectedRows > 0)
                {
        ///insert User Module History
                    let insertJSON = {
                        "userId" : userModule[0].userId,
                        "moduleId" : userModule[0].moduleId,
                        "userRoleId" : userModule[0].userRoleId,
                        "userTypeId" : userModule[0].userTypeId,
                        "createdById" : authData.id,
                        "remark" : "Delete"
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
                        "message" : "User Module Already Deleted",
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
