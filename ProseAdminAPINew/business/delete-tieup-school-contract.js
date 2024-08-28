const commonFunction = require('../util/commonFunctions.js');
let dbBusiness = require('../sqlmap/businessQuery.js');
let dbCommon = require('../sqlmap/commonQuery.js');
let errorCodes = require('../util/errorCodes.js');
let errorCode = new errorCodes();
////////Variables 
let tieUpSchoolUUID;
let tieUpSchoolContractId;
//////
let tieUpSchool;

module.exports = require('express').Router().post('/',async(req,res) =>
{
    try
    {
        let reqData = commonFunction.trimSpaces(req.body);
        let authData = reqData.authData;
        
        if(reqData.tieUpSchool != undefined && reqData.id != undefined)
        {
            if(reqData.tieUpSchool.uuid != "" && reqData.id != "")
            {
             tieUpSchoolUUID = reqData.tieUpSchool.uuid;
                tieUpSchoolContractId = commonFunction.validateNumber(reqData.id);

                ////Check Tie-Up School Exist
                tieUpSchool = await dbBusiness.getTieUpSchool(tieUpSchoolUUID);
                if(tieUpSchool.length == 1)
                {  
                /////check Contract Exist
                    let contractExist = await dbBusiness.checkTieUpSchoolContractExist('', '', tieUpSchool[0].id, tieUpSchoolContractId);
                    if(contractExist.length == 0)
                    { 
                        res.status(500)
                        return res.json({
                            "status_code" : 500,
                            "message" : "Invalid Tie-Up School Contract",
                            "success" : false,
                            "error" : errorCode.getStatus(500)
                        })
                    }
                    let deleteContractJSON = {
                        "tieUpSchoolId" : tieUpSchool[0].id,
                        "id" : tieUpSchoolContractId
                    }
                    let deleteTieUpSchoolContractResult = await dbBusiness.deleteTieUpSchoolContractHistory(deleteContractJSON);
                    if(deleteTieUpSchoolContractResult.affectedRows > 0)
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
                            "message" : "Tie-Up School Contract Already Deleted",
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
                        "message" : "Tie-Up School Not Exist",
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