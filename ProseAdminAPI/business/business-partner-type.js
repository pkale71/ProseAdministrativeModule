const buildJSON = require('./buildBusinessJSONs.js');
let dbBusiness = require('../sqlmap/businessQuery.js');
let errorCodes = require('../util/errorCodes.js');
let errorCode = new errorCodes();
////////Variables
let id; 
//////
let businessPartnerType;

module.exports = require('express').Router().get('/:id', async(req,res) =>
{
    try
    {
        id = req.params.id;
        businessPartnerType = await dbBusiness.getBusinessPartnerType(id);
        if(businessPartnerType.length >= 0)
        {
            res.status(200)
            return res.json({
                "businessPartnerType" : buildJSON.businessPartnerTypes(businessPartnerType, 0),
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
