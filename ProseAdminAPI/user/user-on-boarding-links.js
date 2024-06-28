const commonFunction = require('../util/commonFunctions.js');
const buildJSON = require('./buildUserJSONs.js');
let dbUser = require('../sqlmap/userQuery.js');
let errorCodes = require('../util/errorCodes.js');
let errorCode = new errorCodes();
////////Variables 
let status;
//////
let userOnBoarding;

module.exports = require('express').Router().get('/:status',async(req,res) =>
{
    try
    {
        status = req.params?.status;
       
    //////get user on-boarding links
        userOnBoarding = await dbUser.getUserOnBoardingLinks(status);
        if(userOnBoarding.length >= 0)
        {
            res.status(200)
            return res.json({
                "userOnBoardingLinks" : buildJSON.userOnBoarding(userOnBoarding),
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
