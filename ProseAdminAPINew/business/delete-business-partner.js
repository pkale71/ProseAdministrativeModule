const buildJSON = require('./buildBusinessJSONs.js');
const commonFunction = require('../util/commonFunctions.js');
let dbBusiness = require('../sqlmap/businessQuery.js');
let errorCodes = require('../util/errorCodes.js');
let errorCode = new errorCodes();
////////Variables
let uuid; 
//////
let businessPartner;

module.exports = require('express').Router().post('/', async(req,res) =>
{
    try
    {
        let reqData = commonFunction.trimSpaces(req.body);
        uuid = reqData.uuid;
        let authData = reqData.authData;
       
        businessPartner = await dbBusiness.getBusinessPartner(uuid);
        if(businessPartner.length == 1)
        {
            ///delete Business Partner
            let deleteBusinessPartnerResult = await dbBusiness.deleteBusinessPartner(businessPartner[0].id, authData.id);
            ///////
            if(deleteBusinessPartnerResult.affectedRows > 0)
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
                res.status(500)
                return res.json({
                    "status_code" : 500,
                    "message" : "Business Partner Already Deleted",
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
                "message" : "Business Partner Not Exist",
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
            "error" : e,
        });
    }
})
