const commonFunction = require('../util/commonFunctions.js');
let dbBusiness = require('../sqlmap/businessQuery.js');
let dbCommon = require('../sqlmap/commonQuery.js');
let errorCodes = require('../util/errorCodes.js');
let errorCode = new errorCodes();
////////Variables 
let studyCenterUUID;
let agreementFrom;
let agreementTo;
//////
let studyCenter;

module.exports = require('express').Router().post('/',async(req,res) =>
{
    try
    {
        let reqData = commonFunction.trimSpaces(req.body);
        let authData = reqData.authData;
        
        if(reqData.studyCenter != undefined && reqData.agreementFrom != undefined && reqData.agreementTo != undefined)
        {
            if(reqData.studyCenter.uuid != "" && reqData.agreementFrom != "" && reqData.agreementTo != "")
            {
                studyCenterUUID = reqData.studyCenter.uuid;
                agreementFrom = reqData.agreementFrom;
                agreementTo = reqData.agreementTo;

            /////check AgreementFrom and AgreementTo
                if(!commonFunction.isValidDate(agreementFrom, "YYYY-MM-DD") || !commonFunction.isValidDate(agreementTo, "YYYY-MM-DD"))
                { 
                    res.status(500)
                    return res.json({
                        "status_code" : 500,
                        "message" : "Invalid Date Format In AgreementFrom or AgreementTo",
                        "success" : false,
                        "error" : errorCode.getStatus(500)
                    })
                }
                ////Check Study Center Exist
                studyCenter = await dbBusiness.getStudyCenter(studyCenterUUID);
                if(studyCenter.length == 1)
                {  
                /////check Agreement Already Created For Particular Date
                    let agreementExist = await dbBusiness.checkStudyCenterAgreementExist(agreementFrom, agreementTo, studyCenter[0].id, '');
                    if(agreementExist.length > 0)
                    { 
                        res.status(500)
                        return res.json({
                            "status_code" : 500,
                            "message" : "Agreement Already Exist For Particular Duration In Agreement From or Agreement To",
                            "success" : false,
                            "error" : errorCode.getStatus(500)
                        })
                    }
                    let insertAgreementJSON = {
                        "studyCenterId" : studyCenter[0].id,
                        "agreementFrom" : agreementFrom,
                        "agreementTo" : agreementTo,
                        "createdById" : authData.id
                    }
                    let insertStudyCenterAgreementResult = await dbBusiness.insertStudyCenterAgreementHistory(insertAgreementJSON);
                    if(insertStudyCenterAgreementResult.affectedRows > 0)
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
                            "message" : "Study Center Agreement Not Saved",
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