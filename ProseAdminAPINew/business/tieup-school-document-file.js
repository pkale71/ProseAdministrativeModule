const commonFunction = require('../util/commonFunctions.js');
const fs = require('fs');
const mime = require('mime-types');
let dbBusiness = require('../sqlmap/businessQuery.js');
let errorCodes = require('../util/errorCodes.js');
let errorCode = new errorCodes();
////////Variables 
let id;
let tieUpSchoolUUID;
//////
let tieUpSchool;
let tieUpSchoolDocUpload;

module.exports = require('express').Router().post('/',async(req,res) =>
{
    try
    {
        let reqData = commonFunction.trimSpaces(req.body);
        let authData = reqData.authData;
        
        if(reqData.id != undefined && reqData.tieUpSchool != undefined)
        {
            if(reqData.id != "" && reqData.tieUpSchool.uuid != "")
            {
                id = commonFunction.validateNumber(reqData.id);
                tieUpSchoolUUID = reqData.tieUpSchool.uuid;

                ////Check Tie-Up School Exist
                tieUpSchool = await dbBusiness.getTieUpSchool(tieUpSchoolUUID);
                if(tieUpSchool.length == 1)
                {
                    ////Check Tie-Up School Document Exist
                    tieUpSchoolDocUpload = await dbBusiness.checkTieUpSchoolDocumentExist(tieUpSchool[0].id, id);
                    if(tieUpSchoolDocUpload.length == 1)
                    {    
                        let filePath = commonFunction.getUploadFolder('TieUpSchoolDoc') + tieUpSchoolDocUpload[0].fileName;  
                        const mimeType = mime.lookup(filePath);              
                        fs.readFile(filePath, (err, data) => 
                        {
                            if (err) 
                            {
                                res.status(500)
                                return res.json({
                                    "status_code" : 500,
                                    "message" : "Error Reading File",
                                    "success" : false,
                                    "error" : errorCode.getStatus(500)
                                })
                            }                    
                            // Convert file data to base64
                            const base64Data = `data:${mimeType};base64,` + data.toString('base64');
                            
                            res.status(200)
                            return res.json({
                                "mimeType" : mimeType,
                                "fileData" : base64Data,
                                "status_code" : 200,
                                "success" : true,                            
                                "message" : errorCode.getStatus(200)
                            })
                        });
                    }
                    else 
                    {
                        res.status(500)
                        return res.json({
                            "status_code" : 500,
                            "message" : "Tie-Up School Document Not Exist",
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
