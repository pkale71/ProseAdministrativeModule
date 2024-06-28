const commonFunction = require('../util/commonFunctions.js');
let dbCommon = require('../sqlmap/commonQuery.js');
let errorCodes = require('../util/errorCodes.js');
let errorCode = new errorCodes();
////////Variables 
let name;
let academicSessionId;
//////
let schoolingProgram;
let academicSession;

module.exports = require('express').Router().post('/',async(req,res) =>
{
    try
    {
        let reqData = commonFunction.trimSpaces(req.body);
        let authData = reqData.authData;
        
        if(reqData.name != undefined && reqData.academicSession != undefined)
        {
            if(reqData.name != "" && reqData.academicSession.id != "")
            {
                name = reqData.name;
                academicSessionId = commonFunction.validateNumber(reqData.academicSession.id);

            ////Check Academic Session Exist
                academicSession = await dbCommon.getAcademicSession(academicSessionId);
                if(academicSession.length == 1)
                {
                    ////Check Duplicate Schooling Program
                    schoolingProgram = await dbCommon.duplicateSchoolingProgram(name, academicSessionId);
                    if(schoolingProgram.length == 0)
                    {                    
                ///insert User Role
                        let insertJSON = {
                            "name" : name,
                            "academicSessionId" : academicSessionId,
                            "createdById" : authData.id
                        }
                        let insertSchoolingProgramResult = await dbCommon.insertSchoolingProgram(insertJSON);
                        let insertSchoolingProgramId = insertSchoolingProgramResult.insertId;
            ///////
                        if(parseInt(insertSchoolingProgramId) > 0)
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
                                "message" : "Schooling Program Not Saved",
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
                            "message" : "Schooling Program Already Exist",
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
                        "message" : "Academic Session Not Exist",
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
