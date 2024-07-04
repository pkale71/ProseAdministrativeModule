const commonFunction = require('../util/commonFunctions.js');
let dbBusiness = require('../sqlmap/businessQuery.js');
let errorCodes = require('../util/errorCodes.js');
let errorCode = new errorCodes();
let genUUID = require('uuid');
////////Variables 
let name;
let code;
let email;
let mobile;
let businessVerticalTypeId;
//////
let coach;
let duplicateEmailMobile;
let businessVerticalType;

module.exports = require('express').Router().post('/',async(req,res) =>
{
    try
    {
        let reqData = commonFunction.trimSpaces(req.body);
        let authData = reqData.authData;
        
        if(reqData.name != undefined && reqData.email != undefined && reqData.mobile != undefined && reqData.businessVerticalType != undefined)
        {
            if(reqData.name != "" && reqData.email != "" && reqData.mobile != "" && reqData.businessVerticalType.id != "")
            {
                name = reqData.name;
                code = "";
                email = reqData.email;
                mobile = reqData.mobile;
                businessVerticalTypeId = commonFunction.validateNumber(reqData.businessVerticalType.id);

                ////Check Duplicate Email/Mobile
                duplicateEmailMobile = await dbBusiness.checkDuplicateEmailMobile(email, mobile, "coach", "");
                if(duplicateEmailMobile.length == 0)
                {  
                    ////Check Business Vertical Type
                    businessVerticalType = await dbBusiness.getBusinessVerticalType(businessVerticalTypeId);
                    if(businessVerticalType.length == 1)
                    {
                        ///insert Coach
                        let insertJSON = {
                            "uuid" : genUUID.v1(),
                            "name" : name,
                            "code" : code,
                            "email" : email,
                            "mobile" : mobile,
                            "businessVerticalTypeId" : businessVerticalTypeId,
                            "createdById" : authData.id
                        }
                        let insertCoachResult = await dbBusiness.insertCoach(insertJSON);
                        let insertCoachId = insertCoachResult.insertId;
            ///////
                        if(parseInt(insertCoachId) > 0)
                        {
                            code = commonFunction.generateCode(6, 'C-', insertCoachId);
                            let updateCoachCodeResult = await dbBusiness.updateCoachCode(code, insertCoachId);
                            
                            res.status(200)
                            return res.json({
                                "uuid" : insertJSON.uuid,
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
                                "message" : "Coach Not Saved",
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
                            "message" : "Business Vertical Type Not Exist",
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
                        "message" : "Duplicate Email OR Mobile",
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
