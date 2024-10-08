const commonFunction = require('../util/commonFunctions.js');
let dbCommon = require('../sqlmap/commonQuery.js');
let errorCodes = require('../util/errorCodes.js');
let errorCode = new errorCodes();
//Variables 
let discountTypeId;
let name;
//
let discountType;
let feeStructureDiscountType;

module.exports = require('express').Router().post('/',async(req,res) =>
{
    try
    {
        let reqData = commonFunction.trimSpaces(req.body);
        let authData = reqData.authData;
        
        if(reqData.id != undefined && reqData.name != undefined)
        {
            if(reqData.id != "" && reqData.name != "")
            {
                discountTypeId = commonFunction.validateNumber(reqData.id);
                name = reqData.name;
                
                //check discount Type exist
                feeStructureDiscountType = await dbCommon.checkDiscountTypeExist(discountTypeId);
                if(feeStructureDiscountType.length == 0)
                {
                    discountType = await dbCommon.duplicateDiscountType(name, '', discountTypeId);
                    if(discountType.length == 0)
                    {                    
                        //insert discountType
                        let updateJSON = {
                            "id" : discountTypeId,
                            "name" : name,
                            "createdById" : authData.id
                        }
                        let updateDiscountTypeResult = await dbCommon.updateDiscountType(updateJSON);
                        if(updateDiscountTypeResult.affectedRows > 0)
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
                                "message" : "Discount Type Not Saved",
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
                            "message" : "Discount Type Already Exist",
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
                        "message" : "Discount Type Currently In Use",
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
            "error" : e
        });
    }
});
