const commonFunction = require('../util/commonFunctions.js');
let dbCommon = require('../sqlmap/commonQuery.js');
let dbAdmission = require('../sqlmap/admissionQuery.js');
let errorCodes = require('../util/errorCodes.js');
let errorCode = new errorCodes();
//Variables 
let applicationUUID;
let feeStructureUUID;
let otherDiscount;
let tieUpSchoolUUID;
//
let applicationForm;
let tieupSchool;
let feeStructure;
let feeStructureTaxRate;
let applicationStatus;

module.exports = require('express').Router().post('/',async(req,res) =>
{
    try
    {
        let reqData = commonFunction.trimSpaces(req.body);
        let authData = reqData.authData;
        
        if(reqData.application != undefined && reqData.feeStructure != undefined && reqData.otherDiscount != undefined && reqData.tieupSchool != undefined)
        {
            if(reqData.application.uuid != "" && reqData.feeStructure.uuid != "" && reqData.otherDiscount != "")
            {
                applicationUUID = reqData.application.uuid;
                feeStructureUUID = reqData.feeStructure.uuid;
                otherDiscount = commonFunction.validateNumber(reqData.otherDiscount, 'Yes');
                tieUpSchoolUUID = reqData.tieupSchool.uuid;
                
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

                if(tieUpSchoolUUID != "")
                {
                    let getTieupSchoolUrl = global.adminPortalAPIUrl+"business/getTieUpSchool/"+tieUpSchoolUUID;
                    tieupSchool = await commonFunction.getExternalAPI(getTieupSchoolUrl);      
                    if(!tieupSchool)
                    {
                        res.status(500)
                        return res.json({
                            "status_code" : 500,
                            "message" : "Invalid Tie-up School",
                            "success" : false,
                            "error" : errorCode.getStatus(500)
                        });
                    }
                }
                
                feeStructure = await dbCommon.getFeeStructure(feeStructureUUID);
                if(feeStructure.length == 0)
                {
                    res.status(500)
                    return res.json({
                        "status_code" : 500,
                        "message" : "Invalid Fee Structure",
                        "success" : false,
                        "error" : errorCode.getStatus(500)
                    });
                }
                else
                {
                    if(feeStructure[0].taxApplicable == 1)
                    {
                        let admissionDate = commonFunction.getFormattedDate(applicationForm[0].admissionDate, "yyyy-mm-dd");
                        feeStructureTaxRate = await dbCommon.checkFeeStructureTaxRateForAdmission(feeStructure[0].id, admissionDate);
                        if(feeStructureTaxRate.length == 0)
                        {
                            res.status(500)
                            return res.json({
                                "status_code" : 500,
                                "message" : "Tax Rate Is Not Configured For The Fee Structure Within Admission Date Period",
                                "success" : false,
                                "error" : errorCode.getStatus(500)
                            });
                        }
                    }
                }

                let otherDiscountType = await dbCommon.getDiscountTypeByCode('ODIS');
                if(otherDiscountType.length == 0)
                {
                    res.status(500)
                    return res.json({
                        "status_code" : 500,
                        "message" : "Other Discount Type Not Found",
                        "success" : false,
                        "error" : errorCode.getStatus(500)
                    });
                }
                
                applicationStatus = await dbAdmission.getApplicationFormStatus('Fee Configured', '');
                if(applicationStatus.length == 0)
                {
                    res.status(500)
                    return res.json({
                        "status_code" : 500,
                        "message" : "Invalid Application Form Status",
                        "success" : false,
                        "error" : errorCode.getStatus(500)
                    });
                }
                let feeStructureJSON = await generateFeeStructure(feeStructure[0].id, otherDiscountType[0].id, otherDiscount, feeStructure[0].taxApplicable == 1 ? feeStructureTaxRate[0].taxRateId : ""); 
                    
                //update Application Form
                let updateJSON = {
                    "applicationFormId" : applicationForm[0].id,
                    "feeStructureId" : feeStructure[0].id,
                    "otherDiscount" : otherDiscount,
                    "tieupSchoolId" : tieupSchool ? tieupSchool.id : "",
                    "fees" : feeStructureJSON,
                    "createdById" : authData.id,
                    "applicationStatusId" : applicationStatus[0].id
                }                
            
                let updateApplicationResult = await dbAdmission.updateB2CApplicationForm2(updateJSON);
                
                if(updateApplicationResult.affectedRows > 0)
                {
                    res.status(200)
                    return res.json({
                        "uuid" : applicationUUID,
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
                        "message" : "Application Form Fee Structure Not Configured",
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

async function generateFeeStructure(feeStructureId, otherDiscountId, otherDiscount, taxRateId)
{
    let finalJSON = [];

    let feeStructureFeeTypes = await dbCommon.getFeeStructureFeeTypes(feeStructureId);
/////Add In JSON  
    finalJSON['feeTypes'] = [];
    for(let i=0;i<feeStructureFeeTypes.length;i++)
    {
        finalJSON['feeTypes'].push({
            "feeTypeId" : feeStructureFeeTypes[i].feeTypeId,
            "amount" : feeStructureFeeTypes[i].amount
        });
    }
    let feeStructureDiscountTypes = await dbCommon.getFeeStructureDiscountTypes(feeStructureId);
/////Add In JSON 
    finalJSON['discountTypes'] = [];
    for(let i=0;i<feeStructureDiscountTypes.length;i++)
    {
        finalJSON['discountTypes'].push({
            "discountTypeId" : feeStructureDiscountTypes[i].discountTypeId,
            "amount" : feeStructureDiscountTypes[i].amount
        });
    }
///Add Other Discount
    finalJSON['discountTypes'].push({
        "discountTypeId" : otherDiscountId,
        "amount" : otherDiscount
    });

    let feeStructureTotals = await dbCommon.getFeeStructureTotals(feeStructureId);
    if(taxRateId != "")
    {
        feeStructureTotals = feeStructureTotals.filter(total => total.taxRateId == taxRateId);
    }
    let totalDiscount = (parseFloat(feeStructureTotals[0].totalDiscount) + parseFloat(otherDiscount)).toFixed(2);
    let netAmount = (parseFloat(feeStructureTotals[0].totalAmount) - parseFloat(totalDiscount)).toFixed(2);
    let taxAmount = 0;
    if(taxRateId != "")
    {
        taxAmount = ((parseFloat(netAmount)*parseFloat(feeStructureTotals[0].taxRate))/100).toFixed(2);
    }
    let grossAmount = (parseFloat(netAmount) + parseFloat(taxAmount)).toFixed(2);
/////Add In JSON     
    finalJSON['total'] = {
        "taxRateId" : taxRateId,
        "totalAmount" : feeStructureTotals[0].totalAmount,
        "totalDiscount" : totalDiscount,
        "netAmount" : netAmount,
        "taxAmount" : taxAmount,
        "grossAmount" : grossAmount
    };

    feeStructureInstallments = await dbCommon.getFeeStructureInstallments(feeStructureId);
/////Add In JSON    
    finalJSON['feeInstallments'] = [];
    for(let i=0;i<feeStructureInstallments.length;i++)
    {
        let installmentAmount = (parseFloat(grossAmount)*parseFloat(feeStructureInstallments[i].installmentRate)/100).toFixed(2);
        finalJSON['feeInstallments'].push({
            "name" : feeStructureInstallments[i].name,
            "installmentRate" : feeStructureInstallments[i].installmentRate,
            "dueDate" : commonFunction.getFormattedDate(feeStructureInstallments[i].dueDate,"yyyy-mm-dd"),
            "amount" : installmentAmount
        });
    }
    return finalJSON;
}
