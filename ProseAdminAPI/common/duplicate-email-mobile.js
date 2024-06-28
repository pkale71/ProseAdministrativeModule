const buildJSON = require('./buildCommonJSONs.js');
let dbCommon = require('../sqlmap/commonQuery.js');
let errorCodes = require('../util/errorCodes.js');
const commonFunction = require('../util/commonFunctions.js');
let errorCode = new errorCodes();
////////Variables 
//////
let emailMobile;
let actionOn;
let tableName;

module.exports = require('express').Router().post('/', async(req,res) =>
{
    try
    {
        let reqData = commonFunction.trimSpaces(req.body);
        if(reqData.emailMobile != undefined && reqData.actionOn != undefined)
        {
            if(reqData.emailMobile != "" && reqData.actionOn != "")
            {
                emailMobile = reqData.emailMobile;
                actionOn = reqData.actionOn;
                tableName = reqData.tableName;
                let msg = "Invalid Data";
                
                let result = await dbCommon.checkDuplicateEmailMobile(emailMobile, actionOn, tableName);
                if(result.length == 0)
                {
                    res.status(200)
                    return res.json({
                        "status_code" : 200,
                        "success" : true,                            
                        "message" : errorCode.getStatus(200)
                    })
                }
                else
                {
                    if(actionOn == "Email")
                    {
                        msg = "Duplicate Email";
                    }
                    else if(actionOn == "Mobile")
                    {
                        msg = "Duplicate Mobile";
                    }
                    res.status(500)
                    return res.json({
                        "status_code" : 500,
                        "message" : msg,
                        "success" : false,
                        "error" : errorCode.getStatus(500)
                    });
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
