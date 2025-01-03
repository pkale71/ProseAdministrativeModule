const buildJSON = require('./buildBusinessJSONs.js');
let dbBusiness = require('../sqlmap/businessQuery.js');
let errorCodes = require('../util/errorCodes.js');
let errorCode = new errorCodes();
////////Variables
let businessPartnerUUID; 
//////
let businessPartner;
let businessPartnerDocuments;

module.exports = require('express').Router().get('/:businessPartnerUUID', async(req,res) =>
{
    try
    {
        businessPartnerUUID = req.params.businessPartnerUUID;

        businessPartner = await dbBusiness.getBusinessPartner(businessPartnerUUID);
        if(businessPartner.length == 1)
        {
            businessPartnerDocuments = await dbBusiness.getBusinessPartnerDocuments(businessPartner[0].id);
            if(businessPartnerDocuments.length >= 0)
            {
                res.status(200)
                return res.json({
                    "businessPartnerDocuments" : buildJSON.businessPartnerDocuments(businessPartnerDocuments),
                    "status_code" : 200,
                    "success" : true,                            
                    "message" : errorCode.getStatus(200)
                })
            } 
        }
        else
        {
            res.status(500)
            return res.json({
                "status_code" : 500,
                "message" : "Invalid Business Partner",
                "success" : false,
                "error" : errorCode.getStatus(500),
            });
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
