const commonFunction = require('../util/commonFunctions.js');
const buildJSON = require('./buildUserJSONs.js');
let dbUser = require('../sqlmap/userQuery.js');
let errorCodes = require('../util/errorCodes.js');
let errorCode = new errorCodes();
////////Variables 
let code;
let baseUrl;
let linkUrl;
let emailBody;
//////
let userOnBoarding;

module.exports = require('express').Router().post('/',async(req,res) =>
{
    try
    {
        let reqData = commonFunction.trimSpaces(req.body);
        let authData = reqData.authData;
        baseUrl = req.protocol + '://' + req.get('host');

        if(reqData.code != undefined && reqData.linkUrl != undefined)
        {
            if(reqData.code != "" && reqData.linkUrl != "")
            {
                code = reqData.code;
                linkUrl = reqData.linkUrl;

            //////get user on-boarding links
                userOnBoarding = await dbUser.getUserOnBoardingLink(code);
                if(userOnBoarding.length == 1)
                {
                    emailBody = commonFunction.onBoardingEmailBody(linkUrl, userOnBoarding[0].email);
                    let fullName = commonFunction.getUserNameFromEmail(userOnBoarding[0].email);
                //////////
                    let emailRes = await commonFunction.sendMail(userOnBoarding[0].email, fullName, emailBody);
                    if(emailRes)
                    {
                ////Update On-Boarding Link Sent
                        let updateUserOnBoardingResult = await dbUser.updateUserOnBoardingLinkSent(code);
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
                            "message" : "On-Boarding Link Not Sent",
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
                        "message" : "Invalid On-Boarding Link OR User On-Boarding Completed",
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
