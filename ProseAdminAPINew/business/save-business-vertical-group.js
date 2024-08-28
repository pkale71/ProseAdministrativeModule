const commonFunction = require('../util/commonFunctions.js');
let dbBusiness = require('../sqlmap/businessQuery.js');
let errorCodes = require('../util/errorCodes.js');
let errorCode = new errorCodes();
////////Variables 
let names;
let businessVerticalId;
//////
let businessVerticalGroup;
let businessVertical;

module.exports = require('express').Router().post('/',async(req,res) =>
{
    try
    {
        let reqData = commonFunction.trimSpaces(req.body);
        let authData = reqData.authData;
        
        if(reqData.names != undefined && reqData.businessVertical != undefined)
        {
            if(reqData.names.length > 0 && reqData.businessVertical.id != "")
            {
                names = reqData.names;
                businessVerticalId = commonFunction.validateNumber(reqData.businessVertical.id);

                ////Check Business Vertical
                businessVertical = await dbBusiness.getBusinessVertical(businessVerticalId);
                if(businessVertical.length == 1)
                {
                    ////Check Duplicate Business Vertical Group
                    businessVerticalGroup = await dbBusiness.duplicateBusinessVerticalGroup(names, businessVerticalId, "");
                    if(businessVerticalGroup.length == 0)
                    {                    
                    ///insert Business Vertical Group
                        let insertJSON = {
                            "names" : names,
                            "businessVerticalId" : businessVerticalId,
                            "createdById" : authData.id
                        }
                        let insertBusinessVerticalGroupResult = await dbBusiness.insertBusinessVerticalGroup(insertJSON);
                        let insertBusinessVerticalGroupId = insertBusinessVerticalGroupResult.insertId;
            ///////
                        if(parseInt(insertBusinessVerticalGroupId) > 0)
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
                                "message" : "Business Vertical Group Not Saved",
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
                            "message" : "Business Vertical Group Already Exist For " + businessVerticalGroup[0].businessVerticalName,
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
