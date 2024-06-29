const commonFunction = require('../util/commonFunctions.js');
let dbBusiness = require('../sqlmap/businessQuery.js');
let dbCommon = require('../sqlmap/commonQuery.js');
let errorCodes = require('../util/errorCodes.js');
let errorCode = new errorCodes();
////////Variables 
let uuid;
let name;
let email;
let businessPartnerTypeId;
let businessVerticalId;
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
let rewardApplicable;
let commissionTermId;
let panNumber;
let gstNumber;
let commercialTermId;
//////
let businessPartner;
let businessPartnerType;
let duplicateEmailMobile;
let businessVerticalType;
let businessVertical;
let country;
let stateRegion;
let district;
let city;
let commissionTerm;
let commercialTerm;

module.exports = require('express').Router().post('/',async(req,res) =>
{
    try
    {
        totalSaved = 0;
        let reqData = commonFunction.trimSpaces(req.body);
        let authData = reqData.authData;
        
        if(reqData.uuid != undefined && reqData.name != undefined && reqData.email != undefined && reqData.businessPartnerType != undefined && reqData.businessVertical != undefined && reqData.businessVerticalTypeIds != undefined && reqData.address != undefined && reqData.country != undefined && reqData.stateRegion != undefined && reqData.district != undefined && reqData.city != undefined && reqData.pincode != undefined && reqData.contactPerson != undefined && reqData.contactEmail != undefined && reqData.contactMobile != undefined && reqData.inchargePerson != undefined && reqData.inchargeEmail != undefined && reqData.inchargeMobile != undefined && reqData.applicableFrom != undefined && reqData.applicableTo != undefined && reqData.rewardApplicable != undefined && reqData.commissionTerm != undefined && reqData.panNumber != undefined && reqData.gstNumber != undefined && reqData.commercialTerm != undefined)
        {
            if(reqData.name != "" && reqData.email != undefined && reqData.businessPartnerType?.id != undefined && reqData.businessVertical?.id != "" && reqData.businessVerticalTypeIds != "" && reqData.address != "" && reqData.country?.id != "" && reqData.stateRegion?.id != "" && reqData.district?.id != "" && reqData.city?.id != "" && reqData.pincode != "" && reqData.contactPerson != "" && reqData.contactEmail != "" && reqData.contactMobile != "" && reqData.applicableFrom != "" && reqData.applicableTo != "")
            {
                uuid = reqData.uuid;
                name = reqData.name;
                email = reqData.email;
                businessPartnerTypeId = commonFunction.validateNumber(reqData.businessPartnerType?.id);
                businessVerticalId = commonFunction.validateNumber(reqData.businessVertical?.id);
                businessVerticalTypeIds = reqData.businessVerticalTypeIds;
                address = reqData.address;
                countryId = commonFunction.validateNumber(reqData.country?.id);
                stateRegionId = commonFunction.validateNumber(reqData.stateRegion?.id);
                districtId = commonFunction.validateNumber(reqData.district?.id);
                cityId = commonFunction.validateNumber(reqData.city?.id);
                pincode = commonFunction.validateNumber(reqData.pincode);
                contactPerson = reqData.contactPerson;
                contactEmail = reqData.contactEmail;
                contactMobile = reqData.contactMobile;
                inchargePerson = reqData.inchargePerson;
                inchargeEmail = reqData.inchargeEmail;
                inchargeMobile = reqData.inchargeMobile;
                applicableFrom = reqData.applicableFrom;
                applicableTo = reqData.applicableTo;
                rewardApplicable = commonFunction.validateNumber(reqData.rewardApplicable, 'Yes');
                commissionTermId = commonFunction.validateNumber(reqData.commissionTerm?.id);
                panNumber = reqData.panNumber;
                gstNumber = reqData.gstNumber;
                commercialTermId = commonFunction.validateNumber(reqData.commercialTerm?.id);
    
            /////check isApplicableFrom and isApplicableTo
                if(!commonFunction.isValidDate(applicableFrom, "YYYY-MM-DD") || !commonFunction.isValidDate(applicableTo, "YYYY-MM-DD"))
                { 
                    res.status(500)
                    return res.json({
                        "status_code" : 500,
                        "message" : "Invalid Date Format In ApplicableFrom or ApplicableTo",
                        "success" : false,
                        "error" : errorCode.getStatus(500)
                    })
                }
                ////Check Duplicate Email/Mobile
                duplicateEmailMobile = await dbCommon.checkDuplicateEmailMobile(email, "Email", "business_partner", uuid);
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
                                                businessPartner = await dbBusiness.duplicateBusinessPartner(name, businessPartnerTypeId, uuid);
                                                if(businessPartner.length == 0)
                                                {
                                        ///update Business Partner
                                                    let updateJSON = {
                                                        "uuid" : uuid,
                                                        "name" : name,
                                                        "email" : email,
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
                                                    let updateBusinessPartnerResult = await dbBusiness.updateBusinessPartner(updateJSON);
                                        ///////
                                                    if(updateBusinessPartnerResult.affectedRows > 0)
                                                    {  
                                                        res.status(200)
                                                        return res.json({
                                                            "uuid" : uuid,
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
                                                            "message" : "Business Partner Not Saved",
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
                                                        "message" : "Business Partner Name Already Exist For " + businessPartnerType[0].name,
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
                                    "message" : "Some Business Vertical Type Not Exist",
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
                                "message" : "Some Business Vertical Not Exist",
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
                            "message" : "Some BusinessPartner Type Not Exist",
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