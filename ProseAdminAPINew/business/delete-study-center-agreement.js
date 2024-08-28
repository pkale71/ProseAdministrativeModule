const commonFunction = require('../util/commonFunctions.js');
let dbBusiness = require('../sqlmap/businessQuery.js');
let dbCommon = require('../sqlmap/commonQuery.js');
let errorCodes = require('../util/errorCodes.js');
let errorCode = new errorCodes();
////////Variables 
let studyCenterUUID;
let studyCenterAgreementId;
//////
let studyCenter;

module.exports = require('express').Router().post('/',async(req,res) =>
{
    try
    {
        let reqData = commonFunction.trimSpaces(req.body);
        let authData = reqData.authData;
        
        if(reqData.studyCenter != undefined && reqData.id != undefined)
        {
            if(reqData.studyCenter.uuid != "" && reqData.id != "")
            {
             studyCenterUUID = reqData.studyCenter.uuid;
                studyCenterAgreementId = commonFunction.validateNumber(reqData.id);

                ////Check Study Center Exist
                studyCenter = await dbBusiness.getStudyCenter(studyCenterUUID);
                if(studyCenter.length == 1)
                {  
                /////check Contract Exist
                    let contractExist = await dbBusiness.checkStudyCenterAgreementExist('', '', studyCenter[0].id, studyCenterAgreementId);
                    if(contractExist.length == 0)
                    { 
                        res.status(500)
                        return res.json({
                            "status_code" : 500,
                            "message" : "Invalid Study Center Contract",
                            "success" : false,
                            "error" : errorCode.getStatus(500)
                        })
                    }
                    let deleteAgreementJSON = {
                        "studyCenterId" : studyCenter[0].id,
                        "id" : studyCenterAgreementId
                    }
                    let deleteStudyCenterAgreementResult = await dbBusiness.deleteStudyCenterAgreementHistory(deleteAgreementJSON);
                    if(deleteStudyCenterAgreementResult.affectedRows > 0)
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
                            "message" : "Study Center Contract Already Deleted",
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
                        "message" : "Study Center Not Exist",
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