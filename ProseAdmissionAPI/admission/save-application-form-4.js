const commonFunction = require('../util/commonFunctions.js');
let dbCommon = require('../sqlmap/commonQuery.js');
let dbAdmission = require('../sqlmap/admissionQuery.js');
let errorCodes = require('../util/errorCodes.js');
let errorCode = new errorCodes();
let fs = require('fs');

//Variables 
let applicationUUID;
let documentName;
let allowedMimeTypes = [
    'image/png',
    'image/jpeg',
    'application/pdf'
];
//
let applicationForm;
let applicationStatus;

module.exports = require('express').Router().post('/',async(req,res) =>
{
    try
    {
        let reqData = commonFunction.trimSpaces(req.body);
        let authData = reqData.authData;
        
        if(reqData.application != undefined && reqData.documentName != undefined)
        {
            if(JSON.parse(reqData.application).uuid != "" && reqData.documentName != "")
            {
                applicationUUID = JSON.parse(reqData.application).uuid;
                documentName = reqData.documentName;
                
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

                applicationStatus = await dbAdmission.getApplicationFormStatus('Undertaking Accepted', '');
                if(applicationStatus.length == 0)
                {
                    ///Remove Files
                    commonFunction.deleteFiles(req.files);
                    res.status(500)
                    return res.json({
                        "status_code" : 500,
                        "message" : "Invalid Application Form Status",
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

                ///////Save Application Docs File
                let fileName = "";
                let applicationNumber = applicationForm[0].applicationNumber;
                let enrollmentNumber = applicationForm[0].enrollmentNumber || "";
                if(req.files.length > 0)
                {
                    if(applicationForm[0].renewalCount > 0)
                    {
                        documentName = documentName + "_" + applicationForm[0].renewalCount;
                    }
                    fileName = await saveApplicationDocs(req.files[0], applicationNumber, enrollmentNumber, documentName);
            ///Remove Files
                    commonFunction.deleteFiles(req.files);
                }      
                if(fileName != "")
                {
                    //update Application Form
                    let updateJSON = {
                        "applicationFormId" : applicationForm[0].id,
                        "documentName" : documentName,
                        "fileName" : fileName,
                        "createdById" : authData.id,
                        "applicationStatusId" : applicationStatus[0].id
                    }                
                
                    let updateApplicationResult = await dbAdmission.updateB2CApplicationForm4(updateJSON);
                    
                    if(updateApplicationResult.affectedRows > 0)
                    {
                        res.status(200)
                        return res.json({
                            "uuid" : applicationUUID,
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
                        "message" : "Application Form File Not Uploaded",
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

async function saveApplicationDocs(file, applicationNumber, enrollmentNumber, documentName) 
{
    let savedFc = 0;    
    try 
    {
        if (parseFloat(file.size) > 0) 
        {            
            // File Upload
            applicationNumber = applicationNumber.split("/").join("_");
            enrollmentNumber = enrollmentNumber.split("/").join("_");
            let destiRootFolder = '';
            if(enrollmentNumber == '')
            {
                destiRootFolder = commonFunction.getUploadFolder('ApplicationDoc') + applicationNumber;
            }
            else
            {
                destiRootFolder = commonFunction.getUploadFolder('EnrollmentDoc') + enrollmentNumber + "/" + applicationNumber;
            }
            let fileExt = file.originalname.split('.').pop();
            let sourcePath = file.path;
            let destiFileName = `${documentName}.${fileExt}`;
            
            if(!fs.existsSync(destiRootFolder))
            {
                fs.mkdirSync(destiRootFolder);
            }
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