const buildJSON = require('./buildBusinessJSONs.js');
let dbBusiness = require('../sqlmap/businessQuery.js');
let errorCodes = require('../util/errorCodes.js');
let errorCode = new errorCodes();
////////Variables
let businessVerticalId; 
let action;
//////
let businessVerticalGroups;

module.exports = require('express').Router().get('/?*', async(req,res) =>
{
    try
    {
        businessVerticalId = '';
        action = '';

        let tempParams = req.params[0];
        if(tempParams.length == 1)
        {
            businessVerticalId = commonFunction.validateNumber(tempParams[0]);
        }
        else if(tempParams.length == 2)
        {
            businessVerticalId = commonFunction.validateNumber(tempParams[0]);
            action = tempParams[1];
        }

        businessVerticalGroups = await dbBusiness.getBusinessVerticalGroups(businessVerticalId, action);
        if(businessVerticalGroups.length >= 0)
        {
            res.status(200)
            return res.json({
                "businessVerticalGroups" : buildJSON.businessVerticalGroups(businessVerticalGroups),
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
