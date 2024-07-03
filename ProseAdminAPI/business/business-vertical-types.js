const buildJSON = require('./buildBusinessJSONs.js');
const commonFunction = require('../util/commonFunctions.js');
let dbBusiness = require('../sqlmap/businessQuery.js');
let errorCodes = require('../util/errorCodes.js');
let errorCode = new errorCodes();
////////Variables
let businessVerticalId;
let businessVerticalGroupId;
let action;
//////
let businessVerticalTypes;

module.exports = require('express').Router().get('/?*', async(req,res) =>
{
    try
    {
        businessVerticalId = '';
        businessVerticalGroupId = '';
        action = '';

        let tempParams = req.params[0].split("/");
        if(tempParams.length == 1)
        {
            businessVerticalId = commonFunction.validateNumber(tempParams[0]);
        }
        else if(tempParams.length == 2)
        {
            businessVerticalId = commonFunction.validateNumber(tempParams[0]);
            businessVerticalGroupId = commonFunction.validateNumber(tempParams[1]);
        }
        else if(tempParams.length == 3)
        {
            businessVerticalId = commonFunction.validateNumber(tempParams[0]);
            businessVerticalGroupId = commonFunction.validateNumber(tempParams[1]);
            action = tempParams[2];
        }

        businessVerticalTypes = await dbBusiness.getBusinessVerticalTypes(businessVerticalId, businessVerticalGroupId, action);
        if(businessVerticalTypes.length >= 0)
        {
            res.status(200)
            return res.json({
                "businessVerticalTypes" : buildJSON.businessVerticalTypes(businessVerticalTypes),
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
