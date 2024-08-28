const commonFunction = require('../util/commonFunctions.js');
let dbBusiness = require('../sqlmap/businessQuery.js');
let dbCommon = require('../sqlmap/commonQuery.js');
let errorCodes = require('../util/errorCodes.js');
let errorCode = new errorCodes();
////////Variables 
let businessPartnerUUID;
let businessPartnerContractId;
//////
let businessPartner;

module.exports = require('express').Router().post('/',async(req,res) =>
{
    try
    {
        let reqData = commonFunction.trimSpaces(req.body);
        let authData = reqData.authData;
        
        if(reqData.businessPartner != undefined && reqData.id != undefined)
        {
            if(reqData.businessPartner.uuid != "" && reqData.id != "")
            {
                businessPartnerUUID = reqData.businessPartner.uuid;
                businessPartnerContractId = commonFunction.validateNumber(reqData.id);

                ////Check Business Partner Exist
                businessPartner = await dbBusiness.getBusinessPartner(businessPartnerUUID);
                if(businessPartner.length == 1)
                {  
                /////check Contract Exist
                    let contractExist = await dbBusiness.checkBusinessPartnerContractExist('', '', businessPartner[0].id, businessPartnerContractId);
                    if(contractExist.length == 0)
                    { 
                        res.status(500)
                        return res.json({
                            "status_code" : 500,
                            "message" : "Invalid Business Partner Contract",
                            "success" : false,
                            "error" : errorCode.getStatus(500)
                        })
                    }
                    let deleteContractJSON = {
                        "businessPartnerId" : businessPartner[0].id,
                        "id" : businessPartnerContractId
                    }
                    let deleteBusinessPartnerContractResult = await dbBusiness.deleteBusinessPartnerContractHistory(deleteContractJSON);
                    if(deleteBusinessPartnerContractResult.affectedRows > 0)
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
                            "message" : "Business Partner Contract Already Deleted",
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
            else
            {   
                res.status(500)
                return res.json({
                    "status_code" : 500,
                    "message" : "Some Values Are Not Filled",
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
                "message" : "JSON Error",
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
            "error" : e
        });
    }
})