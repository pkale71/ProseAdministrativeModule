const commonFunction = require('../util/commonFunctions.js');
let dbCommon = require('../sqlmap/commonQuery.js');
let dbAdmission = require('../sqlmap/admissionQuery.js');
let errorCodes = require('../util/errorCodes.js');
let errorCode = new errorCodes();

//Variables 
let applicationUUID;
let documentId;
let allowedMimeTypes = [
    'image/png',
    'image/jpeg',
    'application/pdf'
];
//
let applicationForm;
let studentDocument;

module.exports = require('express').Router().post('/',async(req,res) =>
{
    try
    {
        let reqData = commonFunction.trimSpaces(req.body);
        let authData = reqData.authData;
        
        if(reqData.application != undefined && reqData.studentDocument != undefined)
        {
            if(JSON.parse(reqData.application).uuid != "" && JSON.parse(reqData.studentDocument).id != "")
            {
                applicationUUID = JSON.parse(reqData.application).uuid;
                documentId = JSON.parse(reqData.studentDocument).id;
                
                applicationForm = await dbAdmission.checkValidApplicationForm(applicationUUID,'','');
                if(applicationForm.length == 0)
                {
                    ///Remove Files
                    commonFunction.deleteFiles(req.files);
                    res.status(500)
                    return res.json({
                        "status_code" : 500,
                        "message" : "Invalid Application Form",
                        "success" : false,
                        "error" : errorCode.getStatus(500)
                    });
                }

                studentDocument = await dbAdmission.checkStudentDocumentExist(applicationForm[0].id, documentId);
                if(studentDocument.length > 0)
                {
                    ///Remove Files
                    commonFunction.deleteFiles(req.files);
                    res.status(500)
                    return res.json({
                        "status_code" : 500,
                        "message" : "Student Document Exist For Application",
                        "success" : false,
                        "error" : errorCode.getStatus(500)
                    });
                }

                studentDocument = await dbCommon.getStudentDocument(documentId);
                if(studentDocument.length == 0)
                {
                    ///Remove Files
                    commonFunction.deleteFiles(req.files);
                    res.status(500)
                    return res.json({
                        "status_code" : 500,
                        "message" : "Invalid Student Document",
                        "success" : false,
                        "error" : errorCode.getStatus(500)
                    });
                }

                if(req.files.length > 0)
                {
                    if(!allowedMimeTypes.includes(req.files[0].mimetype) || parseFloat(req.files[0].size) == 0)
                    {
                        ///Remove Files
                        commonFunction.deleteFiles(req.files);
                        res.status(500)
                        return res.json({
                            "status_code" : 500,
                            "message" : "Invalid File Format Or Zero Size File, Only (JPG, PNG, PDF) File Types Are Allowed",
                            "success" : false,
                            "error" : errorCode.getStatus(500)
                        })
                    }
                }

                ///////Save Application Student Docs File
                let fileName = "";
                if(req.files.length > 0)
                {
                    fileName = await saveApplicationDocs(req.files[0], applicationForm[0].applicationNumber, applicationForm[0].enrollmentNumber, applicationForm[0].applicationStatusName, studentDocument[0].name, applicationForm[0].renewalCount);
            ///Remove Files
                    commonFunction.deleteFiles(req.files);
                }      
                if(fileName != "")
                {
                    //update Application Docs
                    let insertJSON = {
                        "applicationFormId" : applicationForm[0].id,
                        "documentId" : studentDocument[0].id,
                        "fileName" : fileName,
                        "createdById" : authData.id
                    }                
                
                    let insertApplicationResult = await dbAdmission.insertApplicationStudentDoc(insertJSON);
                    let insertApplicationId = insertApplicationResult.insertId;
                    
                    if(parseInt(insertApplicationId) > 0)
                    {
                        res.status(200)
                        return res.json({
                            "id" : insertApplicationId,
                            "status_code" : 200,
                            "success" : true,                            
                            "message" : errorCode.getStatus(200)
                        });
                    }
                    else
                    {
                        ///Remove Files
                        commonFunction.deleteFiles(req.files);
                        res.status(500)
                        return res.json({
                            "status_code" : 500,
                            "message" : "Application Form Deatil Not Saved",
                            "success" : false,
                            "error" : errorCode.getStatus(500)
                        });
                    }
                }
                else
                {
                    ///Remove Files
                    commonFunction.deleteFiles(req.files);
                    res.status(500)
                    return res.json({
                        "status_code" : 500,
                        "message" : "Document File Not Uploaded",
                        "success" : false,
                        "error" : errorCode.getStatus(500)
                    });
                }
            }
            else
            {
                ///Remove Files
                commonFunction.deleteFiles(req.files);
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
            ///Remove Files
            commonFunction.deleteFiles(req.files);
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
        ///Remove Files
        commonFunction.deleteFiles(req.files);
        res.status(500)
        return res.json({
            "status_code" : 500,
            "message" : "Something Went Wrong",
            "success" : false,
            "error" : e
        });
    }
});

async function saveApplicationDocs(file, applicationNumber, enrollmentNumber, appplicationStatus, documentName, renewalCount) 
{
    let savedFc = 0;    
    try 
    {
        if (parseFloat(file.size) > 0) 
        {            
            // File Upload
            documentName = commonFunction.generateShortDescription(documentName).toString().split(" ").join("_");
            if(renewalCount> 0)
            {
                documentName = documentName + "_" + renewalCount;
            }
            applicationNumber = applicationNumber.toString().split("/").join("_");
            enrollmentNumber = (enrollmentNumber || "").toString().split("/").join("_");
            let destiRootFolder = "";
            if(appplicationStatus == 'Enrolled/Renewed')
            {
                let folderName =  (enrollmentNumber +"/" + applicationNumber);
                destiRootFolder = commonFunction.getUploadFolder('EnrollmentDoc') + folderName;
            }
            else
            {
                let folderName =  applicationNumber;
                destiRootFolder = commonFunction.getUploadFolder('ApplicationDoc') + folderName;
            }
            let fileExt = file.originalname.split('.').pop();
            let sourcePath = file.path;
            let destiFileName = `${documentName}.${fileExt}`;
            let destiPath = destiRootFolder + "/" + destiFileName;

            await commonFunction.copyFile(sourcePath, destiPath);

            return destiFileName;
        }
    } 
    catch (e) 
    {
        return "";
    }

    return savedFc;
}