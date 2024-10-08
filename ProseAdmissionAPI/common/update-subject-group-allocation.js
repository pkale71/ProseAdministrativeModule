const commonFunction = require('../util/commonFunctions.js');
let dbCommon = require('../sqlmap/commonQuery.js');
let errorCodes = require('../util/errorCodes.js');
let errorCode = new errorCodes();
//Variables 
let subjectGroupId;
let subjectIds;
//
let subjectGroup;
let subjectGroupAllocation;

module.exports = require('express').Router().post('/',async(req,res) =>
{
    try
    {
        let reqData = commonFunction.trimSpaces(req.body);
        let authData = reqData.authData;
        
        if(reqData.subjectGroup != undefined && reqData.subjects != undefined)
        {
            if(reqData.subjectGroup.id != "" && reqData.subjects != "")
            {
                subjectGroupId = commonFunction.validateNumber(reqData.subjectGroup.id);
                subjectIds = reqData.subjects;
                
                //check subject group exist
                subjectGroup = await dbCommon.getSubjectGroup(subjectGroupId);
                if(subjectGroup.length == 0)
                {
                    res.status(500)
                    return res.json({
                        "status_code" : 500,
                        "message" : "Invalid Subject Group",
                        "success" : false,
                        "error" : errorCode.getStatus(500)
                    });
                }

                //check duplicate subject allocation
                subjectGroupAllocation = await dbCommon.getSubjectGroupAllocationsBySubjectIds(subjectGroupId, subjectIds);
                if(subjectGroupAllocation.length > 0)
                {
                    res.status(500)
                    return res.json({
                        "status_code" : 500,
                        "message" : `[${subjectGroupAllocation[0].subjectName}] Already Allocated To The Group`,
                        "success" : false,
                        "error" : errorCode.getStatus(500)
                    });
                }

                let tempSubjectIds = subjectIds.toString().split(",");
                let getSubjectUrl = global.adminPortalAPIUrl+"common/getSubjectByIds/"+subjectIds;
                subject = await commonFunction.getExternalAPI(getSubjectUrl); 
                if(subject)
                {
                    if(tempSubjectIds.length != subject.length)
                    {
                        res.status(500)
                        return res.json({
                            "status_code" : 500,
                            "message" : "Some Subjects Are Invalid",
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
                        "message" : "Some Subjects Are Invalid",
                        "success" : false,
                        "error" : errorCode.getStatus(500)
                    });
                }
                
                //insert Subject Group
                let insertJSON = {
                    "subjectGroupId" : subjectGroupId,
                    "subjectIds" : subjectIds,
                    "createdById" : authData.id
                }
                let insertSubjectGroupAllocationResult = await dbCommon.insertSubjectGroupAllocation(insertJSON);
                let insertsubjectGroupId = insertSubjectGroupAllocationResult.insertId;
    
                if(parseInt(insertsubjectGroupId) > 0)
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
                        "message" : "Subject Group Are Not Saved",
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
            "error" : e?.stack
        });
    }
});
