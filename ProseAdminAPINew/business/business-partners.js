const buildJSON = require('./buildBusinessJSONs.js');
const commonFunction = require('../util/commonFunctions.js');
let dbBusiness = require('../sqlmap/businessQuery.js');
let errorCodes = require('../util/errorCodes.js');
let errorCode = new errorCodes();
////////Variables
let businessPartnerTypeId; 
let action;
//////
let businessPartners;

module.exports = require('express').Router().get('/?*', async(req,res) =>
{
    try
    {
        businessPartnerTypeId = '';
        action = '';
        
        let tempParams = req.params[0].split("/");
        if(tempParams.length == 1)
        {
            businessPartnerTypeId = commonFunction.validateNumber(tempParams[0]);
        }
        else if(tempParams.length == 2)
        {
            businessPartnerTypeId = commonFunction.validateNumber(tempParams[0]);
            action = tempParams[1];
        }
        
        businessPartners = await dbBusiness.getBusinessPartners(businessPartnerTypeId, action);
        if(businessPartners.length >= 0)
        {
            res.status(200)
            return res.json({
                "businessPartners" : buildJSON.businessPartners(businessPartners),
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
