const commonFunction = require('../util/commonFunctions.js');
let dbBusiness = require('../sqlmap/businessQuery.js');
let errorCodes = require('../util/errorCodes.js');
let errorCode = new errorCodes();
////////Variables 
let names;
let businessVerticalId;
let businessVerticalGroupId;
//////
let businessVerticalType;
let businessVertical;
let businessVerticalGroup;

module.exports = require('express').Router().post('/',async(req,res) =>
{
    try
    {
        let reqData = commonFunction.trimSpaces(req.body);
        let authData = reqData.authData;
        
        if(reqData.names != undefined && reqData.businessVertical != undefined && reqData.businessVerticalGroup != undefined)
        {
            if(reqData.names.length > 0 && reqData.businessVertical.id != "" && reqData.businessVerticalGroup.id != "")
            {
                names = reqData.names;
                businessVerticalId = commonFunction.validateNumber(reqData.businessVertical.id);
                businessVerticalGroupId = commonFunction.validateNumber(reqData.businessVerticalGroup.id);

                ////Check Business Vertical
                businessVertical = await dbBusiness.getBusinessVertical(businessVerticalId);
                if(businessVertical.length == 1)
                {
                    ////Check Business Vertical Group
                    businessVerticalGroup = await dbBusiness.getBusinessVerticalGroup(businessVerticalGroupId);
                    if(businessVerticalGroup.length == 1)
                    {
                        ////Check Duplicate Business Vertical Type
                        businessVerticalType = await dbBusiness.duplicateBusinessVerticalType(names, businessVerticalId, businessVerticalGroupId, "");
                        if(businessVerticalType.length == 0)
                        {                    
                        ///insert Business Vertical Type
                            let insertJSON = {
                                "names" : names,
                                "businessVerticalId" : businessVerticalId,
                                "businessVerticalGroupId" : businessVerticalGroupId,
                                "createdById" : authData.id
                            }
                            let insertBusinessVerticalTypeResult = await dbBusiness.insertBusinessVerticalType(insertJSON);
                            let insertBusinessVerticalTypeId = insertBusinessVerticalTypeResult.insertId;
                ///////
                            if(parseInt(insertBusinessVerticalTypeId) > 0)
                            {
                                res.status(200)
                                return res.json({
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
                                    "message" : "Business Vertical Type Not Saved",
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
                                "message" : "Business Vertical Type Already Exist For " + businessVerticalType[0].businessVerticalName + " And " + businessVerticalType[0].businessVerticalGroupName,
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
                            "message" : "Business Vertical Group Not Exist",
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
                        "message" : "Business Vertical Not Exist",
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
