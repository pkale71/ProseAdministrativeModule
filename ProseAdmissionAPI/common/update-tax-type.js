const commonFunction = require('../util/commonFunctions.js');
let dbCommon = require('../sqlmap/commonQuery.js');
let errorCodes = require('../util/errorCodes.js');
let errorCode = new errorCodes();
//Variables 
let taxTypeId;
let name;
//
let taxType;
let taxRate;

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
                taxTypeId = commonFunction.validateNumber(reqData.id);
                name = reqData.name;
                
                //check taxType exist
                taxRate = await dbCommon.checkTaxTypeExist(taxTypeId);
                if(taxRate.length == 0)
                {
                    taxType = await dbCommon.duplicateTaxType(name, taxTypeId);
                    if(taxType.length == 0)
                    {                    
                        //insert taxType
                        let updateJSON = {
                            "id" : taxTypeId,
                            "name" : name,
                            "createdById" : authData.id
                        }
                        let updateTaxTypeResult = await dbCommon.updateTaxType(updateJSON);
                        if(updateTaxTypeResult.affectedRows > 0)
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
                                "message" : "Tax Type Not Saved",
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
                            "message" : "Tax Type Already Exist",
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
                        "message" : "Tax Type Currently In Use",
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