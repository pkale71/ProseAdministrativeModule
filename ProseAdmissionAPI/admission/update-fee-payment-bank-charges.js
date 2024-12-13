const commonFunction = require('../util/commonFunctions.js');
let dbAdmission = require('../sqlmap/admissionQuery.js');
let errorCodes = require('../util/errorCodes.js');
let errorCode = new errorCodes();
//Variables 
let applicationUUID;
let amount;
let feePaymentId;
//
let applicationForm;

module.exports = require('express').Router().post('/',async(req,res) =>
{
    try
    {
        let reqData = commonFunction.trimSpaces(req.body);
        let authData = reqData.authData;
        
        if(reqData.application != undefined && reqData.feePayment != undefined && reqData.amount != undefined)
        {
            if(reqData.application.uuid != "" && reqData.feePayment.id != "" && reqData.amount != "")
            {
                applicationUUID = reqData.application.uuid;
                feePaymentId = commonFunction.validateNumber(reqData.feePayment.id);
                amount = commonFunction.validateNumber(reqData.amount);
                
                applicationForm = await dbAdmission.checkValidApplicationForm(applicationUUID,'','B2C');
                if(applicationForm.length == 0)
                {
                    res.status(500)
                    return res.json({
                        "status_code" : 500,
                        "message" : "Invalid Application Form",
                        "success" : false,
                        "error" : errorCode.getStatus(500)
                    });
                }                                     
                //update bank charges
                let updateJSON = {
                    "applicationId" : applicationForm[0].id,
                    "feePaymentId" : feePaymentId,
                    "amount" : amount
                }
                let updateFeePaymentResult = await dbAdmission.updateFeePaymentBankCharges(updateJSON);
                if(updateFeePaymentResult.affectedRows > 0)
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
                        "message" : "Bank Charges Not Saved",
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
