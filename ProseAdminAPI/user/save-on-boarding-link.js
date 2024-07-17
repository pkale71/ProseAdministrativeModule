const commonFunction = require('../util/commonFunctions.js');
let dbUser = require('../sqlmap/userQuery.js');
let errorCodes = require('../util/errorCodes.js');
let errorCode = new errorCodes();
////////Variables 
let code;
let email;
let mobile;
//////

module.exports = require('express').Router().post('/',async(req,res) =>
{
    try
    {
        let reqData = commonFunction.trimSpaces(req.body);
        let authData = reqData.authData;
        
        if(reqData.email != undefined && reqData.mobile != undefined)
        {
            if(reqData.email != "" && reqData.mobile != "")
            {
                email = reqData.email;
                mobile = reqData.mobile;
                code = commonFunction.ramdomString(6);
                
            ///Check User OnBoarding Exist
                let userOnBoarding = await dbUser.userOnBoardingExist(email, mobile);
                if(userOnBoarding.length == 0)
                {                 
                ///insert User On Boarding
                    let insertJSON = {
                        "code" : code,
                        "email" : email,
                        "mobile" : mobile,
                        "createdById" : authData.id
                    }
                    let insertUserOnBoardingResult = await dbUser.insertUserOnBoarding(insertJSON);
                    let insertUserOnBoardingId = insertUserOnBoardingResult.insertId;
        ///////
                    if(parseInt(insertUserOnBoardingId) > 0)
                    {
                        res.status(200)
                        return res.json({
                            "code" : insertJSON.code,
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
                            "message" : "User On Boarding Link Not Saved",
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
                        "message" : "User On-Boarding Link Or User Already Exist With Same Email Or Mobile",
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
