const commonFunction = require('../util/commonFunctions.js');
let dbCommon = require('../sqlmap/commonQuery.js');
let dbAdmission = require('../sqlmap/admissionQuery.js');
let errorCodes = require('../util/errorCodes.js');
let errorCode = new errorCodes();
//Variables 
let applicationUUID;
let dob;
let nationality;
let aadharNumber;
let passportNumber;
let parentAddress;
let parentCountryId;
let parentStateId;
let parentDistrictId;
let parentCityId;
let parentAadharNumber;
let parentPassportNumber;
let parentPanNumber;
let studentUndergone;
let formalSchoolName;
let formalSchoolAddress;
let formalCountryId;
let formalStateId;
let formalDistrictId;
let formalCityId;
let formalSyllabusId;
let formalGradeId;
let formalMedium;
let formalLastAcademicYear;
let declarationCorrect;
//
let applicationForm;
let parent;
let syllabus;
let grade;
let student;
let applicationStatus;

module.exports = require('express').Router().post('/',async(req,res) =>
{
    try
    {
        let reqData = commonFunction.trimSpaces(req.body);
        let authData = reqData.authData;
        
        if(reqData.application != undefined && reqData.dob != undefined && reqData.nationality != undefined && reqData.aadharNumber != undefined && reqData.passportNumber != undefined && reqData.parentAddress != undefined && reqData.parentCountry != undefined && reqData.parentState != undefined && reqData.parentDistrict != undefined && reqData.parentCity != undefined && reqData.parentAadharNumber != undefined && reqData.parentPassportNumber != undefined && reqData.parentPanNumber != undefined && reqData.studentUndergone != undefined && reqData.formalSchoolName != undefined && reqData.formalSchoolAddress != undefined && reqData.formalCountry != undefined && reqData.formalState != undefined && reqData.formalDistrict != undefined && reqData.formalCity != undefined && reqData.formalSyllabus != undefined && reqData.formalGrade != undefined && reqData.formalMedium != undefined && reqData.formalLastAcademicYear != undefined && reqData.declarationCorrect != undefined)
        {
            if(reqData.application.uuid != "" && reqData.dob != "" && reqData.nationality != "" && reqData.aadharNumber != "" && reqData.parentAddress != "" && reqData.parentCountry != "" && reqData.parentState != "" && reqData.parentDistrict != "" && reqData.parentCity != "" && reqData.parentAadharNumber != "" && reqData.studentUndergone != "" && reqData.declarationCorrect != "")
            {
                applicationUUID = reqData.application.uuid;
                dob = reqData.dob;
                nationality = reqData.nationality;
                aadharNumber = reqData.aadharNumber;
                passportNumber = reqData.passportNumber;
                parentAddress = reqData.parentAddress;
                parentCountryId = commonFunction.validateNumber(reqData.parentCountry.id);
                parentStateId = commonFunction.validateNumber(reqData.parentState.id);
                parentDistrictId = commonFunction.validateNumber(reqData.parentDistrict.id);
                parentCityId = commonFunction.validateNumber(reqData.parentCity.id);
                parentAadharNumber = reqData.parentAadharNumber;
                parentPassportNumber = reqData.parentPassportNumber;
                parentPanNumber = reqData.parentPanNumber;
                studentUndergone = reqData.studentUndergone;
                formalSchoolName = reqData.formalSchoolName;
                formalSchoolAddress = reqData.formalSchoolAddress;
                formalCountryId = reqData.formalCountry.id;
                formalStateId = reqData.formalState.id;
                formalDistrictId = reqData.formalDistrict.id;
                formalCityId = reqData.formalCity.id;
                formalSyllabusId = reqData.formalSyllabus.id;
                formalGradeId = reqData.formalGrade.id;
                formalMedium = reqData.formalMedium;
                formalLastAcademicYear = commonFunction.validateNumber(reqData.formalLastAcademicYear);
                declarationCorrect = commonFunction.validateNumber(reqData.declarationCorrect, 'Yes');
                
                applicationForm = await dbAdmission.checkValidApplicationForm(applicationUUID,'', 'B2B');
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

                if(!commonFunction.isValidDate(dob))
                {
                    res.status(500)
                    return res.json({
                        "status_code" : 500,
                        "message" : "Invalid Date Of Birth",
                        "success" : false,
                        "error" : errorCode.getStatus(500)
                    });
                }
                
                if(formalSyllabusId != "")
                {
                    let getSyllabusUrl = global.adminPortalAPIUrl+"common/getSyllabus/"+formalSyllabusId;
                    syllabus = await commonFunction.getExternalAPI(getSyllabusUrl);                
                    if(!syllabus)
                    {
                        res.status(500)
                        return res.json({
                            "status_code" : 500,
                            "message" : "Invalid Syllabus",
                            "success" : false,
                            "error" : errorCode.getStatus(500)
                        });
                    }
                }

                if(formalGradeId != "")
                {
                    let getGradeUrl = global.adminPortalAPIUrl+"common/getGrade/"+formalGradeId;
                    grade = await commonFunction.getExternalAPI(getGradeUrl);                
                    if(!grade)
                    {
                        res.status(500)
                        return res.json({
                            "status_code" : 500,
                            "message" : "Invalid Grade",
                            "success" : false,
                            "error" : errorCode.getStatus(500)
                        });
                    }
                }

                parent = await dbAdmission.checkDuplicateParentAadhar(applicationForm[0].parentId,parentAadharNumber);
                if(parent.length > 0)
                {
                    res.status(500)
                    return res.json({
                        "status_code" : 500,
                        "message" : "Duplicate Parent Aadhar Number",
                        "success" : false,
                        "error" : errorCode.getStatus(500)
                    });
                }

                student = await dbAdmission.checkDuplicateStudentAadhar(applicationForm[0].id,aadharNumber);
                if(student.length > 0)
                {
                    res.status(500)
                    return res.json({
                        "status_code" : 500,
                        "message" : "Duplicate Student Aadhar Number",
                        "success" : false,
                        "error" : errorCode.getStatus(500)
                    });
                }
                
                applicationStatus = await dbAdmission.getApplicationFormStatus('Submitted', '');
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
                let updateJSON = {
                    "applicationFormId" : applicationForm[0].id,
                    "dob" : dob,
                    "nationality" : nationality,
                    "aadharNumber" : aadharNumber,
                    "passportNumber" : passportNumber,
                    "parentId" : applicationForm[0].parentId,
                    "parentAddress" : parentAddress,
                    "parentCountryId" : parentCountryId,
                    "parentStateId" : parentStateId,
                    "parentDistrictId" : parentDistrictId,
                    "parentCityId" : parentCityId,
                    "parentAadharNumber" : parentAadharNumber,
                    "parentPassportNumber" : parentPassportNumber,
                    "parentPanNumber" : parentPanNumber,
                    "studentUndergone" : studentUndergone,
                    "formalSchoolName" : formalSchoolName,
                    "formalSchoolAddress" : formalSchoolAddress,
                    "formalCountryId" : formalCountryId,
                    "formalStateId" : formalStateId,
                    "formalDistrictId" : formalDistrictId,
                    "formalCityId" : formalCityId,
                    "formalSyllabusId" : formalSyllabusId,
                    "formalGradeId" : formalGradeId,
                    "formalMedium" : formalMedium,
                    "formalLastAcademicYear" : formalLastAcademicYear,
                    "declarationCorrect" : declarationCorrect,
                    "createdById" : authData.id,
                    "applicationStatusId" : applicationStatus[0].id
                }                
            
                let updateApplicationResult = await dbAdmission.updateB2BApplicationForm2(updateJSON);
                
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
                    res.status(500)
                    return res.json({
                        "status_code" : 500,
                        "message" : "Application Form Not Submitted",
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