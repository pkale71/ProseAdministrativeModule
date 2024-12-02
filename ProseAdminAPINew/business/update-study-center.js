const commonFunction = require('../util/commonFunctions.js');
let dbBusiness = require('../sqlmap/businessQuery.js');
let dbCommon = require('../sqlmap/commonQuery.js');
let errorCodes = require('../util/errorCodes.js');
let errorCode = new errorCodes();
////////Variables 
let uuid;
let name
let email;
let studyCenterTypeId;
let mobile;
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

//////
let studyCenter;
let studyCenterType;
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
        
        if(reqData.uuid != undefined && reqData.name != undefined && reqData.email != undefined && reqData.mobile != undefined && reqData.studyCenterType != undefined && reqData.landlordName != undefined && reqData.contactPersonName != undefined && reqData.contactPersonEmail != undefined && reqData.contactPersonMobile != undefined && reqData.address != undefined && reqData.country != undefined && reqData.stateRegion != undefined && reqData.district != undefined && reqData.city != undefined && reqData.pincode != undefined && reqData.panNumber != undefined && reqData.gstNumber != undefined && reqData.rewardType != undefined && reqData.businessPartner != undefined)
        {
            if(reqData.uuid != "" && reqData.name != "" && reqData.email != "" && reqData.mobile != "" && reqData.address != "" && reqData.country.id != "" && reqData.stateRegion.id != "" && reqData.district.id != "" && reqData.city.id != "" && reqData.pincode != "" && reqData.studyCenterType.id != "")
            {
                uuid = reqData.uuid;
                name = reqData.name;
                email = reqData.email;
                mobile = reqData.mobile;
                studyCenterTypeId = commonFunction.validateNumber(reqData.studyCenterType.id);
                pincode = commonFunction.validateNumber(reqData.pincode);
                address = reqData.address;
                countryId = commonFunction.validateNumber(reqData.country.id);
                stateRegionId = commonFunction.validateNumber(reqData.stateRegion.id);
                districtId = commonFunction.validateNumber(reqData.district.id);
                cityId = commonFunction.validateNumber(reqData.city.id);
                panNumber = reqData.panNumber;
                gstNumber = reqData.gstNumber;
                contactPersonName = reqData.contactPersonName;
                contactPersonEmail = reqData.contactPersonEmail;
                contactPersonMobile = reqData.contactPersonMobile;
                landlordName = reqData.landlordName;
                rewardTypeId = commonFunction.validateNumber(reqData.rewardType.id);
                businessPartnerUUID = reqData.businessPartner.uuid;
            
                ////Check Duplicate Study Center
                studyCenter = await dbBusiness.duplicateStudyCenter(name, uuid);
                if(studyCenter.length == 0)
                {
            ////get Study Center
                    studyCenter = await dbBusiness.getStudyCenter(uuid);
                    if(studyCenter.length == 1)
                    {
                        if(studyCenterTypeId == studyCenter[0].studyCenterTypeId)
                        {
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
                                ////Check Duplicate Email/Mobile
                                duplicateEmailMobile = await dbCommon.checkDuplicateEmailMobile(email, "Email", "study_center", uuid);
                                if(duplicateEmailMobile.length == 0)
                                {  
                                    ////Check Duplicate Email/Mobile
                                    duplicateEmailMobile = await dbCommon.checkDuplicateEmailMobile(mobile, "Mobile", "study_center", uuid);
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
                                                ///update Study Center
                                                        let updateJSON = {
                                                            "uuid" : uuid,
                                                            "name" : name,
                                                            "email" : email,
                                                            "mobile" : mobile,
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
                                                        let updateStudyCenterResult = await dbBusiness.updateStudyCenter(updateJSON);
                                            ///////
                                                        if(updateStudyCenterResult.affectedRows > 0)
                                                        {
                                                            res.status(200)
                                                            return res.json({
                                                                "uuid" : updateJSON.uuid,
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
                                                            "message" : "City Not Exist For Country : " + district[0].countryName + ", State/Region : " + district[0].stateRegionName + " And District : " + district[0].name,
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
                                                        "message" : "District Not Exist For Country : " + stateRegion[0].countryName + " And State/Region : " + stateRegion[0].name,
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
                                "message" : "Study Center Type Not Matched Saved Study Center Type",
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
                            "message" : "Invalid Study Center",
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