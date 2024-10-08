const commonFunction = require('../util/commonFunctions.js');
let dbCommon = require('../sqlmap/commonQuery.js');
let errorCodes = require('../util/errorCodes.js');
let errorCode = new errorCodes();
//Variables 
let feeTypeId;
let name;
//
let feeType;
let feeStructureFeeType;

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
                feeTypeId = commonFunction.validateNumber(reqData.id);
                name = reqData.name;
                
                //check fee Type exist
                feeStructureFeeType = await dbCommon.checkFeeTypeExist(feeTypeId);
                if(feeStructureFeeType.length == 0)
                {
                    feeType = await dbCommon.duplicateFeeType(name, '', feeTypeId);
                    if(feeType.length == 0)
                    {                    
                        //insert feeType
                        let updateJSON = {
                            "id" : feeTypeId,
                            "name" : name,
                            "createdById" : authData.id
                        }
                        let updateFeeTypeResult = await dbCommon.updateFeeType(updateJSON);
                        if(updateFeeTypeResult.affectedRows > 0)
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
                                "message" : "Fee Type Not Saved",
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
                            "message" : "Fee Type Already Exist",
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
                        "message" : "Fee Type Currently In Use",
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
