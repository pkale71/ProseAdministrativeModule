const commonFunction = require('../util/commonFunctions.js');
let dbCommon = require('../sqlmap/commonQuery.js');
let errorCodes = require('../util/errorCodes.js');
let errorCode = new errorCodes();
//Variables 
let uuid;
let id;
//
let feeStructure;

module.exports = require('express').Router().post('/',async(req,res) =>
{
    try
    {
        let reqData = commonFunction.trimSpaces(req.body);
        let authData = reqData.authData;
        if(reqData.uuid != undefined )
        {
            if(reqData.uuid != "")
            {
                uuid = reqData.uuid;
                feeStructure = await dbCommon.getFeeStructure(uuid);
                if(feeStructure.length == 1)
                {
                    id = feeStructure[0].id;
                    feeStructure = await dbCommon.checkFeeStructureExist(id);
                    if(feeStructure.length == 0)
                    {
                        let updateFeeStructureResult = await dbCommon.deleteFeeStructure(id);
                        if(updateFeeStructureResult[4].affectedRows > 0)
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
                                "message" : "Fee Structure Already Deleted",
                                "success" : false,
                                "error" : errorCode.getStatus(500),
                            });
                        }
                    }
                    else
                    {
                        res.status(500)
                        return res.json({
                            "status_code" : 500,
                            "message" : "Fee Structure Currently In Use",
                            "success" : false,
                            "error" : errorCode.getStatus(500),
                        });
                    }
                }
                else
                {
                    res.status(500)
                    return res.json({
                        "status_code" : 500,
                        "message" : "Invalid Fee Structure",
                        "success" : false,
                        "error" : errorCode.getStatus(500),
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
                    "error" : errorCode.getStatus(500),
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
