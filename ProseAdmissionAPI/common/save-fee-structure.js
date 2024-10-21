const commonFunction = require('../util/commonFunctions.js');
let dbCommon = require('../sqlmap/commonQuery.js');
let errorCodes = require('../util/errorCodes.js');
let genUUID = require('uuid');
let errorCode = new errorCodes();
//Variables 
let schoolUUID;
let academicSessionId;
let batchYearId;
let schoolingProgramId;
let syllabusId;
let gradeCategoryId;
let feeCategoryId;
let currencyId;
let totalInstallment;
let validityFrom;
let validityTo;
let taxApplicable;
let feeStructureTaxRates;
let feeStructureInstallments;
let feeStructureFeeTypes;
let feeStructureDiscountTypes;
let feeStructureTotals;
//
let academicSession;
let school;
let batchYear;
let schoolingProgram;
let syllabus;
let gradeCategory;
let feeCategory;
let currency;
let taxType;
let feeType;
let taxRate;
let discountType;

module.exports = require('express').Router().post('/',async(req,res) =>
{
    try
    {
        let reqData = commonFunction.trimSpaces(req.body);
        let authData = reqData.authData;
        
        if(reqData.school != undefined && reqData.academicSession != undefined && reqData.batchYear != undefined && reqData.schoolingProgram != undefined && reqData.syllabus != undefined && reqData.gradeCategory != undefined && reqData.feeCategory != undefined && reqData.currency != undefined && reqData.totalInstallment != undefined && reqData.validityFrom != undefined && reqData.validityTo != undefined && reqData.taxApplicable != undefined && reqData.feeStructureTaxRates != undefined && reqData.feeStructureInstallments != undefined && reqData.feeStructureFeeTypes != undefined && reqData.feeStructureDiscountTypes != undefined)
        {
            if(reqData.school.uuid != "" && reqData.academicSession.id != "" && reqData.batchYear.id != "" && reqData.schoolingProgram.id != "" && reqData.syllabus.id != "" && reqData.gradeCategory.id != "" && reqData.feeCategory.id != "" && reqData.currency.id != "" && reqData.totalInstallment != "" && reqData.validityFrom != "" && reqData.validityTo != "" && reqData.taxApplicable != "" && reqData.feeStructureTaxRates.length >= 0 && reqData.feeStructureInstallments.length > 0 && reqData.feeStructureFeeTypes.length > 0 && reqData.feeStructureDiscountTypes.length >= 0)
            {
                schoolUUID = reqData.school.uuid;
                academicSessionId = commonFunction.validateNumber(reqData.academicSession.id);
                batchYearId = commonFunction.validateNumber(reqData.batchYear.id);
                schoolingProgramId = commonFunction.validateNumber(reqData.schoolingProgram.id);
                syllabusId = commonFunction.validateNumber(reqData.syllabus.id);
                gradeCategoryId = commonFunction.validateNumber(reqData.gradeCategory.id);
                feeCategoryId = commonFunction.validateNumber(reqData.feeCategory.id);
                currencyId = commonFunction.validateNumber(reqData.currency.id);
                totalInstallment = commonFunction.validateNumber(reqData.totalInstallment);
                validityFrom = reqData.validityFrom;
                validityTo = reqData.validityTo;
                taxApplicable = commonFunction.validateNumber(reqData.taxApplicable, 'Yes');
                feeStructureTaxRates = reqData.feeStructureTaxRates;
                feeStructureInstallments = reqData.feeStructureInstallments;
                feeStructureFeeTypes = reqData.feeStructureFeeTypes;
                feeStructureDiscountTypes = reqData.feeStructureDiscountTypes;
                feeStructureTotals = [];

                let feeTypeIds = getIds(feeStructureFeeTypes, 'feeType');
                let discountTypeIds = getIds(feeStructureDiscountTypes, 'discountType');
                let taxTypeIds = getIds(feeStructureTaxRates, 'taxType');
                let taxRateIds = getIds(feeStructureTaxRates, 'taxRate');

                if(totalInstallment != feeStructureInstallments.length)
                {
                    res.status(500)
                    return res.json({
                        "status_code" : 500,
                        "message" : "Total Installment Not Matched With Installments",
                        "success" : false,
                        "error" : errorCode.getStatus(500)
                    });
                }

                feeType = await dbCommon.getFeeType(feeTypeIds);
                if(feeType.length != feeStructureFeeTypes.length)
                {
                    res.status(500)
                    return res.json({
                        "status_code" : 500,
                        "message" : "Some Fee Types Are Invalid",
                        "success" : false,
                        "error" : errorCode.getStatus(500)
                    });
                }

                discountType = await dbCommon.getDiscountType(discountTypeIds);
                if(discountType.length != feeStructureDiscountTypes.length)
                {
                    res.status(500)
                    return res.json({
                        "status_code" : 500,
                        "message" : "Some Discount Types Are Invalid",
                        "success" : false,
                        "error" : errorCode.getStatus(500)
                    });
                }

                if(taxTypeIds != "")
                {
                    taxType = await dbCommon.getTaxType(taxTypeIds);
                    let tempTaxTypeIds = taxTypeIds.toString().split(","); 
                    if(taxType.length != tempTaxTypeIds.length)
                    {
                        res.status(500)
                        return res.json({
                            "status_code" : 500,
                            "message" : "Some Tax Types Are Invalid",
                            "success" : false,
                            "error" : errorCode.getStatus(500)
                        });
                    }
                }

                if(taxRateIds != "")
                {
                    taxRate = await dbCommon.getTaxRate(taxRateIds);
                    let tempTaxRateIds = taxRateIds.toString().split(","); 
                    if(taxRate.length != tempTaxRateIds.length)
                    {
                        res.status(500)
                        return res.json({
                            "status_code" : 500,
                            "message" : "Some Tax Rates Are Invalid",
                            "success" : false,
                            "error" : errorCode.getStatus(500)
                        });
                    }
                    else if(feeStructureTaxRates.length > 0)
                    {
                        for(let k=0;k<feeStructureTaxRates.length;k++)
                        {
                            let filterTaxRate = taxRate.filter(taxRate1 => taxRate1.id == feeStructureTaxRates[k].taxRate.id);
                            if(filterTaxRate.length > 0)
                            {
                                feeStructureTaxRates[k]['rate'] =  filterTaxRate[0].rate;
                            }
                        }
                    }
                }

                if(taxApplicable == 1 && feeStructureTaxRates.length == 0)
                {
                    res.status(500)
                    return res.json({
                        "status_code" : 500,
                        "message" : "Applicable Tax Rates Not Found",
                        "success" : false,
                        "error" : errorCode.getStatus(500)
                    })
                }

                if(!commonFunction.isValidDate(validityFrom, "YYYY-MM-DD") || !commonFunction.isValidDate(validityTo, "YYYY-MM-DD"))
                {
                    res.status(500)
                    return res.json({
                        "status_code" : 500,
                        "message" : "Invalid Date Format In ValidityFrom or ValidityTo",
                        "success" : false,
                        "error" : errorCode.getStatus(500)
                    })
                }

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

                let getBatchYearUrl = global.adminPortalAPIUrl+"common/getAcademicSession/"+batchYearId;
                batchYear = await commonFunction.getExternalAPI(getBatchYearUrl);                
                if(!batchYear)
                {
                    res.status(500)
                    return res.json({
                        "status_code" : 500,
                        "message" : "Invalid Batch Year",
                        "success" : false,
                        "error" : errorCode.getStatus(500)
                    });
                }

                let getSchoolUrl = global.adminPortalAPIUrl+"business/getSchool/"+schoolUUID;
                school = await commonFunction.getExternalAPI(getSchoolUrl);                
                if(!school)
                {
                    res.status(500)
                    return res.json({
                        "status_code" : 500,
                        "message" : "Invalid School",
                        "success" : false,
                        "error" : errorCode.getStatus(500)
                    });
                }

                let getSchoolingProgramUrl = global.adminPortalAPIUrl+"common/getSchoolingProgram/"+schoolingProgramId;
                schoolingProgram = await commonFunction.getExternalAPI(getSchoolingProgramUrl);                
                if(!schoolingProgram)
                {
                    res.status(500)
                    return res.json({
                        "status_code" : 500,
                        "message" : "Invalid Schooling Program",
                        "success" : false,
                        "error" : errorCode.getStatus(500)
                    });
                }

                let getSyllabusUrl = global.adminPortalAPIUrl+"common/getSyllabus/"+syllabusId;
                syllabus = await commonFunction.getExternalAPI(getSyllabusUrl);                
                if(!syllabus)
                {
                    res.status(500)
                    return res.json({
                        "status_code" : 500,
                        "message" : "Invalid Syllabus",
                        "success" : false,
                        "error" : errorCode.getStatus(500)
                    });
                }

                let getGradeCategoryUrl = global.adminPortalAPIUrl+"common/getGradeCategory/"+gradeCategoryId;
                gradeCategory = await commonFunction.getExternalAPI(getGradeCategoryUrl);        
                if(!gradeCategory)
                {
                    res.status(500)
                    return res.json({
                        "status_code" : 500,
                        "message" : "Invalid Grade Category",
                        "success" : false,
                        "error" : errorCode.getStatus(500)
                    });
                }

                feeCategory = await dbCommon.getFeeCategory(feeCategoryId);
                if(feeCategory.length == 0)
                {
                    res.status(500)
                    return res.json({
                        "status_code" : 500,
                        "message" : "Invalid Fee Category",
                        "success" : false,
                        "error" : errorCode.getStatus(500)
                    });
                }

                currency = await dbCommon.getCurrency(currencyId);
                if(currency.length == 0)
                {
                    res.status(500)
                    return res.json({
                        "status_code" : 500,
                        "message" : "Invalid Currency",
                        "success" : false,
                        "error" : errorCode.getStatus(500)
                    });
                }

                feeStructureTotals = calculateTotals(feeStructureFeeTypes, feeStructureDiscountTypes, feeStructureTaxRates);
                                   
                //insert TaxRate
                let insertJSON = {
                    "uuid" : genUUID.v1(), 
                    "schoolId" : school.id,
                    "schoolingProgramId" : schoolingProgramId,
                    "academicSessionId" : academicSessionId,
                    "batchYearId" : batchYearId,
                    "syllabusId" : syllabusId,
                    "gradeCategoryId" : gradeCategoryId,
                    "feeCategoryId" : feeCategoryId,
                    "currencyId" : currencyId,
                    "totalInstallment" : totalInstallment,
                    "validityFrom" : validityFrom,
                    "validityTo" : validityTo,
                    "taxApplicable" : taxApplicable,
                    "feeStructureInstallments" : feeStructureInstallments,
                    "feeStructureFeeTypes" : feeStructureFeeTypes,
                    "feeStructureDiscountTypes" : feeStructureDiscountTypes,
                    "feeStructureTaxRates" : feeStructureTaxRates,
                    "feeStructureTotals" : feeStructureTotals,
                    "createdById" : authData.id
                }
                let insertFeeStructureResult = await dbCommon.insertfeeStructure(insertJSON);
                let insertFeeStructureId = insertFeeStructureResult.insertId;
    
                if(parseInt(insertFeeStructureId) > 0)
                {
                    res.status(200)
                    return res.json({
                        "uuid" : insertJSON.uuid,
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
                        "message" : "Fee Structure Not Saved",
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
})

function getIds(jsonData, key)
{
    let ids = "";
    for(let i=0;i<jsonData.length;i++)
    {
        let tempIds = ids.toString().split(",");
        let filterTempIds = tempIds.filter(tempId => tempId === jsonData[i][key].id);
        if(filterTempIds.length == 0)
        {
            if(ids == "")
            {
                ids = jsonData[i][key].id;
            }
            else
            {
                ids = ids + "," + jsonData[i][key].id;
            }
        }
    }
    return ids;
}

function calculateTotals(feeStructureFeeTypes, feeStructureDiscountTypes, feeStructureTaxRates)
{
    let feeStructureTotals = [];
    let totalFees = 0;
    let totalDiscount = 0;
    let netAmount = 0;
    let taxAmount = 0;
    let grossAmount = 0;

    for(let i=0;i<feeStructureFeeTypes.length;i++)
    {
        totalFees = parseFloat(totalFees) + parseFloat(feeStructureFeeTypes[i].amount);
    }
    totalFees = parseFloat(totalFees).toFixed(2);

    for(let i=0;i<feeStructureDiscountTypes.length;i++)
    {
        totalDiscount = parseFloat(totalDiscount) + parseFloat(feeStructureDiscountTypes[i].amount);
    }
    totalDiscount = parseFloat(totalDiscount).toFixed(2);

    if(feeStructureTaxRates.length == 0)
    {
        netAmount = parseFloat(totalFees) - parseFloat(totalDiscount);
        netAmount = parseFloat(netAmount).toFixed(2);
        grossAmount = parseFloat(netAmount).toFixed(2);

        feeStructureTotals.push({
            "totalAmount" : totalFees,
            "feeStructureTaxRateId" : "",
            "totalDiscount" : totalDiscount,
            "netAmount" : netAmount,
            "taxAmount" : taxAmount,
            "grossAmount" : grossAmount
        });
    }
    else
    {
        for(let i=0;i<feeStructureTaxRates.length;i++)
        {
            netAmount = parseFloat(totalFees) - parseFloat(totalDiscount);
            taxAmount = parseFloat(netAmount)*parseFloat(feeStructureTaxRates[i].rate)/100;
            taxAmount = parseFloat(taxAmount).toFixed(2);
            grossAmount = parseFloat(netAmount) + parseFloat(taxAmount);
            grossAmount = parseFloat(grossAmount).toFixed(2);

            feeStructureTotals.push({
                "totalAmount" : totalFees,
                "feeStructureTaxRateId" : "",
                "totalDiscount" : totalDiscount,
                "netAmount" : netAmount,
                "taxAmount" : taxAmount,
                "grossAmount" : grossAmount
            });
        }
    }

    return feeStructureTotals;
}