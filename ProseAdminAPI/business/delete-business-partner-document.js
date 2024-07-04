const commonFunction = require('../util/commonFunctions.js');
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
                    ///delete Business Partner Document
                        let deleteBusinessPartnerDocumentResult = await dbBusiness.deleteBusinessPartnerDocument(businessPartner[0].id, id);
            ///////
                        if(deleteBusinessPartnerDocumentResult.affectedRows > 0)
                        {
                    ////Remove File
                            let filePath = commonFunction.getUploadFolder('BusinessPartnerDoc') + businessPartnerDocUpload[0].fileName;
                            commonFunction.deleteFileByPath(filePath);

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
                                "message" : "Business Partner Document Already Deleted",
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
                            "message" : "Business Partner Document Already Deleted",
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
