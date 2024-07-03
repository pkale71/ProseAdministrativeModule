const buildJSON = require('./buildCommonJSONs.js');
let dbCommon = require('../sqlmap/commonQuery.js');
let errorCodes = require('../util/errorCodes.js');
let errorCode = new errorCodes();
////////Variables 
//////
let userGrades;

module.exports = require('express').Router().get('/', async(req,res) =>
{
    try
    {
        userGrades = await dbCommon.getUserGrades();
        if(userGrades.length >= 0)
        {
            res.status(200)
            return res.json({
                "userGrades" : buildJSON.userGrades(userGrades),
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
            "error" : e,
        });
    }
})
