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
                else
                {
                    if(applicationForm[0].applicationStatusName == 'Enrolled/Renewed' && documentName != "")
                    {
                        res.status(500)
                        return res.json({
                            "status_code" : 500,
                            "message" : "Student Already Enrolled/Renewed, So File Cannot Be Deleted",
                            "success" : false,
                            "error" : errorCode.getStatus(500)
                        });
                    }
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
                ///////Delete Docs File
                let applicationNumber = (applicationForm[0].applicationNumber || "").toString().split("/").join("_");
                let enrollmentNumber = (applicationForm[0].enrollmentNumber || "").toString().split("/").join("_");

                if(applicationForm[0].applicationStatusName != 'Enrolled/Renewed' && documentName == "" && applicationStudentDocument?.length > 0)
                {
                    let filePath = commonFunction.getUploadFolder('ApplicationDoc') + applicationNumber + "/" + applicationStudentDocument[0].fileName;
                    commonFunction.deleteFileByPath(filePath);
                }
                else if(applicationForm[0].applicationStatusName == 'Enrolled/Renewed' && documentName == "" && applicationStudentDocument?.length > 0)
                {
                    let filePath = commonFunction.getUploadFolder('EnrollmentDoc') + enrollmentNumber + "/" + applicationNumber + "/" + applicationStudentDocument[0].fileName;
                    commonFunction.deleteFileByPath(filePath);
                }  
                else if(documentName != "" && !applicationStudentDocument?.length)
                {
                    if(documentName == "Application_Form")
                    {
                        let filePath = commonFunction.getUploadFolder('ApplicationDoc') + applicationNumber + "/" + applicationForm[0].applicationFileName;
                        commonFunction.deleteFileByPath(filePath); 
                    }
                    else if(documentName == "Undertaking_Form")
                    {
                        let filePath = commonFunction.getUploadFolder('ApplicationDoc') + applicationNumber + "/" + applicationForm[0].undertakingFileName;
                        commonFunction.deleteFileByPath(filePath); 
                    }                                   
                }
                if(documentName == "" && applicationStudentDocument?.length > 0)
                {
                    let deleteDocResult = await dbAdmission.deleteApplicationStudentDoc(applicationStudentDocument[0].id);
                    
                    if(deleteDocResult.affectedRows > 0)
                    {
                        res.status(200)
                        return res.json({
                            "status_code" : 200,
                            "success" : true,                            
                            "message" : errorCode.getStatus(200)
                        });
                    }
                    else
                    {
                        res.status(500)
                        return res.json({
                            "status_code" : 500,
                            "message" : "Document Note Deleted",
                            "success" : false,
                            "error" : errorCode.getStatus(500)
                        });
                    }
                }
                else if(documentName != "" && !applicationStudentDocument?.length)
                {
                    let deleteDocResult = await dbAdmission.deleteApplicationUndertakingDoc(applicationForm[0].id, documentName);
                    
                    if(deleteDocResult.affectedRows > 0)
                    {
                        res.status(200)
                        return res.json({
                            "status_code" : 200,
                            "success" : true,                            
                            "message" : errorCode.getStatus(200)
                        });
                    }
                    else
                    {
                        res.status(500)
                        return res.json({
                            "status_code" : 500,
                            "message" : "Document Note Deleted",
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
                        "message" : "Application Document Not Found",
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

