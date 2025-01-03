const commonFunction = require('../util/commonFunctions.js');
let dbCommon = require('../sqlmap/commonQuery.js');
let errorCodes = require('../util/errorCodes.js');
let errorCode = new errorCodes();
//Variables 
let feeCategoryId;
let name;
let availingInstallment;
//
let feeCategory;
let feeStructure;

module.exports = require('express').Router().post('/',async(req,res) =>
{
    try
    {
        let reqData = commonFunction.trimSpaces(req.body);
        let authData = reqData.authData;
        
        if(reqData.id != undefined && reqData.name != undefined && reqData.availingInstallment != undefined)
        {
            if(reqData.id != "" && reqData.name != "" && reqData.availingInstallment != "")
            {
                feeCategoryId = commonFunction.validateNumber(reqData.id);
                name = reqData.name;
                availingInstallment = commonFunction.validateNumber(reqData.availingInstallment,"Yes");
                
                //check fee category exist
                feeStructure = await dbCommon.checkFeeCategoryExist(feeCategoryId);
                if(feeStructure.length == 0)
                {
                    feeCategory = await dbCommon.duplicateFeeCategory(name, feeCategoryId);
                    if(feeCategory.length == 0)
                    {                    
                        //insert feeCategory
                        let updateJSON = {
                            "id" : feeCategoryId,
                            "name" : name,
                            "availingInstallment" : availingInstallment,
                            "createdById" : authData.id
                        }
                        let updateFeeCategoryResult = await dbCommon.updateFeeCategory(updateJSON);
                        if(updateFeeCategoryResult.affectedRows > 0)
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
                                "message" : "Fee Category Not Saved",
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
                            "message" : "Fee Category Already Exist",
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
                        "message" : "Fee Category Currently In Use",
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
