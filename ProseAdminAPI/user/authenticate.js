const commonFunction = require('../util/commonFunctions.js');
let dbUser = require('../sqlmap/userQuery.js');
const buildJSON = require('./buildUserJSONs.js');
let errorCodes = require('../util/errorCodes.js');
let errorCode = new errorCodes();
////////Variables 
let email;
let password;
//////
let user;
let userModules;

module.exports = require('express').Router().post('/',async(req,res) =>
{
    try
    {
        let reqData = commonFunction.trimSpaces(req.body);
        if(reqData.email != undefined && reqData.password != undefined)
        {
            if(reqData.email != "" && reqData.password != "")
            {
                email = reqData.email;
                password = reqData.password;
                
            ////Check User Auth
                user = await dbUser.authenticateUser(email, password);
                if(user.length == 1)
                {
                    let userModuleAssigned = 1;
                    if(user[0].userGradeCode != 'HRADM' && user[0].userGradeCode != 'ACADM')
                    {
            ////Get User Module
                        userModules = [];
                        userModules = await dbUser.getUserModules(user[0].userUUID, 'Approved');
                        if(userModules.length == 0)
                        {
                            userModuleAssigned = 0;
                        }

                    }
                    if(parseInt(userModuleAssigned) == 0)
                    {
                        res.status(500)
                        return res.json({
                            "status_code" : 500,
                            "message" : "User Module Not Assigned",
                            "success" : false,
                            "error" : errorCode.getStatus(500)
                        })
                    }
                    let authToken = commonFunction.generateToken(56);
                    let autoTokenResult = await dbUser.updateAuthToken(authToken, user[0].userId);
                    
                    if(autoTokenResult.affectedRows > 0)
                    {
                        let loginLogoutHistoryJSON = {
                            "userId" : user[0].userId,
                            "authToken" : authToken,
                            "logoutAs" : 'Forced'
                        }
                        let loginLogoutHistoryResult = await dbUser.insertLoginLogoutHistory(loginLogoutHistoryJSON);
                        
                        let userGradeJSON = {
                            "id" : user[0].userGradeId,
                            "name" : user[0].userGradeName,
                            "code" : user[0].userGradeCode
                        };

                        let userCategoryJSON = {
                            "id" : user[0].userCategoryId,
                            "name" : user[0].userCategoryName,
                            "code" : user[0].userCategoryCode
                        };

                        let finalJSON = {
                            "authToken" : authToken,
                            "uuid" : user[0].userUUID,
                            "name" : user[0].fullName,
                            "email" : user[0].userEmail,
                            "mobile" : user[0].userMobile,
                            "gender" : user[0].userGender,
                            "userGrade" : userGradeJSON,
                            "userCategory" : userCategoryJSON
                        };

                        if(userModules)
                        {
                            let userModuleJSON = buildJSON.userModules(userModules);
                            finalJSON["userModules"] = userModuleJSON;
                        }

                        res.status(200)
                        return res.json({
                            "authData" : finalJSON,
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
                            "message" : "Authentication Failed",
                            "success" : false,
                            "error" : errorCode.getStatus(500)
                        })
                    }
                }
                else
                {
                    res.status(401)
                    return res.json({
                        "authData" : null,
                        "status_code" : 401,
                        "message" : "Authentication Failed",
                        "success" : false,
                        "error" : errorCode.getStatus(401)
                    })
                }
            }
            else
            {
                res.status(500)
                return res.json({
                    "status_code" : 500,
                    "message" : "Invalid email or password",
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
            "message" : "Invalid email or password",
            "success" : false,
            "error" : e
        });
    }
})
