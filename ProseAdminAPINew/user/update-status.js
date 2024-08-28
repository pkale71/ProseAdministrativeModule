const commonFunction = require('../util/commonFunctions.js');
let dbUser = require('../sqlmap/userQuery.js');
let errorCodes = require('../util/errorCodes.js');
let errorCode = new errorCodes();
////////Variables 
let uuid;
let userModuleId;
let action;
//////
let user;

module.exports = require('express').Router().post('/',async(req,res) =>
{
    try
    {
        let reqData = commonFunction.trimSpaces(req.body);
        
        if(reqData.uuid != undefined && reqData.action != undefined)
        {
            if(reqData.uuid != "" && reqData.action != "")
            {
                uuid = reqData.uuid;
                userModuleId = reqData.userModuleId == undefined ? '' : commonFunction.validateNumber(reqData.userModuleId);
                action = reqData.action;
                
            ////Get User
                user = await dbUser.getUser(uuid);
                if(action == "User" && user.length == 1)
                {
                    let updateStatusResult = await dbUser.updateUserStatus(user[0].userId);

                    res.status(200)
                    return res.json({
                        "status_code" : 200,
                        "success" : true,                            
                        "message" : errorCode.getStatus(200)
                    })
                }
                else if(action == "UserModule" && user.length == 1)
                {
                    let updateStatusResult = await dbUser.updateUserModuleStatus(user[0].userId, userModuleId);

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
                        "message" : "Invalid User",
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
