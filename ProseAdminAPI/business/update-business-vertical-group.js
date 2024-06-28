const commonFunction = require('../util/commonFunctions.js');
let dbBusiness = require('../sqlmap/businessQuery.js');
let errorCodes = require('../util/errorCodes.js');
let errorCode = new errorCodes();
////////Variables 
let businessVerticalGroupId;
let name;
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
        
        if(reqData.id != undefined && reqData.name != undefined && reqData.businessVertical != undefined)
        {
            if(reqData.id != "" && reqData.name != "" && reqData.businessVertical.id != "")
            {
                businessVerticalGroupId = commonFunction.validateNumber(reqData.id);
                name = reqData.name;
                businessVerticalId = commonFunction.validateNumber(reqData.businessVertical.id);

                ////Check Business Vertical
                businessVertical = await dbBusiness.getBusinessVertical(businessVerticalId);
                if(businessVertical.length == 1)
                {
                    ////Check Duplicate Business Vertical Group
                    businessVerticalGroup = await dbBusiness.duplicateBusinessVerticalGroup(name, businessVerticalId, businessVerticalGroupId);
                    if(businessVerticalGroup.length == 0)
                    {                    
                    ///insert Business Vertical Group
                        let updateJSON = {
                            "id" : businessVerticalGroupId,
                            "name" : name,
                            "businessVerticalId" : businessVerticalId,
                            "createdById" : authData.id
                        }
                        let updateBusinessVerticalGroupResult = await dbBusiness.updateBusinessVerticalGroup(updateJSON);
            ///////
                        if(updateBusinessVerticalGroupResult.affectedRows > 0)
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
