const commonFunction = require('../util/commonFunctions.js');
let dbCommon = require('../sqlmap/commonQuery.js');
let errorCodes = require('../util/errorCodes.js');
let errorCode = new errorCodes();
//Variables 
let name;
let availingInstallment;
//
let feeCategory;

module.exports = require('express').Router().post('/',async(req,res) =>
{
    try
    {
        let reqData = commonFunction.trimSpaces(req.body);
        let authData = reqData.authData;
        
        if(reqData.name != undefined && reqData.availingInstallment != undefined)
        {
            if(reqData.name != "" && reqData.availingInstallment != "")
            {
                name = reqData.name;
                availingInstallment = commonFunction.validateNumber(reqData.availingInstallment,"Yes");
              
                //check duplicate fee category   
                feeCategory = await dbCommon.duplicateFeeCategory(name, "");
                if(feeCategory.length == 0)
                {                    
                    //insert Fee Category
                    let insertJSON = {
                        "name" : name,
                        "availingInstallment" : availingInstallment,
                        "createdById" : authData.id
                    }
                    let insertFeeCategoryResult = await dbCommon.insertFeeCategory(insertJSON);
                    let insertFeeCategoryId = insertFeeCategoryResult.insertId;
        
                    if(parseInt(insertFeeCategoryId) > 0)
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
