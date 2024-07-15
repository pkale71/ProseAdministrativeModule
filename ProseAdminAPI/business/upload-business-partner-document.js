const commonFunction = require('../util/commonFunctions.js');
let dbBusiness = require('../sqlmap/businessQuery.js');
let errorCodes = require('../util/errorCodes.js');
let errorCode = new errorCodes();
////////Variables 
let academyEnclosureDocId;
let businessPartnerUUID;
//////
let businessPartner;
let businessPartnerDocUpload;
let academyEnclosureDocument;
let allowedMimeTypes = [
    'image/png',
    'image/jpeg',
    'application/pdf'
];

module.exports = require('express').Router().post('/',async(req,res) =>
{
    try
    {
        let reqData = commonFunction.trimSpaces(req.body);
        let authData = reqData.authData;
        
        if(JSON.parse(reqData.businessPartner) != undefined && JSON.parse(reqData.academyEnclosureDocument))
        {
            if(JSON.parse(reqData.academyEnclosureDocument)?.id != "" && JSON.parse(reqData.businessPartner)?.uuid != "" && req.files.length == 1 && parseFloat(req.files[0].size) > 0)
            {
                businessPartnerUUID = JSON.parse(reqData.businessPartner).uuid;
                academyEnclosureDocId = commonFunction.validateNumber(JSON.parse(reqData.academyEnclosureDocument).id);

                if (!allowedMimeTypes.includes(req.files[0].mimetype)) 
                {
                    commonFunction.deleteFiles(req.files);
                    res.status(500)
                    return res.json({
                        "status_code" : 500,
                        "message" : "Invalid File Format",
                        "success" : false,
                        "error" : errorCode.getStatus(500)
                    })
                }

                ////Check Business Partner Exist
                businessPartner = await dbBusiness.getBusinessPartner(businessPartnerUUID);
                if(businessPartner.length == 1)
                {
                    ///Check Academy Enclosure Document Exist
                    academyEnclosureDocument = await dbBusiness.getAcademyEnclosureDocument(academyEnclosureDocId);
                    if(academyEnclosureDocument.length == 1)
                    {
                ///Get File Source Path
                        let fileExt = req.files[0].originalname.split('.').pop();
                        let sourcePath = req.files[0].path;

                ///Check Academy Enclosure Document Already Upload For Business Partner
                        businessPartnerDocUpload = await dbBusiness.checkDuplicateBusinessPartnerDoc(businessPartner[0].id, academyEnclosureDocId);
                        if(businessPartnerDocUpload.length == 1)
                        {
                            ////Remove Old File
                            let filePath = commonFunction.getUploadFolder('BusinessPartnerDoc') + businessPartnerDocUpload[0].fileName;
                            commonFunction.deleteFileByPath(filePath);

                    ///update Business Partner Document
                            let savedFileName = businessPartnerDocUpload[0].fileName.toString().split('.');                            
                            let destiFileName = `${savedFileName[0]}.${fileExt}`;
                    //// Update the file name in the database
                            let updateBusinessPartnerDocumentResult = await dbBusiness.updateBusinessPartnerDocFileName(destiFileName, businessPartnerDocUpload[0].id, authData.id);
                        ///////
                            if(updateBusinessPartnerDocumentResult.affectedRows > 0)
                            {
                                let destiPath = commonFunction.getUploadFolder('BusinessPartnerDoc') + destiFileName;
                                await commonFunction.copyFile(sourcePath, destiPath);

                                commonFunction.deleteFiles(req.files);
                                res.status(200)
                                return res.json({
                                    "status_code" : 200,
                                    "success" : true,                            
                                    "message" : errorCode.getStatus(200)
                                })
                            }
                            else
                            {
                                commonFunction.deleteFiles(req.files);
                                res.status(500)
                                return res.json({
                                    "status_code" : 500,
                                    "message" : "Business Partner Document Not Uploaded",
                                    "success" : false,
                                    "error" : errorCode.getStatus(500)
                                })
                            }
                        }
                        else
                        {
                            let insertJSON = {
                                businessPartnerId: businessPartner[0].id,
                                documentId: academyEnclosureDocId,
                                fileName: "",
                                createdById: authData.id
                            };
                    ///insert Business Partner Document
                            let insertBusinessPartnerDocumentResult = await dbBusiness.insertBusinessPartnerDocument(insertJSON);
                            let insertBusinessPartnerDocId = insertBusinessPartnerDocumentResult.insertId;
                ///////
                            if(parseInt(insertBusinessPartnerDocId) > 0)
                            {
                                let destiFileName = `${businessPartner[0].code}_${insertBusinessPartnerDocId}.${fileExt}`;
                                let destiPath = commonFunction.getUploadFolder('BusinessPartnerDoc') + destiFileName;
                                
                                // Update the file name in the database
                                let updateBusinessPartnerDocumentResult = await dbBusiness.updateBusinessPartnerDocFileName(destiFileName, insertBusinessPartnerDocId);
                            ///////
                                if(updateBusinessPartnerDocumentResult.affectedRows > 0)
                                {
                                    await commonFunction.copyFile(sourcePath, destiPath);
                                    
                                    commonFunction.deleteFiles(req.files);
                                    res.status(200)
                                    return res.json({
                                        "status_code" : 200,
                                        "success" : true,                            
                                        "message" : errorCode.getStatus(200)
                                    })
                                }
                                else
                                {
                                    commonFunction.deleteFiles(req.files);
                                    res.status(500)
                                    return res.json({
                                        "status_code" : 500,
                                        "message" : "Business Partner Document Not Uploaded",
                                        "success" : false,
                                        "error" : errorCode.getStatus(500)
                                    })
                                }
                            }
                            else
                            {
                                commonFunction.deleteFiles(req.files);
                                res.status(500)
                                return res.json({
                                    "status_code" : 500,
                                    "message" : "Business Partner Document Not Uploaded",
                                    "success" : false,
                                    "error" : errorCode.getStatus(500)
                                })
                            }
                        }
                    }
                    else 
                    {
                        commonFunction.deleteFiles(req.files);
                        res.status(500)
                        return res.json({
                            "status_code" : 500,
                            "message" : "Invalid Academy Enclosure Document",
                            "success" : false,
                            "error" : errorCode.getStatus(500)
                        })
                    }
                }
                else
                {
                    commonFunction.deleteFiles(req.files);
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
                commonFunction.deleteFiles(req.files);
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
            commonFunction.deleteFiles(req.files);
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
        commonFunction.deleteFiles(req.files);
        res.status(500)
        return res.json({
            "status_code" : 500,
            "message" : "Something Went Wrong",
            "success" : false,
            "error" : e
        });
    }
})
