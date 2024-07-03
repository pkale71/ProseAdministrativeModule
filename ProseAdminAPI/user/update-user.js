const commonFunction = require('../util/commonFunctions.js');
let dbUser = require('../sqlmap/userQuery.js');
let errorCodes = require('../util/errorCodes.js');
let errorCode = new errorCodes();
////////Variables 
let uuid;
let userGradeId;
let userCategoryId;
//////
let user;
let userOnBoarding;

module.exports = require('express').Router().post('/',async(req,res) =>
{
    try
    {
        let reqData = commonFunction.trimSpaces(req.body);
        let authData = reqData.authData;
        
        if(reqData.uuid != undefined && reqData.userGrade != undefined && reqData.userGrade.id != undefined && reqData.userCategory != undefined && reqData.userCategory.id != undefined)
        {
            if(reqData.uuid != "" && reqData.userGrade?.id != "")
            {
                uuid = reqData.uuid;
                userGradeId = commonFunction.validateNumber(reqData.userGrade.id);
                userCategoryId = commonFunction.validateNumber(reqData.userCategory.id);
                
        ///update User
                let updateJSON = {
                    "uuid" : uuid,
                    "userGradeId" : userGradeId,
                    "userCategoryId" : userCategoryId,
                    "createdById" : authData.id
                }
                let updateUserResult = await dbUser.updateUser(updateJSON);
    
                if(updateUserResult.affectedRows > 0)
                {
                    res.status(200)
                    return res.json({
                        "uuid" : updateJSON.uuid,
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
                        "message" : "User Not Saved",
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
