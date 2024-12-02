const commonFunction = require('../util/commonFunctions.js');
let dbCommon = require('../sqlmap/commonQuery.js');
let dbAdmission = require('../sqlmap/admissionQuery.js');
let errorCodes = require('../util/errorCodes.js');
let errorCode = new errorCodes();

//Variables 
let applicationUUID;
let documentName;
let applicationStudentDocumentId;
//
let applicationForm;
let applicationStudentDocument;

module.exports = require('express').Router().post('/',async(req,res) =>
{
    try
    {
        let reqData = commonFunction.trimSpaces(req.body);
        let authData = reqData.authData;
        
        if(reqData.application != undefined && reqData.documentName != undefined && reqData.applicationStudentDocument != undefined)
        {
            if(reqData.application.uuid != "")
            {
                applicationUUID = reqData.application.uuid;
                documentName = reqData.documentName;
                applicationStudentDocumentId = reqData.applicationStudentDocument.id;

                applicationForm = await dbAdmission.checkValidApplicationForm(applicationUUID,'','');
                if(applicationForm.length == 0)
                {
                    res.status(500)
                    return res.json({
                        "status_code" : 500,
                        "message" : "Invalid Application Form",
                        "success" : false,
                        "error" : errorCode.getStatus(500)
                    });
                }
                
                if(applicationStudentDocumentId != "")
                {
                    applicationStudentDocument = await dbAdmission.getApplicationStudentDocument(applicationForm[0].id, applicationStudentDocumentId);
                    if(applicationStudentDocument.length == 0)
                    {
                        res.status(500)
                        return res.json({
                            "status_code" : 500,
                            "message" : "Invalid Student Document",
                            "success" : false,
                            "error" : errorCode.getStatus(500)
                        });
                    }
                }
                ///////Download Docs File
                let filePath = "";
                let fileName = "";
                let applicationNumber = (applicationForm[0].applicationNumber || "").toString().split("/").join("_");
                let enrollmentNumber = (applicationForm[0].enrollmentNumber || "").toString().split("/").join("_");

                if(applicationForm[0].applicationStatusName != 'Enrolled/Renewed' && documentName == "" && applicationStudentDocument?.length > 0)
                {
                    fileName = applicationStudentDocument[0].fileName;
                    filePath = commonFunction.getUploadFolder('ApplicationDoc') + applicationNumber + "/" + fileName;
                }
                else if(applicationForm[0].applicationStatusName == 'Enrolled/Renewed' && documentName == "" && applicationStudentDocument?.length > 0)
                {
                    fileName = applicationStudentDocument[0].fileName;
                    filePath = commonFunction.getUploadFolder('EnrollmentDoc') + enrollmentNumber + "/" + applicationNumber + "/" + fileName;
                }  
                else if(documentName != "" && !applicationStudentDocument?.length)
                {
                    if(documentName == "Application_Form")
                    {
                        fileName = applicationForm[0].applicationFileName;
                        filePath = commonFunction.getUploadFolder('ApplicationDoc') + applicationNumber + "/" + fileName;
                    }
                    else if(documentName == "Undertaking_Form")
                    {
                        fileName = applicationForm[0].undertakingFileName;
                        filePath = commonFunction.getUploadFolder('ApplicationDoc') + applicationNumber + "/" + fileName;
                    }                                   
                }
                if(filePath != "" && fileName != "")
                {
                    res.download(filePath, fileName, (err) => 
                    {
                        if (err) 
                        {
                            res.status(404).json({
                                "status_code": 404,
                                "success": false,
                                "message": "File not found or unable to download.",
                            });
                        }
                    });
                }
                else
                {
                    res.status(500)
                    return res.json({
                        "status_code" : 500,
                        "message" : "File Path Not Recognized",
                        "success" : false,
                        "error" : errorCode.getStatus(500)
                    });
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
                });
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
            });
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
});

