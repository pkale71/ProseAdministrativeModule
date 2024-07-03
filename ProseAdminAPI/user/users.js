const commonFunction = require('../util/commonFunctions.js');
const buildJSON = require('./buildUserJSONs.js');
let dbUser = require('../sqlmap/userQuery.js');
let errorCodes = require('../util/errorCodes.js');
let errorCode = new errorCodes();
////////Variables 
let userGradeId;
let userCategoryId;
let action;
//////
let users;

module.exports = require('express').Router().get('/?*',async(req,res) =>
{
    try
    {
        userGradeId = '';
        userCategoryId = '';
        action = '';

        let tempParams = req.params[0].split("/");
        if(tempParams.length == 1)
        {
            userGradeId = commonFunction.validateNumber(tempParams[0]);
        }
        else if(tempParams.length == 2)
        {
            userGradeId = commonFunction.validateNumber(tempParams[0]);
            userCategoryId = commonFunction.validateNumber(tempParams[1]);
        }
        else if(tempParams.length == 3)
        {
            userGradeId = commonFunction.validateNumber(tempParams[0]);
            userCategoryId = commonFunction.validateNumber(tempParams[1]);
            action = tempParams[2];
        }
    //////get users
        users = await dbUser.getUsers(userGradeId, userCategoryId, action);
        if(users.length >= 0)
        {
            res.status(200)
            return res.json({
                "user" : buildJSON.user(users),
                "status_code" : 200,
                "success" : true,                            
                "message" : errorCode.getStatus(200)
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
