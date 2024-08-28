const buildJSON = require('./buildBusinessJSONs.js');
const commonFunction = require('../util/commonFunctions');
let dbBusiness = require('../sqlmap/businessQuery.js');
let errorCodes = require('../util/errorCodes.js');
let errorCode = new errorCodes();
////////Variables
let businessVerticalId;
let businessVerticalTypeId;
let action;
//////
let coaches;

module.exports = require('express').Router().get('/?*', async(req,res) =>
{
    try
    {
        businessVerticalTypeId = '';
        action = '';

        let tempParams = req.params[0].split("/");
        if(tempParams.length == 1)
        {
            businessVerticalId = commonFunction.validateNumber(tempParams[0]);
        }
        else if(tempParams.length == 2)
        {
            businessVerticalId = commonFunction.validateNumber(tempParams[0]);
            businessVerticalTypeId = commonFunction.validateNumber(tempParams[1]);
        }
        else if(tempParams.length == 3)
        {
            businessVerticalId = commonFunction.validateNumber(tempParams[0]);
            businessVerticalTypeId = commonFunction.validateNumber(tempParams[1]);
            action = tempParams[2];
        }

        coaches = await dbBusiness.getCoaches(businessVerticalId, businessVerticalTypeId, action);
        if(coaches.length >= 0)
        {
            res.status(200)
            return res.json({
                "coaches" : buildJSON.coaches(coaches),
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
