const commonFunction = require('../util/commonFunctions.js');
let dbCommon = require('../sqlmap/commonQuery.js');
let dbAdmission = require('../sqlmap/admissionQuery.js');
let errorCodes = require('../util/errorCodes.js');
let errorCode = new errorCodes();
let fs = require('fs');
const path = require("path");

//Variables 
let applicationUUID;
let applicationFeeInstallmentId;
let paymentMethodId;
let paymentDate;
let bankReference;
let amount;
//
let applicationForm;
let applicationFeeInstallment;
let paymentMethod;
let applicationStatus;

module.exports = require('express').Router().post('/',async(req,res) =>
{
    try
    {
        let reqData = commonFunction.trimSpaces(req.body);
        let authData = reqData.authData;
        
        if(reqData.application != undefined && reqData.applicationFeeInstallment != undefined && reqData.paymentMethod != undefined && reqData.paymentDate != undefined && reqData.bankReference != undefined && reqData.amount != undefined)
        {
            if(reqData.application.uuid != "" && reqData.applicationFeeInstallment.id != "" && reqData.paymentMethod.id != "" && reqData.paymentDate != "" && reqData.amount != "")
            {
                applicationUUID = reqData.application.uuid;
                applicationFeeInstallmentId = commonFunction.validateNumber(reqData.applicationFeeInstallment.id);
                paymentMethodId = commonFunction.validateNumber(reqData.paymentMethod.id);
                paymentDate = reqData.paymentDate;
                bankReference = reqData.bankReference;
                amount = commonFunction.validateNumber(reqData.amount);

                applicationForm = await dbAdmission.checkValidApplicationForm(applicationUUID,'','B2C');
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
                    if(applicationForm[0].applicationStatusName == "Enrolled/Renewed")
                    {
                        res.status(500)
                        return res.json({
                            "status_code" : 500,
                            "message" : "Student Already Enrolled",
                            "success" : false,
                            "error" : errorCode.getStatus(500)
                        });
                    }
                }

                if(!commonFunction.isValidDate(paymentDate))
                {
                    res.status(500)
                    return res.json({
                        "status_code" : 500,
                        "message" : "Invalid Payment Date",
                        "success" : false,
                        "error" : errorCode.getStatus(500)
                    });
                }

                paymentMethod = await dbAdmission.getPaymentMethod(paymentMethodId);
                if(paymentMethod.length == 0)
                {
                    res.status(500)
                    return res.json({
                        "status_code" : 500,
                        "message" : "Invalid Payment Method",
                        "success" : false,
                        "error" : errorCode.getStatus(500)
                    });
                }

                applicationFeeInstallment = await dbAdmission.checkApplicationFeeInstallmentExist(applicationForm[0].id, applicationFeeInstallmentId);
                if(applicationFeeInstallment.length == 0)
                {
                    res.status(500)
                    return res.json({
                        "status_code" : 500,
                        "message" : "Invalid Fee Installment",
                        "success" : false,
                        "error" : errorCode.getStatus(500)
                    });
                }
                
                applicationStatus = await dbAdmission.getApplicationFormStatus('Enrolled/Renewed', '');
                if(applicationStatus.length == 0)
                {
                    res.status(500)
                    return res.json({
                        "status_code" : 500,
                        "message" : "Invalid Application Form Status",
                        "success" : false,
                        "error" : errorCode.getStatus(500)
                    });
                }
                                    
                //update Application Form
                let insertJSON = {
                    "applicationFormId" : applicationForm[0].id,
                    "feeInstallmentId" : applicationFeeInstallment[0].id,
                    "paymentDate" : paymentDate,
                    "amount" : amount,
                    "paymentMethodId" : paymentMethodId,
                    "bankReference" : bankReference,
                    "createdById" : authData.id
                }                
                let insertPaymentResult = await dbAdmission.insertApplicationFeePayment(insertJSON);
                let insertPaymentId = insertPaymentResult.insertId;
                if(parseInt(insertPaymentId) > 0)
                {
                    let enrollmentNumber = (applicationForm[0].applicationNumber || "").toString().replace("PE", "EN");
                    let updateJSON = {
                        "applicationFormId" : applicationForm[0].id,
                        "enrollmentNumber" : enrollmentNumber,
                        "createdById" : authData.id,
                        "applicationStatusId" : applicationStatus[0].id
                    }
                    
            /////Update Enrollment Number And Update Status
                    let updateApplicationResult = await dbAdmission.saveStudentEnrollment(updateJSON);
                    if(updateApplicationResult.affectedRows > 0)
                    {
            /////Move Document Folder To Enrollment Docs
                        let copyResult = await moveApplicationDocumentFolder(applicationForm[0].applicationNumber, enrollmentNumber);
                        if(copyResult == 1)
                        {
                            res.status(200)
                            return res.json({
                                "uuid" : applicationForm[0].uuid,
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
                                "message" : "Application Document Files Copy Failed",
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
                            "message" : "Fee Payment Saved But Enrollment Number Not Generated",
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
                        "message" : "Fee Payment Not Saved",
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

async function moveApplicationDocumentFolder(applicationNumber, enrollmentNumber)
{
    let res = 1;
    applicationNumber = applicationNumber.split("/").join("_");
    enrollmentNumber = enrollmentNumber.split("/").join("_");
    let sourceRootFolder = commonFunction.getUploadFolder('ApplicationDoc') + applicationNumber;
    let destiRootFolder = commonFunction.getUploadFolder('EnrollmentDoc') + enrollmentNumber + "/" + applicationNumber;
    
    if (!fs.existsSync(sourceRootFolder)) 
    {
        //console.error(`Source folder does not exist: ${sourceRootFolder}`);
        res = 0;
    }    
    // Ensure the destination folder exists
    if(!fs.existsSync(destiRootFolder)) 
    {
        fs.mkdirSync(destiRootFolder, { recursive: true });
    }
    
    // Read the contents of the source folder
    const items = fs.readdirSync(sourceRootFolder);

    items.forEach((item) => 
    {
        const sourcePath = path.join(sourceRootFolder, item);
        const destinationPath = path.join(destiRootFolder, item);

        fs.copyFileSync(sourcePath, destinationPath);
    });
    /////Rename Source Folder
    renamedFolderName = sourceRootFolder + "_Enrolled";
    fs.rename(sourceRootFolder, renamedFolderName, (err) => 
    {
    });
    // Remove the empty source folder
    //fs.rmdirSync(sourceRootFolder);
    //console.log(`Moved folder: ${sourceRootFolder} -> ${destiRootFolder}`);
    return res;
}