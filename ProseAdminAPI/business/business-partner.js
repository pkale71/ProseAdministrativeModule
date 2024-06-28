const buildJSON = require('./buildBusinessJSONs.js');
let dbBusiness = require('../sqlmap/businessQuery.js');
let errorCodes = require('../util/errorCodes.js');
let errorCode = new errorCodes();
////////Variables
let uuid; 
//////
let businessPartner;

module.exports = require('express').Router().get('/:uuid', async(req,res) =>
{
    try
    {
        uuid = req.params.uuid;
        
        businessPartner = await dbBusiness.getBusinessPartner(uuid);
        if(businessPartner.length == 1)
        {
            res.status(200)
            return res.json({
                "businessPartner" : buildJSON.businessPartner(businessPartner),
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
