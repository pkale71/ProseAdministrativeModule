const commonFunction = require('../util/commonFunctions.js');
const buildJSON = require('./buildUserJSONs.js');
let dbUser = require('../sqlmap/userQuery.js');
let errorCodes = require('../util/errorCodes.js');
let errorCode = new errorCodes();
////////Variables 
let code;
//////
let userOnBoarding;

module.exports = require('express').Router().get('/:code',async(req,res) =>
{
    try
    {
        code = req.params?.code;
       
    //////get user on-boarding links
        userOnBoarding = await dbUser.getUserOnBoardingLink(code);
        if(userOnBoarding.length > 0)
        {
            res.status(200)
            return res.json({
                "userOnBoardingLink" : buildJSON.userOnBoarding(userOnBoarding, 0),
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
                "message" : "Invalid On-Boarding Link OR User On-Boarding Completed",
                "success" : false,
                "error" : errorCode.getStatus(500),
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
