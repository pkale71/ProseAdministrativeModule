const commonFunction = require('../util/commonFunctions.js');
let dbCommon = require('../sqlmap/commonQuery.js');
let errorCodes = require('../util/errorCodes.js');
let errorCode = new errorCodes();
////////Variables 
let name;
let startTime;
let endTime;
let academicSessionId;
//////
let academicSession;
let batchType;

module.exports = require('express').Router().post('/',async(req,res) =>
{
    try
    {
        let reqData = commonFunction.trimSpaces(req.body);
        let authData = reqData.authData;
        
        if(reqData.name != undefined && reqData.startTime != undefined && reqData.endTime != undefined && reqData.academicSession != undefined)
        {
            if(reqData.name != "" && reqData.startTime != "" && reqData.endTime != "" && reqData.academicSession.id != "")
            {
                name = reqData.name;
                startTime = reqData.startTime;
                endTime = reqData.endTime;
                academicSessionId = reqData.academicSession.id;
                
                ////Check Valid Start Time And End Time
                if(!commonFunction.isValidTime(startTime) || !commonFunction.isValidTime(endTime))
                {
                    res.status(500)
                    return res.json({
                        "status_code" : 500,
                        "message" : "Invalid Time Format In Start Time or End Time",
                        "success" : false,
                        "error" : errorCode.getStatus(500)
                    })
                }

                ////Check Academic Session Exist
                academicSession = await dbCommon.getAcademicSession(academicSessionId);
                if(academicSession.length == 0)
                {
                    res.status(500)
                    return res.json({
                        "status_code" : 500,
                        "message" : "Academic Session Not Exist For Academic Session",
                        "success" : false,
                        "error" : errorCode.getStatus(500)
                    })
                }

                ////Check Duplicate Batch Type
                batchType = await dbCommon.duplicateBatchType(name, academicSessionId, '');
                if(batchType.length == 0)
                {                    
            ///insert Batch Type
                    let insertJSON = {
                        "name" : name,
                        "startTime" : startTime,
                        "endTime" : endTime,
                        "academicSessionId" : academicSessionId,
                        "createdById" : authData.id
                    }
                    let insertBatchTypeResult = await dbCommon.insertBatchType(insertJSON);
                    let insertBatchTypeId = insertBatchTypeResult.insertId;
        ///////
                    if(parseInt(insertBatchTypeId) > 0)
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
                            "message" : "Batch Type Not Saved",
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
                        "message" : "Batch Type Already Exist",
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
