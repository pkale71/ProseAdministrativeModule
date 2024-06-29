const commonFunction = require('../util/commonFunctions.js');
let dbBusiness = require('../sqlmap/businessQuery.js');
let dbCommon = require('../sqlmap/commonQuery.js');
let errorCodes = require('../util/errorCodes.js');
let errorCode = new errorCodes();
////////Variables 
let businessPartnerUUID;
let contractFrom;
let contractTo;
//////
let businessPartner;

module.exports = require('express').Router().post('/',async(req,res) =>
{
    try
    {
        let reqData = commonFunction.trimSpaces(req.body);
        let authData = reqData.authData;
        
        if(reqData.businessPartner != undefined && reqData.contractFrom != undefined && reqData.contractTo != undefined)
        {
            if(reqData.businessPartner.uuid != "" && reqData.contractFrom != "" && reqData.contractTo != "")
            {
                businessPartnerUUID = reqData.businessPartner.uuid;
                contractFrom = reqData.contractFrom;
                contractTo = reqData.contractTo;

            /////check ContractFrom and isContractTo
                if(!commonFunction.isValidDate(contractFrom, "YYYY-MM-DD") || !commonFunction.isValidDate(contractTo, "YYYY-MM-DD"))
                { 
                    res.status(500)
                    return res.json({
                        "status_code" : 500,
                        "message" : "Invalid Date Format In ContractFrom or ContractTo",
                        "success" : false,
                        "error" : errorCode.getStatus(500)
                    })
                }
                ////Check Business Partner Exist
                businessPartner = await dbBusiness.getBusinessPartner(businessPartnerUUID);
                if(businessPartner.length == 1)
                {  
                /////check Contract Already Created For Particular Date
                    let contractExist = await dbBusiness.checkBusinessPartnerContractExist(contractFrom, contractTo, businessPartner[0].id, '');
                    if(contractExist.length > 0)
                    { 
                        res.status(500)
                        return res.json({
                            "status_code" : 500,
                            "message" : "Contract Already Exist For Particular Duration In Contract From or Contract To",
                            "success" : false,
                            "error" : errorCode.getStatus(500)
                        })
                    }
                    let insertContractJSON = {
                        "businessPartnerId" : businessPartner[0].id,
                        "contractFrom" : contractFrom,
                        "contractTo" : contractTo,
                        "createdById" : authData.id
                    }
                    let insertBusinessPartnerContractResult = await dbBusiness.insertBusinessPartnerContractHistory(insertContractJSON);
                    if(insertBusinessPartnerContractResult.affectedRows > 0)
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
                            "message" : "Business Partner Contract Not Saved",
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