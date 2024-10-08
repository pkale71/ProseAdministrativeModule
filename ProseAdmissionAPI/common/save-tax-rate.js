const commonFunction = require('../util/commonFunctions.js');
let dbCommon = require('../sqlmap/commonQuery.js');
let errorCodes = require('../util/errorCodes.js');
let errorCode = new errorCodes();
//Variables 
let rate;
let academicSessionId;
let taxTypeId;
//
let academicSession;
let taxType;
let taxRate;

module.exports = require('express').Router().post('/',async(req,res) =>
{
    try
    {
        let reqData = commonFunction.trimSpaces(req.body);
        let authData = reqData.authData;
        
        if(reqData.rate != undefined && reqData.academicSession != undefined && reqData.taxType != undefined)
        {
            if(reqData.rate != "" && reqData.academicSession.id != "" && reqData.taxType.id != "")
            {
                rate = commonFunction.validateNumber(reqData.rate);
                academicSessionId = commonFunction.validateNumber(reqData.academicSession.id);
                taxTypeId = commonFunction.validateNumber(reqData.taxType.id);

                let getAcademicSessionUrl = global.adminPortalAPIUrl+"common/getAcademicSession/"+academicSessionId;
                academicSession = await commonFunction.getExternalAPI(getAcademicSessionUrl);                
                if(!academicSession)
                {
                    res.status(500)
                    return res.json({
                        "status_code" : 500,
                        "message" : "Invalid Academic Session",
                        "success" : false,
                        "error" : errorCode.getStatus(500)
                    });
                }

                taxType = await dbCommon.getTaxType(taxTypeId);
                if(taxType.length == 0)
                {
                    res.status(500)
                    return res.json({
                        "status_code" : 500,
                        "message" : "Invalid Tax Type",
                        "success" : false,
                        "error" : errorCode.getStatus(500)
                    });
                }

                //check duplicate tax-rate
                taxRate = await dbCommon.duplicateTaxRate(academicSessionId,taxTypeId, rate, "");
                if(taxRate.length == 0)
                {                    
                    //insert TaxRate
                    let insertJSON = {
                        "rate" : rate,
                        "academicSessionId" : academicSessionId,
                        "taxTypeId" : taxTypeId,
                        "createdById" : authData.id
                    }
                    let insertTaxRateResult = await dbCommon.insertTaxRate(insertJSON);
                    let insertTaxRateId = insertTaxRateResult.insertId;
        
                    if(parseInt(insertTaxRateId) > 0)
                    {
                        res.status(200)
                        return res.json({
                            "status_code" : 200,
                            "success" : true,                            
                            "message" : errorCode.getStatus(200)
                        });
                    }
                    else
                    {
                        res.status(500)
                        return res.json({
                            "status_code" : 500,
                            "message" : "Tax Rate Not Saved",
                            "success" : false,
                            "error" : errorCode.getStatus(500)
                        });
                    }
                }
                else
                {
                    res.status(500)
                    return res.json({
                        "status_code" : 500,
                        "message" : "Tax Rate Already Exist",
                        "success" : false,
                        "error" : errorCode.getStatus(500)
                    });
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
                });
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
            "error" : e
        });
    }
});
