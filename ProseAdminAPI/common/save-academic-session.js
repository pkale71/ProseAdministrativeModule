const commonFunction = require('../util/commonFunctions.js');
let dbCommon = require('../sqlmap/commonQuery.js');
let errorCodes = require('../util/errorCodes.js');
let errorCode = new errorCodes();
////////Variables 
let name;
let startDate;
let endDate;
let isAdmissionOpen;
let isCurrentSession;
//////
let academicSession;

module.exports = require('express').Router().post('/',async(req,res) =>
{
    try
    {
        let reqData = commonFunction.trimSpaces(req.body);
        let authData = reqData.authData;
        
        if(reqData.name != undefined && reqData.startDate != undefined && reqData.endDate != undefined && reqData.isAdmissionOpen != undefined && reqData.isCurrentSession != undefined)
        {
            if(reqData.name != "" && reqData.startDate != "" && reqData.endDate != "" && commonFunction.validateNumber(reqData.isAdmissionOpen, 'Yes') <= 1 && commonFunction.validateNumber(reqData.isCurrentSession, 'Yes') <= 1)
            {
                name = reqData.name;
                startDate = reqData.startDate;
                endDate = reqData.endDate;
                isAdmissionOpen = commonFunction.validateNumber(reqData.isAdmissionOpen, 'Yes');
                isCurrentSession = commonFunction.validateNumber(reqData.isCurrentSession, 'Yes');
                
                ////Check Duplicate Academic Session
                academicSession = await dbCommon.duplicateAcademicSession(name);
                if(academicSession.length == 0)
                {                    
            ///insert Academic Session
                    let insertJSON = {
                        "name" : name,
                        "startDate" : startDate,
                        "endDate" : endDate,
                        "isAdmissionOpen" : isAdmissionOpen,
                        "isCurrentSession" : isCurrentSession,
                        "createdById" : authData.id
                    }
                    let insertAcademicSessionResult = await dbCommon.insertAcademicSession(insertJSON);
                    let insertAcademicSessionId = insertAcademicSessionResult.insertId;
        ///////
                    if(parseInt(insertAcademicSessionId) > 0)
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
                            "message" : "Academic Session Not Saved",
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
                        "message" : "Academic Session Already Created For " + academicSession[0].name,
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
