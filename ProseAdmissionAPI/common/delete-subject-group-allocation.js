const commonFunction = require('../util/commonFunctions.js');
let dbCommon = require('../sqlmap/commonQuery.js');
let errorCodes = require('../util/errorCodes.js');
let errorCode = new errorCodes();
//Variables 
let id;
let subjectGroupId;
//
// let feeStructure;

module.exports = require('express').Router().post('/',async(req,res) =>
{
    try
    {
        let reqData = commonFunction.trimSpaces(req.body);
        let authData = reqData.authData;
        if(reqData.id != undefined && reqData.subjectGroup != undefined)
        {
            if(reqData.id != "" && reqData.subjectGroup.id != "")
            {
                id = commonFunction.validateNumber(reqData.id);
                subjectGroupId = commonFunction.validateNumber(reqData.subjectGroup.id);

                // feeStructure = await dbCommon.checkFeeCategoryExist(id);
                // if(feeStructure.length == 0)
                // {
                    let updateSubjectGroupAllocationResult = await dbCommon.deleteSubjectGroupAllocation(id, subjectGroupId);
                    if(updateSubjectGroupAllocationResult.affectedRows > 0)
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
                            "message" : "Subject Allocation Already Deleted",
                            "success" : false,
                            "error" : errorCode.getStatus(500),
                        });
                    }
                // }
                // else
                // {
                //     res.status(500)
                //     return res.json({
                //         "status_code" : 500,
                //         "message" : "Subject Allocation Currently In Use",
                //         "success" : false,
                //         "error" : errorCode.getStatus(500),
                //     });
                // }
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