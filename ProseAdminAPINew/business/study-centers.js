const buildJSON = require('./buildBusinessJSONs.js');
const commonFunction = require('../util/commonFunctions.js');
let dbBusiness = require('../sqlmap/businessQuery.js');
let errorCodes = require('../util/errorCodes.js');
let errorCode = new errorCodes();
////////Variables
let studyCenterTypeId;
let action;
//////
let studyCenters;

module.exports = require('express').Router().get('/?*', async(req,res) =>
{
    try
    {
        studyCenterTypeId = '';
        action = '';
        let tempParams = req.params[0];
        tempParams = tempParams.toString().split("/");
        
        if(tempParams.length == 1)
        {
            studyCenterTypeId = commonFunction.validateNumber(tempParams[0]);
        }
        else if(tempParams.length == 2)
        {
            studyCenterTypeId = commonFunction.validateNumber(tempParams[0]);
            action = tempParams[1];
        }
        
        studyCenters = await dbBusiness.getStudyCenters(studyCenterTypeId, action);
        if(studyCenters.length >= 0)
        {
            res.status(200)
            return res.json({
                "studyCenters" : buildJSON.studyCenters(studyCenters),
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
