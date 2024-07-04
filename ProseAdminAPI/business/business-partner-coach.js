const buildJSON = require('./buildBusinessJSONs.js');
const commonFunction = require('../util/commonFunctions.js');
let dbBusiness = require('../sqlmap/businessQuery.js');
let errorCodes = require('../util/errorCodes.js');
let errorCode = new errorCodes();
////////Variables
let id; 
//////
let businessPartnerCoach;

module.exports = require('express').Router().get('/:id', async(req,res) =>
{
    try
    {
        id = commonFunction.validateNumber(req.params.id);

        businessPartnerCoach = await dbBusiness.getBusinessPartnerCoach(id);
        if(businessPartnerCoach.length >= 0)
        {
            res.status(200)
            return res.json({
                "businessPartnerCoach" : buildJSON.businessPartnerCoaches(businessPartnerCoach, 0),
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
