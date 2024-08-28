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
let mobile;
let studyCenterTypeId;
let address;
let countryId;
let stateRegionId;
let districtId;
let cityId;
let pincode;
let panNumber;
let gstNumber;
let contactPersonName;
let contactPersonEmail;
let contactPersonMobile;
let landlordName;
let rewardTypeId;
let businessPartnerUUID;
let agreementFrom;
let agreementTo;
let academyEnclosureDocumentIds;
let totalSaved;

//////
let studyCenterType;
let studyCenter;
let duplicateEmailMobile;
let country;
let stateRegion;
let district;
let city;
let businessPartner;
let rewardType;
let academyEnclosureDocument;

module.exports = require('express').Router().post('/',async(req,res) =>
{
    try
    {
        totalSaved = 0;
        let reqData = commonFunction.trimSpaces(req.body);
        let authData = reqData.authData;
        
        if(reqData.name != undefined && reqData.email != undefined && reqData.mobile != undefined && reqData.landlordName != undefined && reqData.contactPersonName != undefined && reqData.contactPersonEmail != undefined && reqData.contactPersonMobile != undefined && reqData.address != undefined && reqData.country != undefined && reqData.stateRegion != undefined && reqData.district != undefined && reqData.city != undefined && reqData.pincode != undefined && reqData.studyCenterType != undefined && reqData.panNumber != undefined && reqData.gstNumber != undefined && reqData.rewardType != undefined && reqData.businessPartner != undefined && reqData.agreementFrom != undefined && reqData.agreementTo != undefined && reqData.academyEnclosureDocumentIds != undefined)
        {
            if(reqData.name != "" && reqData.email != "" && reqData.mobile != "" && reqData.address != "" && JSON.parse(reqData.country).id != "" && JSON.parse(reqData.stateRegion).id != "" && JSON.parse(reqData.district).id != "" && JSON.parse(reqData.city).id != "" && reqData.pincode != "" && JSON.parse(reqData.studyCenterType).id != "")
            {
                name = reqData.name;
                code = "";
                email = reqData.email;
                mobile = reqData.mobile;
                studyCenterTypeId = commonFunction.validateNumber(JSON.parse(reqData.studyCenterType).id);
                pincode = commonFunction.validateNumber(reqData.pincode);
                address = reqData.address;
                countryId = commonFunction.validateNumber(JSON.parse(reqData.country).id);
                stateRegionId = commonFunction.validateNumber(JSON.parse(reqData.stateRegion).id);
                districtId = commonFunction.validateNumber(JSON.parse(reqData.district).id);
                cityId = commonFunction.validateNumber(JSON.parse(reqData.city).id);
                panNumber = reqData.panNumber;
                gstNumber = reqData.gstNumber;
                contactPersonName = reqData.contactPersonName;
                contactPersonEmail = reqData.contactPersonEmail;
                contactPersonMobile = reqData.contactPersonMobile;
                landlordName = reqData.landlordName;
                rewardTypeId = commonFunction.validateNumber(JSON.parse(reqData.rewardType).id);
                businessPartnerUUID = JSON.parse(reqData.businessPartner).uuid;
                agreementFrom = reqData.agreementFrom;
                agreementTo = reqData.agreementTo;
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
                ////Check studyCenterType
                studyCenterType = await dbBusiness.getStudyCenterType(studyCenterTypeId);
                if(studyCenterType.length == 1)
                {
                    if(studyCenterType[0].name == "Company Owned")
                    {
                        panNumber = "";
                        gstNumber = "";
                        contactPersonName = "";
                        contactPersonEmail = "";
                        contactPersonMobile = "";
                        landlordName = "";
                        rewardTypeId = "";
                        businessPartnerUUID = "";
                        agreementFrom = "";
                        agreementTo = "";                        
                    }
                    else if(studyCenterType[0].name == "Company Operated")
                    {
                        businessPartnerUUID = "";
                    }
                    else if(studyCenterType[0].name == "Partner Captive")
                    {
                        panNumber = "";
                        gstNumber = "";
                        contactPersonName = "";
                        contactPersonEmail = "";
                        contactPersonMobile = "";
                        landlordName = "";
                        rewardTypeId = "";
                        agreementFrom = "";
                        agreementTo = "";
                    }
                    /////Check Reward Type
                    if(rewardTypeId != "")
                    {
                        rewardType = await dbBusiness.getStudyCenterRewardType(rewardTypeId);
                        if(rewardType.length == 0)
                        {
                            ///Remove Files
                            commonFunction.deleteFiles(req.files);
                            res.status(500)
                            return res.json({
                                "status_code" : 500,
                                "message" : "Invalid Reward Type",
                                "success" : false,
                                "error" : errorCode.getStatus(500)
                            })
                        }
                    }
                    /////Check Business Partner
                    if(businessPartnerUUID != "")
                    {
                        businessPartner = await dbBusiness.getBusinessPartner(businessPartnerUUID);
                        if(businessPartner.length == 0)
                        {
                            ///Remove Files
                            commonFunction.deleteFiles(req.files);
                            res.status(500)
                            return res.json({
                                "status_code" : 500,
                                "message" : "Invalid Business Partner",
                                "success" : false,
                                "error" : errorCode.getStatus(500)
                            })
                        }
                    }
                /////check agreementFrom and agreementTo
                    if(agreementFrom != "" && agreementTo != "")
                    {
                        if(!commonFunction.isValidDate(agreementFrom, "YYYY-MM-DD") || !commonFunction.isValidDate(agreementTo, "YYYY-MM-DD"))
                        {
                            ///Remove Files
                            commonFunction.deleteFiles(req.files);
                            res.status(500)
                            return res.json({
                                "status_code" : 500,
                                "message" : "Invalid Date Format In AgreementFrom or AgreementTo",
                                "success" : false,
                                "error" : errorCode.getStatus(500)
                            })
                        }
                    }
                    ////Check Duplicate Email/Mobile
                    duplicateEmailMobile = await dbCommon.checkDuplicateEmailMobile(email, "Email", "study_center");
                    if(duplicateEmailMobile.length == 0)
                    {  
                        ////Check Duplicate Email/Mobile
                        duplicateEmailMobile = await dbCommon.checkDuplicateEmailMobile(mobile, "Mobile", "study_center");
                        if(duplicateEmailMobile.length == 0)
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
                                        ////Check Duplicate Study Center
                                            studyCenter = await dbBusiness.duplicateStudyCenter(name, "");
                                            if(studyCenter.length == 0)
                                            {
                                    ///insert Study Center
                                                let insertJSON = {
                                                    "uuid" : genUUID.v1(),
                                                    "name" : name,
                                                    "email" : email,
                                                    "mobile" : mobile,
                                                    "studyCenterTypeId" : studyCenterType[0].id,
                                                    "address" : address,
                                                    "countryId" : countryId,
                                                    "stateRegionId" : stateRegionId,
                                                    "districtId" : districtId,
                                                    "cityId" : cityId,
                                                    "pincode" : pincode,
                                                    "contactPersonName" : contactPersonName,
                                                    "contactPersonEmail" : contactPersonEmail,
                                                    "contactPersonMobile" : contactPersonMobile,
                                                    "landlordName" : landlordName,
                                                    "panNumber" : panNumber,
                                                    "gstNumber" : gstNumber,
                                                    "rewardTypeId" : rewardType != null ? rewardType[0].id : "",
                                                    "businessPartnerId" : businessPartnerUUID != '' ? businessPartner[0].id : '',
                                                    "createdById" : authData.id
                                                }
                                                let insertStudyCenterResult = await dbBusiness.insertStudyCenter(insertJSON);
                                                let insertStudyCenterId = insertStudyCenterResult.insertId;
                                    ///////
                                                if(parseInt(insertStudyCenterId) > 0)
                                                {
                                                    if(studyCenterType[0].name == "Company Owned")
                                                    {
                                                        code = commonFunction.generateCode(6, 'CW-', insertStudyCenterId);
                                                    }
                                                    else if(studyCenterType[0].name == "Company Operated")
                                                    {
                                                        code = commonFunction.generateCode(6, 'CO-', insertStudyCenterId);
                                                    }
                                                    else if(studyCenterType[0].name == "Partner Captive")
                                                    {
                                                        code = commonFunction.generateCode(6, 'PC-', insertStudyCenterId);
                                                    }
                                                    let updateStudyCenterCodeResult = await dbBusiness.updateStudyCenterCode(code, insertStudyCenterId);
                                                        
                                                    if(updateStudyCenterCodeResult.affectedRows > 0)
                                                    {
                                                        if(studyCenterType[0].name == "Company Operated")
                                                        {
                                                    ///////Insert Study Center Agreement
                                                            let insertAgreementJSON = {
                                                                "studyCenterId" : insertStudyCenterId,
                                                                "agreementFrom" : agreementFrom,
                                                                "agreementTo" : agreementTo,
                                                                "createdById" : authData.id
                                                            }
                                                            let insertStudyCenterAgreementResult = await dbBusiness.insertStudyCenterAgreementHistory(insertAgreementJSON);
                                                        } 
                                                        
                                                        ///////Save Study Center Docs File
                                                        if(academyEnclosureDocument?.length > 0)
                                                        {
                                                            totalSaved = await saveStudyCenterDocs(req.files, academyEnclosureDocument, insertStudyCenterId, code, authData.id);
                                                    ///Remove Files
                                                            commonFunction.deleteFiles(req.files);
                                                        }
                                                ///Remove Files
                                                        commonFunction.deleteFiles(req.files);
                                                        res.status(200)
                                                        return res.json({
                                                            "uuid" : insertJSON.uuid,
                                                            "savedDocs" : totalSaved > 0 ? `${totalSaved}/${academyEnclosureDocument?.length}` : '',
                                                            "status_code" : 200,
                                                            "success" : true,                            
                                                            "message" : errorCode.getStatus(200)
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
                                                        "message" : "Study Center Not Saved",
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
                                                    "message" : "Study Center Name Already Exist",
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
                                "message" : "Duplicate Mobile",
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
                        "message" : "Study Center Type Not Exist",
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

async function saveStudyCenterDocs(files, documentIds, studyCenterId, code, createdById) 
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
                    let insertStudyCenterDocumentJSON = {
                        studyCenterId: studyCenterId,
                        documentId: documentIds[fc].id,
                        fileName: "",
                        createdById: createdById
                    };

                    let insertStudyCenterDocumentResult = await dbBusiness.insertStudyCenterDocument(insertStudyCenterDocumentJSON);
                    let insertStudyCenterDocId = insertStudyCenterDocumentResult.insertId;

                    // File Upload
                    let fileExt = file.originalname.split('.').pop();
                    let sourcePath = file.path;
                    let destiFileName = `${code}_${insertStudyCenterDocId}.${fileExt}`;
                    let destiPath = commonFunction.getUploadFolder('StudyCenterDoc') + destiFileName;

                    await commonFunction.copyFile(sourcePath, destiPath);

                    // Count how many files are saved
                    savedFc += 1;
                    
                    // Update the file name in the database
                    await dbBusiness.updateStudyCenterDocFileName(destiFileName, insertStudyCenterDocId);
                }
            }
        } 
        catch (e) 
        {
            // console.error(`Error processing file ${documentIds[fc].name}:`, e);
            res.status(500)
            return res.json({
            "status_code" : 500,
            "message" : "Something Went Wrong",
            "success" : false,
            "error" : e,
        });
        }
    }

    return savedFc;
}