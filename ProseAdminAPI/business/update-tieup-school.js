const commonFunction = require('../util/commonFunctions.js');
let dbBusiness = require('../sqlmap/businessQuery.js');
let dbCommon = require('../sqlmap/commonQuery.js');
let errorCodes = require('../util/errorCodes.js');
let errorCode = new errorCodes();
////////Variables 
let uuid;
let name;
let email;
let mobile;
let website;
let address;
let countryId;
let stateRegionId;
let districtId;
let cityId;
let pincode;
let contactPerson;
let syllabusId;
let panNumber;
//////
let syllabus;
let tieUpSchool;
let duplicateEmailMobile;
let country;
let stateRegion;
let district;
let city;

module.exports = require('express').Router().post('/',async(req,res) =>
{
    try
    {
        totalSaved = 0;
        let reqData = commonFunction.trimSpaces(req.body);
        let authData = reqData.authData;
        
        if(reqData.uuid != undefined && reqData.name != undefined && reqData.email != undefined && reqData.mobile != undefined && reqData.website != undefined && reqData.contactPerson != undefined && reqData.address != undefined && reqData.country != undefined && reqData.stateRegion != undefined && reqData.district != undefined && reqData.city != undefined && reqData.pincode != undefined && reqData.syllabus != undefined && reqData.panNumber != undefined)
        {
            if(reqData.uuid != "" && reqData.name != "" && reqData.email != "" && reqData.mobile != "" && reqData.website != "" && reqData.contactPerson != "" && reqData.address != "" && reqData.country.id != "" && reqData.stateRegion.id != "" && reqData.district.id != "" && reqData.city.id != "" && reqData.pincode != "" && reqData.syllabus.id != "" && reqData.panNumber != "")
            {
                uuid = reqData.uuid;
                name = reqData.name;
                email = reqData.email;
                mobile = reqData.mobile;
                website = reqData.website;
                contactPerson = reqData.contactPerson;
                pincode = commonFunction.validateNumber(reqData.pincode);
                address = reqData.address;
                countryId = commonFunction.validateNumber(reqData.country.id);
                stateRegionId = commonFunction.validateNumber(reqData.stateRegion.id);
                districtId = commonFunction.validateNumber(reqData.district.id);
                cityId = commonFunction.validateNumber(reqData.city.id);
                syllabusId = commonFunction.validateNumber(reqData.syllabus.id);
                panNumber = reqData.panNumber;
            
            /////check Valid Website Address
                if(!commonFunction.isValidURL(website))
                {
                    res.status(500)
                    return res.json({
                        "status_code" : 500,
                        "message" : "Invalid Website Address",
                        "success" : false,
                        "error" : errorCode.getStatus(500)
                    })
                }
                ////Check Duplicate Email/Mobile
                duplicateEmailMobile = await dbCommon.checkDuplicateEmailMobile(email, "Email", "tie_up_school", uuid);
                if(duplicateEmailMobile.length == 0)
                {  
                    ////Check Duplicate Email/Mobile
                    duplicateEmailMobile = await dbCommon.checkDuplicateEmailMobile(mobile, "Mobile", "tie_up_school", uuid);
                    if(duplicateEmailMobile.length == 0)
                    {
                        ////Check Syllabus
                        syllabus = await dbBusiness.getTieUpSchoolSyllabus(syllabusId);
                        if(syllabus.length == 1)
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
                                        ////Check Duplicate TieUp School
                                            tieUpSchool = await dbBusiness.duplicateTieUpSchool(name, uuid);
                                            if(tieUpSchool.length == 0)
                                            {
                                    ///update TieUp School
                                                let updateJSON = {
                                                    "uuid" : uuid,
                                                    "name" : name,
                                                    "email" : email,
                                                    "mobile" : mobile,
                                                    "website" : website,
                                                    "address" : address,
                                                    "countryId" : countryId,
                                                    "stateRegionId" : stateRegionId,
                                                    "districtId" : districtId,
                                                    "cityId" : cityId,
                                                    "pincode" : pincode,
                                                    "contactPerson" : contactPerson,
                                                    "panNumber" : panNumber,
                                                    "syllabusId" : syllabusId,
                                                    "createdById" : authData.id
                                                }
                                                let updateTieUpSchoolResult = await dbBusiness.updateTieUpSchool(updateJSON);
                                    ///////
                                                if(updateTieUpSchoolResult.affectedRows > 0)
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
                                                        "message" : "Tie-Up School Not Saved",
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
                                                    "message" : "Tie-Up School Name Already Exist",
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
                                "message" : "Syllabus Not Exist",
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