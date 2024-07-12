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

module.exports = require('express').Router().post('/',async(req,res) =>
{
    try
    {
        totalSaved = 0;
        let reqData = commonFunction.trimSpaces(req.body);
        let authData = reqData.authData;
        
        if(reqData.name != undefined && reqData.email != undefined && reqData.mobile != undefined && reqData.landlordName != undefined && reqData.contactPersonName != undefined && reqData.contactPersonEmail != undefined && reqData.contactPersonMobile != undefined && reqData.address != undefined && reqData.country != undefined && reqData.stateRegion != undefined && reqData.district != undefined && reqData.city != undefined && reqData.pincode != undefined && reqData.studyCenterType != undefined && reqData.panNumber != undefined && reqData.gstNumber != undefined && reqData.rewardType != undefined && reqData.businessPartner != undefined && reqData.agreementFrom != undefined && reqData.agreementTo != undefined)
        {
            if(reqData.name != "" && reqData.email != "" && reqData.mobile != "" && reqData.address != "" && reqData.country.id != "" && reqData.stateRegion.id != "" && reqData.district.id != "" && reqData.city.id != "" && reqData.pincode != "" && reqData.studyCenterType.id != "" && reqData.panNumber != "" && reqData.gstNumber != "")
            {
                name = reqData.name;
                code = "";
                email = reqData.email;
                mobile = reqData.mobile;
                studyCenterTypeId = commonFunction.validateNumber(reqData.studyCenterType.id);
                contactPersonName = reqData.contactPersonName;
                contactPersonEmail = reqData.contactPersonEmail;
                contactPersonMobile = reqData.contactPersonMobile;
                landlordName = reqData.landlordName;
                pincode = commonFunction.validateNumber(reqData.pincode);
                address = reqData.address;
                countryId = commonFunction.validateNumber(reqData.country.id);
                stateRegionId = commonFunction.validateNumber(reqData.stateRegion.id);
                districtId = commonFunction.validateNumber(reqData.district.id);
                cityId = commonFunction.validateNumber(reqData.city.id);
                rewardTypeId = commonFunction.validateNumber(reqData.rewardType.id);
                businessPartnerUUID = commonFunction.validateNumber(reqData.businessPartner.uuid);
                agreementFrom = reqData.agreementFrom;
                agreementTo = reqData.agreementTo;
                panNumber = reqData.panNumber;
                gstNumber = reqData.gstNumber;
            
            /////Check Reward Type
            if(rewardTypeId != "")
            {
                rewardType = await dbBusiness.getStudyCenterRewardType(rewardTypeId);
                if(rewardType.length == 0)
                {
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
                if(!commonFunction.isValidDate(agreementFrom, "YYYY-MM-DD") || !commonFunction.isValidDate(agreementTo, "YYYY-MM-DD"))
                {
                    res.status(500)
                    return res.json({
                        "status_code" : 500,
                        "message" : "Invalid Date Format In ContractFrom or ContractTo",
                        "success" : false,
                        "error" : errorCode.getStatus(500)
                    })
                }
                ////Check Duplicate Email/Mobile
                duplicateEmailMobile = await dbCommon.checkDuplicateEmailMobile(email, "Email", "study_center");
                if(duplicateEmailMobile.length == 0)
                {  
                    ////Check Duplicate Email/Mobile
                    duplicateEmailMobile = await dbCommon.checkDuplicateEmailMobile(mobile, "Mobile", "study_center");
                    if(duplicateEmailMobile.length == 0)
                    {
                        ////Check studyCenterType
                        studyCenterType = await dbBusiness.getStudyCenterType(studyCenterTypeId);
                        if(studyCenterType.length == 1)
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
                                                    "rewardTypeId" : rewardType[0].id,
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
                                                    
                                                        res.status(200)
                                                        return res.json({
                                                            "uuid" : insertJSON.uuid,
                                                            "status_code" : 200,
                                                            "success" : true,                            
                                                            "message" : errorCode.getStatus(200)
                                                        })
                                                    }
                                                }
                                                else
                                                {
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
            "error" : e.stack
        });
    }
})