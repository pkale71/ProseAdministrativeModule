const commonFunction = require('../util/commonFunctions.js');
const fs = require('fs');
const mime = require('mime-types');
let dbBusiness = require('../sqlmap/businessQuery.js');
let errorCodes = require('../util/errorCodes.js');
let errorCode = new errorCodes();
////////Variables 
let id;
let businessPartnerUUID;
//////
let businessPartner;
let businessPartnerDocUpload;

module.exports = require('express').Router().post('/',async(req,res) =>
{
    try
    {
        let reqData = commonFunction.trimSpaces(req.body);
        let authData = reqData.authData;
        
        if(reqData.id != undefined && reqData.businessPartner != undefined)
        {
            if(reqData.id != "" && reqData.businessPartner.uuid != "")
            {
                id = commonFunction.validateNumber(reqData.id);
                businessPartnerUUID = reqData.businessPartner.uuid;

                ////Check Business Partner Exist
                businessPartner = await dbBusiness.getBusinessPartner(businessPartnerUUID);
                if(businessPartner.length == 1)
                {
                    ////Check Business Partner Document Exist
                    businessPartnerDocUpload = await dbBusiness.checkBusinessPartnerDocumentExist(businessPartner[0].id, id);
                    if(businessPartnerDocUpload.length == 1)
                    {    
                        let filePath = commonFunction.getUploadFolder('BusinessPartnerDoc') + businessPartnerDocUpload[0].fileName;  
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
                            "message" : "Business Partner Document Not Exist",
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
                        "message" : "Business Partner Not Exist",
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
