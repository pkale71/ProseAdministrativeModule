const commonFunction = require('../util/commonFunctions.js');
let dbAdmission = require('../sqlmap/admissionQuery.js');
let errorCodes = require('../util/errorCodes.js');
let errorCode = new errorCodes();
//Variables 
let applicationUUID;
let studentName;
let genderId;
let nationality;
let dob;
let aadharNumber;
let passportNumber;
//
let application;

module.exports = require('express').Router().post('/',async(req,res) =>
{
    try
    {
        let reqData = commonFunction.trimSpaces(req.body);
        let authData = reqData.authData;
        
        if(reqData.application != undefined && reqData.studentName != undefined && reqData.gender != undefined && reqData.nationality != undefined && reqData.dob != undefined && reqData.aadharNumber != undefined && reqData.passportNumber != undefined)
        {
            if(reqData.application.uuid != "" && reqData.studentName != "" && reqData.gender.id != "" && reqData.nationality != "" && reqData.dob != "" && reqData.aadharNumber != "")
            {
                applicationUUID = reqData.application.uuid;
                studentName = reqData.studentName;
                genderId = commonFunction.validateNumber(reqData.gender.id);
                nationality = reqData.nationality;
                dob = reqData.dob;
                aadharNumber = reqData.aadharNumber;
                passportNumber = reqData.passportNumber;
                
                application = await dbAdmission.checkValidApplicationForm(applicationUUID, '', '');
                if(application.length == 0)
                {
                    res.status(500)
                    return res.json({
                        "status_code" : 500,
                        "message" : "Invalid Application Form",
                        "success" : false,
                        "error" : errorCode.getStatus(500)
                    });
                }   

                let studentAadhar = await dbAdmission.checkDuplicateStudentAadhar(application[0].id,aadharNumber);
                if(studentAadhar.length > 0)
                {
                    res.status(500)
                    return res.json({
                        "status_code" : 500,
                        "message" : "Duplicate Aadhar Number",
                        "success" : false,
                        "error" : errorCode.getStatus(500)
                    });
                }  
                
                if(!commonFunction.isValidDate(dob))
                {
                    res.status(500)
                    return res.json({
                        "status_code" : 500,
                        "message" : "Invalid Birth Date",
                        "success" : false,
                        "error" : errorCode.getStatus(500)
                    });
                }

                //update student profile
                let updateJSON = {
                    "applicationId" : application[0].id,
                    "studentName" : studentName,
                    "genderId" : genderId,
                    "nationality" : nationality,
                    "dob" : dob,
                    "aadharNumber" : aadharNumber,
                    "passportNumber" : passportNumber,
                    "updatedById" : authData.id
                }
                let updateStudentProfileResult = await dbAdmission.updateStudentProfile(updateJSON);
                if(updateStudentProfileResult.affectedRows > 0)
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
                        "message" : "Student Profile Not Saved",
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
            "error" : e?.stack
        });
    }
});
