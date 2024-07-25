const commonFunction = require('../util/commonFunctions.js');
let dbBusiness = require('../sqlmap/businessQuery.js');
let dbCommon = require('../sqlmap/commonQuery.js');
let errorCodes = require('../util/errorCodes.js');
let errorCode = new errorCodes();
let genUUID = require('uuid');
////////Variables 
let name;
let code;
let email;
let businessVerticalId;
let businessPartnerTypeId;
let businessVerticalTypeIds;
let address;
let countryId;
let stateRegionId;
let districtId;
let cityId;
let pincode;
let contactPerson;
let contactEmail;
let contactMobile;
let inchargePerson;
let inchargeEmail;
let inchargeMobile;
let applicableFrom;
let applicableTo;
let isHavingContract;
let contractFrom;
let contractTo;
let rewardApplicable;
let commissionTermId;
let panNumber;
let gstNumber;
let commercialTermId;
let academyEnclosureDocumentIds;
let totalSaved;
//////
let businessPartner;
let duplicateEmailMobile;
let businessVerticalType;
let businessVertical;
let businessPartnerType;
let country;
let stateRegion;
let district;
let city;
let commissionTerm;
let commercialTerm;
let academyEnclosureDocument;

module.exports = require('express').Router().post('/',async(req,res) =>
{
    try
    {
        totalSaved = 0;
        let reqData = commonFunction.trimSpaces(req.body);
        let authData = reqData.authData;
        
        if(reqData.name != undefined && reqData.email != undefined && reqData.businessPartnerType != undefined && reqData.businessVertical != undefined && reqData.businessVerticalTypeIds != undefined && reqData.address != undefined && reqData.country != undefined && reqData.stateRegion != undefined && reqData.district != undefined && reqData.city != undefined && reqData.pincode != undefined && reqData.contactPerson != undefined && reqData.contactEmail != undefined && reqData.contactMobile != undefined && reqData.inchargePerson != undefined && reqData.inchargeEmail != undefined && reqData.inchargeMobile != undefined && reqData.applicableFrom != undefined && reqData.applicableTo != undefined && reqData.isHavingContract != undefined && reqData.contractFrom != undefined && reqData.contractTo != undefined && reqData.rewardApplicable != undefined && reqData.commissionTerm != undefined && reqData.panNumber != undefined && reqData.gstNumber != undefined && reqData.commercialTerm != undefined && reqData.academyEnclosureDocumentIds != undefined)
        {
            if(reqData.name != "" && reqData.email != undefined && JSON.parse(reqData.businessPartnerType)?.id != undefined && JSON.parse(reqData.businessVertical)?.id != "" && reqData.businessVerticalTypeIds != "" && reqData.address != "" && JSON.parse(reqData.country)?.id != "" && JSON.parse(reqData.stateRegion)?.id != "" && JSON.parse(reqData.district)?.id != "" && JSON.parse(reqData.city)?.id != "" && reqData.pincode != "" && reqData.contactPerson != "" && reqData.contactEmail != "" && reqData.contactMobile != "" && reqData.applicableFrom != "" && reqData.applicableTo != "")
            {
                name = reqData.name;
                code = "";
                email = reqData.email;
                businessPartnerTypeId = commonFunction.validateNumber(JSON.parse(reqData.businessPartnerType)?.id);
                businessVerticalId = commonFunction.validateNumber(JSON.parse(reqData.businessVertical)?.id);
                businessVerticalTypeIds = reqData.businessVerticalTypeIds;
                address = reqData.address;
                countryId = commonFunction.validateNumber(JSON.parse(reqData.country)?.id);
                stateRegionId = commonFunction.validateNumber(JSON.parse(reqData.stateRegion)?.id);
                districtId = commonFunction.validateNumber(JSON.parse(reqData.district)?.id);
                cityId = commonFunction.validateNumber(JSON.parse(reqData.city)?.id);
                pincode = commonFunction.validateNumber(reqData.pincode);
                contactPerson = reqData.contactPerson;
                contactEmail = reqData.contactEmail;
                contactMobile = reqData.contactMobile;
                inchargePerson = reqData.inchargePerson;
                inchargeEmail = reqData.inchargeEmail;
                inchargeMobile = reqData.inchargeMobile;
                applicableFrom = reqData.applicableFrom;
                applicableTo = reqData.applicableTo;
                isHavingContract = commonFunction.validateNumber(reqData.isHavingContract, 'Yes');
                contractFrom = reqData.contractFrom;
                contractTo = reqData.contractTo;
                rewardApplicable = commonFunction.validateNumber(reqData.rewardApplicable, 'Yes');
                commissionTermId = commonFunction.validateNumber(JSON.parse(reqData.commissionTerm)?.id);
                panNumber = reqData.panNumber;
                gstNumber = reqData.gstNumber;
                commercialTermId = commonFunction.validateNumber(JSON.parse(reqData.commercialTerm)?.id);
                academyEnclosureDocumentIds = reqData.academyEnclosureDocumentIds;
            
            /////check Academy Enclosure Documents And Files
                if(academyEnclosureDocumentIds != "")
                {
                    academyEnclosureDocument = await dbBusiness.getAcademyEnclosureDocument(academyEnclosureDocumentIds);
                    if(academyEnclosureDocument.length != req.files.length)
                    {
                        ///Remove Files
                        commonFunction.deleteFiles(req.files);
                        res.status(500)
                        return res.json({
                            "status_code" : 500,
                            "message" : "Academy Enclosure Documents And Uploading Files Are Not Matched",
                            "success" : false,
                            "error" : errorCode.getStatus(500)
                        })
                    }
                }
            /////check isApplicableFrom and isApplicableTo
                if(!commonFunction.isValidDate(applicableFrom, "YYYY-MM-DD") || !commonFunction.isValidDate(applicableTo, "YYYY-MM-DD"))
                {
                    ///Remove Files
                    commonFunction.deleteFiles(req.files);
                    res.status(500)
                    return res.json({
                        "status_code" : 500,
                        "message" : "Invalid Date Format In ApplicableFrom or ApplicableTo",
                        "success" : false,
                        "error" : errorCode.getStatus(500)
                    })
                }
            /////check isHavingContract
                if(isHavingContract == 1)
                {
                    if(!commonFunction.isValidDate(contractFrom, "YYYY-MM-DD") || !commonFunction.isValidDate(contractTo, "YYYY-MM-DD"))
                    {
                        ///Remove Files
                        commonFunction.deleteFiles(req.files);
                        res.status(500)
                        return res.json({
                            "status_code" : 500,
                            "message" : "Invalid Date Format In ContractFrom or ContractTo",
                            "success" : false,
                            "error" : errorCode.getStatus(500)
                        })
                    }
                }
                ////Check Duplicate Email/Mobile
                duplicateEmailMobile = await dbCommon.checkDuplicateEmailMobile(email, "Email", "business_partner");
                if(duplicateEmailMobile.length == 0)
                {  
                    ////Check Business Partner Type
                    businessPartnerType = await dbBusiness.getBusinessPartnerType(businessPartnerTypeId);
                    if(businessPartnerType.length == 1)
                    {
                        if(businessPartnerType[0].code == "B2C")
                        {
                /////check Reward Applicable and Commission Term
                            if(rewardApplicable == 1 && parseInt(commissionTermId) > 0)
                            {
                                commissionTerm = await dbBusiness.getCommissionTerm(commissionTermId);
                                if(commissionTerm.length == 0)
                                {
                                    ///Remove Files
                                    commonFunction.deleteFiles(req.files);
                                    res.status(500)
                                    return res.json({
                                        "status_code" : 500,
                                        "message" : "Commission Term Not Exist",
                                        "success" : false,
                                        "error" : errorCode.getStatus(500)
                                    })
                                }
                            }
                        }
                        else if(businessPartnerType[0].code == "B2B")
                        {
                            if(parseInt(commercialTermId) > 0)
                            {
                                commercialTerm = await dbBusiness.getCommercialTerm(commercialTermId);
                                if(commercialTerm.length == 0)
                                {
                                    ///Remove Files
                                    commonFunction.deleteFiles(req.files);
                                    res.status(500)
                                    return res.json({
                                        "status_code" : 500,
                                        "message" : "Commercial Term Not Exist",
                                        "success" : false,
                                        "error" : errorCode.getStatus(500)
                                    })
                                }
                            }
                        }
                        ////Check Business Vertical
                        businessVertical = await dbBusiness.getBusinessVertical(businessVerticalId);
                        if(businessVertical.length == 1)
                        {
                            ////Check Business Vertical Type Ids
                            let businessVerticalTypeCount = businessVerticalTypeIds.toString().split(",");
                            
                            businessVerticalType = await dbBusiness.getBusinessVerticalType(businessVerticalTypeIds);
                            if(businessVerticalType.length == businessVerticalTypeCount.length)
                            {
                                ////Check Country
                                country = await dbBusiness.getCountry(countryId);
                                if(country.length == 1)
                                {
                                    ////Check State/Region
                                    stateRegion = await dbBusiness.getStateRegion(stateRegionId, countryId);
                                    if(stateRegion.length == 1)
                                    {
                                        ////Check District
                                        district = await dbBusiness.getDistrict(districtId, countryId,stateRegionId);
                                        if(district.length == 1)
                                        {
                                            ////Check City
                                            city = await dbBusiness.getCity(cityId, countryId, stateRegionId,districtId);
                                            if(city.length == 1)
                                            {
                                            ////Check Duplicate Business Partner
                                                businessPartner = await dbBusiness.duplicateBusinessPartner(name, businessPartnerTypeId, "");
                                                if(businessPartner.length == 0)
                                                {
                                        ///insert Business Partner
                                                    let insertJSON = {
                                                        "uuid" : genUUID.v1(),
                                                        "name" : name,
                                                        "code" : code,
                                                        "email" : email,
                                                        "businessPartnerTypeId" : businessPartnerTypeId,
                                                        "businessVerticalId" : businessVerticalId,
                                                        "businessVerticalTypeIds" : businessVerticalTypeIds,
                                                        "address" : address,
                                                        "countryId" : countryId,
                                                        "stateRegionId" : stateRegionId,
                                                        "districtId" : districtId,
                                                        "cityId" : cityId,
                                                        "pincode" : pincode,
                                                        "contactPerson" : contactPerson,
                                                        "contactEmail" : contactEmail,
                                                        "contactMobile" : contactMobile,
                                                        "inchargePerson" : inchargePerson,
                                                        "inchargeEmail" : inchargeEmail,
                                                        "inchargeMobile" : inchargeMobile,
                                                        "applicableFrom" : applicableFrom,
                                                        "applicableTo" : applicableTo,
                                                        "rewardApplicable" : rewardApplicable,
                                                        "commissionTermId" : commissionTermId,
                                                        "panNumber" : panNumber,
                                                        "gstNumber" : gstNumber,
                                                        "commercialTermId" : commercialTermId,
                                                        "createdById" : authData.id
                                                    }
                                                    let insertBusinessPartnerResult = await dbBusiness.insertBusinessPartner(insertJSON);
                                                    let insertBusinessPartnerId = insertBusinessPartnerResult.insertId;
                                        ///////
                                                    if(parseInt(insertBusinessPartnerId) > 0)
                                                    {
                                                        if(businessPartnerType[0].code == "B2C")
                                                        {
                                                            code = commonFunction.generateCode(6, 'RP-', insertBusinessPartnerId);
                                                        }
                                                        else if(businessPartnerType[0].code == "B2B")
                                                        {
                                                            code = commonFunction.generateCode(6, 'BP-', insertBusinessPartnerId);
                                                        }
                                                        let updateBusinessPartnerCodeResult = await dbBusiness.updateBusinessPartnerCode(code, insertBusinessPartnerId);
                                                        
                                                        if(updateBusinessPartnerCodeResult.affectedRows > 0)
                                                        {
                                                            if(parseInt(isHavingContract) == 1)
                                                            {
                                                    ///////Insert Business Partner Contract
                                                                let insertContractJSON = {
                                                                    "businessPartnerId" : insertBusinessPartnerId,
                                                                    "contractFrom" : contractFrom,
                                                                    "contractTo" : contractTo,
                                                                    "createdById" : authData.id
                                                                }
                                                                let insertBusinessPartnerContractResult = await dbBusiness.insertBusinessPartnerContractHistory(insertContractJSON);
                                                            }
                                                    ///////Save Business Partner Docs File
                                                            if(academyEnclosureDocument?.length > 0)
                                                            {
                                                                totalSaved = await saveBusinessPartnerDocs(req.files, academyEnclosureDocument, insertBusinessPartnerId, code, authData.id);
                                                        ///Remove Files
                                                                commonFunction.deleteFiles(req.files);
                                                            }
                                                        }
                                                        res.status(200)
                                                        return res.json({
                                                            "uuid" : insertJSON.uuid,
                                                            "savedDocs" : totalSaved > 0 ? `${totalSaved}/${academyEnclosureDocument?.length}` : '',
                                                            "status_code" : 200,
                                                            "success" : true,                            
                                                            "message" : errorCode.getStatus(200)
                                                        })
                                                    }
                                                    else
                                                    {
                                                    ///Remove Files
                                                        commonFunction.deleteFiles(req.files);    
                                                        res.status(500)
                                                        return res.json({
                                                            "status_code" : 500,
                                                            "message" : "Business Partner Not Saved",
                                                            "success" : false,
                                                            "error" : errorCode.getStatus(500)
                                                        })
                                                    }
                                                }
                                                else
                                                {
                                                    ///Remove Files
                                                    commonFunction.deleteFiles(req.files);
                                                    res.status(500)
                                                    return res.json({
                                                        "status_code" : 500,
                                                        "message" : "Business Partner Name Already Exist For " + businessPartnerType[0].name,
                                                        "success" : false,
                                                        "error" : errorCode.getStatus(500)
                                                    })
                                                }
                                            }
                                            else
                                            {
                                                ///Remove Files
                                                commonFunction.deleteFiles(req.files);
                                                res.status(500)
                                                return res.json({
                                                    "status_code" : 500,
                                                    "message" : "City Not Exist For Country : " + city[0].countryName + ", State/Region : " + city[0].stateRegionName + " And District : " + city[0].districtName,
                                                    "success" : false,
                                                    "error" : errorCode.getStatus(500)
                                                })
                                            }
                                        }
                                        else
                                        {
                                            ///Remove Files
                                            commonFunction.deleteFiles(req.files);
                                            res.status(500)
                                            return res.json({
                                                "status_code" : 500,
                                                "message" : "District Not Exist For Country : " + district[0].countryName + " And State/Region : " + district[0].stateRegionName,
                                                "success" : false,
                                                "error" : errorCode.getStatus(500)
                                            })
                                        }
                                    }
                                    else
                                    {
                                        ///Remove Files
                                        commonFunction.deleteFiles(req.files);
                                        res.status(500)
                                        return res.json({
                                            "status_code" : 500,
                                            "message" : "State/Region Not Exist For Country : " + country[0].name,
                                            "success" : false,
                                            "error" : errorCode.getStatus(500)
                                        })
                                    }
                                }
                                else
                                {
                                    ///Remove Files
                                    commonFunction.deleteFiles(req.files);
                                    res.status(500)
                                    return res.json({
                                        "status_code" : 500,
                                        "message" : "Country Not Exist",
                                        "success" : false,
                                        "error" : errorCode.getStatus(500)
                                    })
                                }
                            }
                            else
                            {
                                ///Remove Files
                                commonFunction.deleteFiles(req.files);
                                res.status(500)
                                return res.json({
                                    "status_code" : 500,
                                    "message" : "Some Business Vertical Type Not Exist",
                                    "success" : false,
                                    "error" : errorCode.getStatus(500)
                                })
                            }
                        }
                        else
                        {
                            ///Remove Files
                            commonFunction.deleteFiles(req.files);
                            res.status(500)
                            return res.json({
                                "status_code" : 500,
                                "message" : "Some Business Vertical Not Exist",
                                "success" : false,
                                "error" : errorCode.getStatus(500)
                            })
                        }
                    }
                    else
                    {
                        ///Remove Files
                        commonFunction.deleteFiles(req.files);
                        res.status(500)
                        return res.json({
                            "status_code" : 500,
                            "message" : "Some BusinessPartner Type Not Exist",
                            "success" : false,
                            "error" : errorCode.getStatus(500)
                        })
                    }
                }
                else
                {
                    ///Remove Files
                    commonFunction.deleteFiles(req.files);
                    res.status(500)
                    return res.json({
                        "status_code" : 500,
                        "message" : "Duplicate Email",
                        "success" : false,
                        "error" : errorCode.getStatus(500)
                    })
                }
            }
            else
            {
                ///Remove Files
                commonFunction.deleteFiles(req.files);
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
            ///Remove Files
            commonFunction.deleteFiles(req.files);
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
        ///Remove Files
        commonFunction.deleteFiles(req.files);
        res.status(500)
        return res.json({
            "status_code" : 500,
            "message" : "Something Went Wrong",
            "success" : false,
            "error" : e
        });
    }
})

async function saveBusinessPartnerDocs(files, documentIds, businessPartnerId, businessPartnerCode, createdById) 
{
    let savedFc = 0;

    for (let fc = 0; fc < files.length; fc++) 
    {
        try 
        {
            let file = files[fc];
            if (parseFloat(file.size) > 0) 
            {
                let allowedMimeTypes = [
                    'image/png',
                    'image/jpeg',
                    'application/pdf'
                ];

                if (allowedMimeTypes.includes(file.mimetype)) 
                {
                    let insertBusinessPartnerDocumentJSON = {
                        businessPartnerId: businessPartnerId,
                        documentId: documentIds[fc].id,
                        fileName: "",
                        createdById: createdById
                    };

                    let insertBusinessPartnerDocumentResult = await dbBusiness.insertBusinessPartnerDocument(insertBusinessPartnerDocumentJSON);
                    let insertBusinessPartnerDocId = insertBusinessPartnerDocumentResult.insertId;

                    // File Upload
                    let fileExt = file.originalname.split('.').pop();
                    let sourcePath = file.path;
                    let destiFileName = `${businessPartnerCode}_${insertBusinessPartnerDocId}.${fileExt}`;
                    let destiPath = commonFunction.getUploadFolder('BusinessPartnerDoc') + destiFileName;

                    await commonFunction.copyFile(sourcePath, destiPath);

                    // Count how many files are saved
                    savedFc += 1;
                    
                    // Update the file name in the database
                    await dbBusiness.updateBusinessPartnerDocFileName(destiFileName, insertBusinessPartnerDocId);
                }
            }
        } 
        catch (e) 
        {
            console.error(`Error processing file ${documentIds[fc].name}:`, e);
        }
    }

    return savedFc;
}
