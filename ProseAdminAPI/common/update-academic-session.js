const commonFunction = require('../util/commonFunctions.js');
let dbCommon = require('../sqlmap/commonQuery.js');
let errorCodes = require('../util/errorCodes.js');
let errorCode = new errorCodes();
////////Variables 
let academicSessionId;
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
        
        if(reqData.id != undefined && reqData.name != undefined && reqData.startDate != undefined && reqData.endDate != undefined && reqData.isAdmissionOpen != undefined && reqData.isCurrentSession != undefined)
        {
            if(commonFunction.validateNumber(reqData.id) > 0 && reqData.name != "" && reqData.startDate != "" && reqData.endDate != "" && commonFunction.validateNumber(reqData.isAdmissionOpen, 'Yes') <= 1 && commonFunction.validateNumber(reqData.isCurrentSession, 'Yes') <= 1)
            {
                academicSessionId = commonFunction.validateNumber(reqData.id);
                name = reqData.name;
                startDate = reqData.startDate;
                endDate = reqData.endDate;
                isAdmissionOpen = commonFunction.validateNumber(reqData.isAdmissionOpen, 'Yes');
                isCurrentSession = commonFunction.validateNumber(reqData.isCurrentSession, 'Yes');
                
            ////Check Duplicate Academic Session
                academicSession = await dbCommon.duplicateAcademicSession(name);
                if(academicSession.length > 0)
                {       
                    if(parseInt(academicSession[0].id) != parseInt(academicSessionId))
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
                
        ///update Academic Session
                let updateJSON = {
                    "id" : academicSessionId,
                    "name" : name,
                    "startDate" : startDate,
                    "endDate" : endDate,
                    "isAdmissionOpen" : isAdmissionOpen,
                    "isCurrentSession" : isCurrentSession,
                    "modifyById" : authData.id
                }
                let updateAcademicSessionResult = await dbCommon.updateAcademicSession(updateJSON);
    ///////
                if(updateAcademicSessionResult.affectedRows > 0)
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
                        "message" : "Academic Session Not Updated",
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
