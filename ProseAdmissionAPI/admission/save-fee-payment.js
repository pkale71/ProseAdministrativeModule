const commonFunction = require('../util/commonFunctions.js');
let dbCommon = require('../sqlmap/commonQuery.js');
let dbAdmission = require('../sqlmap/admissionQuery.js');
let errorCodes = require('../util/errorCodes.js');
let errorCode = new errorCodes();
let fs = require('fs');
const path = require("path");

//Variables 
let applicationUUID;
let applicationFeeInstallmentIds;
let paymentMethodId;
let paymentDate;
let bankReference;
let amounts;
let totalAmount;
//
let applicationForm;
let applicationFeeInstallment;
let paymentMethod;

module.exports = require('express').Router().post('/',async(req,res) =>
{
    try
    {
        let reqData = commonFunction.trimSpaces(req.body);
        let authData = reqData.authData;
        
        if(reqData.application != undefined && reqData.applicationFeeInstallment != undefined && reqData.paymentMethod != undefined && reqData.paymentDate != undefined && reqData.bankReference != undefined && reqData.amount != undefined && reqData.totalAmount != undefined)
        {
            if(reqData.application.uuid != "" && reqData.applicationFeeInstallment.id != "" && reqData.paymentMethod.id != "" && reqData.paymentDate != "" && reqData.amount != "" && reqData.totalAmount != "")
            {
                applicationUUID = reqData.application.uuid;
                applicationFeeInstallmentIds = reqData.applicationFeeInstallment.id;
                paymentMethodId = commonFunction.validateNumber(reqData.paymentMethod.id);
                paymentDate = reqData.paymentDate;
                bankReference = reqData.bankReference;
                amounts = reqData.amount;
                totalAmount = commonFunction.validateNumber(reqData.totalAmount);

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
                
                if(!commonFunction.isValidDate(paymentDate))
                {
                    res.status(500)
                    return res.json({
                        "status_code" : 500,
                        "message" : "Invalid Payment Date",
                        "success" : false,
                        "error" : errorCode.getStatus(500)
                    });
                }

                paymentMethod = await dbAdmission.getPaymentMethod(paymentMethodId);
                if(paymentMethod.length == 0)
                {
                    res.status(500)
                    return res.json({
                        "status_code" : 500,
                        "message" : "Invalid Payment Method",
                        "success" : false,
                        "error" : errorCode.getStatus(500)
                    });
                }

                applicationFeeInstallment = await dbAdmission.checkApplicationFeeInstallmentExist(applicationForm[0].id, applicationFeeInstallmentIds);
                if(applicationFeeInstallment.length == 0)
                {
                    res.status(500)
                    return res.json({
                        "status_code" : 500,
                        "message" : "Invalid Fee Installment",
                        "success" : false,
                        "error" : errorCode.getStatus(500)
                    });
                }
                                    
                //update Application Form
                let insertJSON = {
                    "applicationFormId" : applicationForm[0].id,
                    "feeInstallment" : applicationFeeInstallment,
                    "paymentDate" : paymentDate,
                    "amounts" : amounts.toString().split(","),
                    "totalAmount" : totalAmount,
                    "paymentMethodId" : paymentMethodId,
                    "bankReference" : bankReference,
                    "createdById" : authData.id
                }                
                let insertPaymentResult = await dbAdmission.insertApplicationFeePayment(insertJSON);
                let insertPaymentId = insertPaymentResult.insertId;
                if(parseInt(insertPaymentId) > 0)
                {
                    res.status(200)
                    return res.json({
                        "id" : insertPaymentId,
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
                        "message" : "Fee Payment Not Saved",
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
            "error" : e?.stack
        });
    }
});