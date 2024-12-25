const commonFunction = require('../util/commonFunctions.js');
let dbAdmission = require('../sqlmap/admissionQuery.js');
let errorCodes = require('../util/errorCodes.js');
let errorCode = new errorCodes();
//Variables 
let parentId;
let name;
let email;
let mobile;
let relationship;
let aadharNumber;
let passportNumber;
let panNumber;
let address;
let countryId;
let stateId;
let districtId;
let cityId;
let pincode;
//

module.exports = require('express').Router().post('/',async(req,res) =>
{
    try
    {
        let reqData = commonFunction.trimSpaces(req.body);
        let authData = reqData.authData;
        
        if(reqData.id != undefined && reqData.name != undefined && reqData.email != undefined && reqData.mobile != undefined && reqData.relationship != undefined && reqData.aadharNumber != undefined && reqData.passportNumber != undefined && reqData.panNumber != undefined && reqData.address != undefined && reqData.country != undefined && reqData.state != undefined && reqData.district != undefined && reqData.city != undefined && reqData.pincode != undefined)
        {
            if(reqData.id != "" && reqData.name != "" && reqData.email != "" && reqData.mobile != "" && reqData.relationship != "" && reqData.aadharNumber != "" && reqData.address != "" && reqData.country.id != "" && reqData.state.id != "" && reqData.district.id != "" && reqData.city.id != "" && reqData.pincode != "")
            {
                parentId = commonFunction.validateNumber(reqData.id);
                name = reqData.name;
                email = reqData.email;
                mobile = reqData.mobile;
                relationship = reqData.relationship;
                aadharNumber = reqData.aadharNumber;
                passportNumber = reqData.passportNumber;
                panNumber = reqData.panNumber;
                address = reqData.address;
                countryId = commonFunction.validateNumber(reqData.country.id);
                stateId = commonFunction.validateNumber(reqData.state.id);
                districtId = commonFunction.validateNumber(reqData.district.id);
                cityId = commonFunction.validateNumber(reqData.city.id);
                pincode = reqData.pincode;
                
                let parentAadhar = await dbAdmission.checkDuplicateParentAadhar(parentId, aadharNumber);
                if(parentAadhar.length > 0)
                {
                    res.status(500)
                    return res.json({
                        "status_code" : 500,
                        "message" : "Duplicate Aadhar Number",
                        "success" : false,
                        "error" : errorCode.getStatus(500)
                    });
                }   
                
                //check duplicate parent
                let parent = await dbAdmission.checkDuplicateParentEmailMobile(email, 'Email', parentId);
                if(parent.length == 0)
                {
                    parent = await dbAdmission.checkDuplicateParentEmailMobile(mobile, 'Mobile', parentId);
                    if(parent.length > 0)
                    {
                        res.status(500)
                        return res.json({
                            "status_code" : 500,
                            "message" : "Duplicate Mobile",
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
                        "message" : "Duplicate Email",
                        "success" : false,
                        "error" : errorCode.getStatus(500)
                    });
                }

                //update parent profile
                let updateJSON = {
                    "id" : parentId,
                    "name" : name,
                    "email" : email,
                    "mobile" : mobile,
                    "relationship" : relationship,
                    "aadharNumber" : aadharNumber,
                    "passportNumber" : passportNumber,
                    "panNumber" : panNumber,
                    "address" : address,
                    "countryId" : countryId,
                    "stateId" : stateId,
                    "districtId" : districtId,
                    "cityId" : cityId,
                    "pincode" : pincode,
                    "updatedById" : authData.id
                }
                let updateParentProfileResult = await dbAdmission.updateParentProfile(updateJSON);
                if(updateParentProfileResult.affectedRows > 0)
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
                        "message" : "Parent Profile Not Saved",
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
