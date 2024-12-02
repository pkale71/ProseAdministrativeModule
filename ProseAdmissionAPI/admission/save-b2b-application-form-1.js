const commonFunction = require('../util/commonFunctions.js');
let dbCommon = require('../sqlmap/commonQuery.js');
let dbAdmission = require('../sqlmap/admissionQuery.js');
let genUUID = require('uuid');
let errorCodes = require('../util/errorCodes.js');
let errorCode = new errorCodes();
//Variables 
let applicationTypeId;
let schoolUUID;
let schoolingProgramId;
let academicSessionId;
let batchYearId;
let siblingTypeId;
let lastAcademicSessionId;
let lastYearEnrollmentUUID;
let currentAcademicSessionId;
let currentYearApplicationUUID;
let studentName;
let parentId;
let parentName;
let parentEmail;
let parentMobile;
let genderId;
let studentRelationship;
let syllabusId;
let gradeCategoryId;
let gradeId;
let subjectGroupId;
let batchTypeId;
let studentProfileCompletionId;
let parentUndertakingId;
let admissionDate;
let studyCenterUUID;
let leadStudentTypeId;
let marketLeadTypeId;
let walkInModeId;
let subjectIds;
let engagementDate;
let businessPartnerUUID;
let coachUUID;
//
let applicationType;
let school;
let schoolingProgram;
let academicSession;
let batchYear;
let siblingType;
let lastAcademicSession;
let lastYearEnrollment;
let currentAcademicSession;
let currentYearApplication;
let parent;
let gender;
let syllabus;
let gradeCategory;
let grade;
let subjectGroup;
let batchType;
let studentProfileCompletion;
let parentUndertaking;
let studyCenter;
let leadStudentType;
let marketLeadType;
let walkInMode;
let subjects;
let applicationForm;
let businessPartner;
let coach;
let applicationStatus;

module.exports = require('express').Router().post('/',async(req,res) =>
{
    try
    {
        let reqData = commonFunction.trimSpaces(req.body);
        let authData = reqData.authData;
        
        if(reqData.applicationType != undefined && reqData.school != undefined && reqData.schoolingProgram != undefined && reqData.academicSession != undefined && reqData.batchYear != undefined && reqData.siblingType != undefined && reqData.lastAcademicSession != undefined && reqData.lastYearEnrollment != undefined && reqData.currentAcademicSession != undefined && reqData.currentYearApplication != undefined && reqData.studentName != undefined && reqData.parentName != undefined && reqData.parentEmail != undefined && reqData.parentMobile != undefined && reqData.gender != undefined && reqData.studentRelationship != undefined && reqData.syllabus != undefined && reqData.gradeCategory != undefined && reqData.grade != undefined && reqData.subjectGroup != undefined && reqData.batchType != undefined && reqData.studentProfileCompletion != undefined && reqData.parentUndertaking != undefined && reqData.admissionDate != undefined && reqData.studyCenter != undefined && reqData.leadStudentType != undefined && reqData.marketLeadType != undefined && reqData.walkInMode != undefined && reqData.subjectIds != undefined && reqData.businessPartner != undefined && reqData.engagementDate != undefined && reqData.coach != undefined)
        {
            if(reqData.applicationType.id != "" && reqData.school.uuid != "" && reqData.schoolingProgram.id != "" && reqData.academicSession.id != "" && reqData.batchYear.id != "" && reqData.studentName != "" && reqData.parentName != "" && reqData.parentEmail != "" && reqData.parentMobile != "" && reqData.gender.id != "" && reqData.studentRelationship != "" && reqData.syllabus.id != "" && reqData.gradeCategory.id != "" && reqData.grade.id != "" && reqData.subjectGroup.id != "" && reqData.batchType.id != "" && reqData.studentProfileCompletion.id != "" && reqData.parentUndertaking.id != "" && reqData.admissionDate != "" && reqData.studyCenter.uuid != "" && reqData.leadStudentType.id != "" && reqData.marketLeadType.id != "" && reqData.subjectIds != "" && reqData.businessPartner.uuid != "" && reqData.engagementDate != "")
            {
                applicationTypeId = commonFunction.validateNumber(reqData.applicationType.id);
                schoolUUID = reqData.school.uuid;
                schoolingProgramId = commonFunction.validateNumber(reqData.schoolingProgram.id);
                academicSessionId = commonFunction.validateNumber(reqData.academicSession.id);
                batchYearId = commonFunction.validateNumber(reqData.batchYear.id);
                siblingTypeId = commonFunction.validateNumber(reqData.siblingType.id);
                lastAcademicSessionId = commonFunction.validateNumber(reqData.lastAcademicSession.id);
                lastYearEnrollmentUUID = reqData.lastYearEnrollment.uuid;
                currentAcademicSessionId = commonFunction.validateNumber(reqData.currentAcademicSession.id);
                currentYearApplicationUUID = reqData.currentYearApplication.uuid;
                studentName = reqData.studentName;
                parentName = reqData.parentName;
                parentEmail = reqData.parentEmail;
                parentMobile = reqData.parentMobile;
                genderId = commonFunction.validateNumber(reqData.gender.id);
                studentRelationship = reqData.studentRelationship;
                syllabusId = commonFunction.validateNumber(reqData.syllabus.id);
                gradeCategoryId = commonFunction.validateNumber(reqData.gradeCategory.id);
                gradeId = commonFunction.validateNumber(reqData.grade.id);
                subjectGroupId = commonFunction.validateNumber(reqData.subjectGroup.id);
                batchTypeId = commonFunction.validateNumber(reqData.batchType.id);
                studentProfileCompletionId = commonFunction.validateNumber(reqData.studentProfileCompletion.id);
                parentUndertakingId = commonFunction.validateNumber(reqData.parentUndertaking.id);
                admissionDate = reqData.admissionDate;
                studyCenterUUID = reqData.studyCenter.uuid;
                leadStudentTypeId = commonFunction.validateNumber(reqData.leadStudentType.id);
                marketLeadTypeId = commonFunction.validateNumber(reqData.marketLeadType.id);
                walkInModeId = commonFunction.validateNumber(reqData.walkInMode.id);
                subjectIds = reqData.subjectIds;
                businessPartnerUUID = reqData.businessPartner.uuid;
                engagementDate = reqData.engagementDate;
                coachUUID = reqData.coach.uuid;
                
                if(!commonFunction.isValidDate(admissionDate))
                {
                    res.status(500)
                    return res.json({
                        "status_code" : 500,
                        "message" : "Invalid Admission Date",
                        "success" : false,
                        "error" : errorCode.getStatus(500)
                    });
                }
                if(!commonFunction.isValidDate(engagementDate))
                {
                    res.status(500)
                    return res.json({
                        "status_code" : 500,
                        "message" : "Invalid Engagement Date",
                        "success" : false,
                        "error" : errorCode.getStatus(500)
                    });
                }

                applicationType = await dbAdmission.getApplicationType(applicationTypeId);
                if(applicationType.length == 0)
                {
                    res.status(500)
                    return res.json({
                        "status_code" : 500,
                        "message" : "Invalid Application Type",
                        "success" : false,
                        "error" : errorCode.getStatus(500)
                    });
                }

                let getBusinessPartnerUrl = global.adminPortalAPIUrl+"business/getBusinessPartner/"+businessPartnerUUID;
                businessPartner = await commonFunction.getExternalAPI(getBusinessPartnerUrl);      
                if(!businessPartner)
                {
                    res.status(500)
                    return res.json({
                        "status_code" : 500,
                        "message" : "Invalid Business Partner",
                        "success" : false,
                        "error" : errorCode.getStatus(500)
                    });
                }
                
                if(coachUUID != "")
                {
                    let getCoachUrl = global.adminPortalAPIUrl+"business/getCoach/"+coachUUID;
                    coach = await commonFunction.getExternalAPI(getCoachUrl);      
                    if(!coach)
                    {
                        res.status(500)
                        return res.json({
                            "status_code" : 500,
                            "message" : "Invalid Coach",
                            "success" : false,
                            "error" : errorCode.getStatus(500)
                        });
                    }
                }
                let getSchoolUrl = global.adminPortalAPIUrl+"business/getSchool/"+schoolUUID;
                school = await commonFunction.getExternalAPI(getSchoolUrl);      
                if(!school)
                {
                    res.status(500)
                    return res.json({
                        "status_code" : 500,
                        "message" : "Invalid School",
                        "success" : false,
                        "error" : errorCode.getStatus(500)
                    });
                }

                let getSchoolingProgramUrl = global.adminPortalAPIUrl+"common/getSchoolingProgram/"+schoolingProgramId;
                schoolingProgram = await commonFunction.getExternalAPI(getSchoolingProgramUrl);                
                if(!schoolingProgram)
                {
                    res.status(500)
                    return res.json({
                        "status_code" : 500,
                        "message" : "Invalid Schooling Program",
                        "success" : false,
                        "error" : errorCode.getStatus(500)
                    });
                }

                let getAcademicSessionUrl = global.adminPortalAPIUrl+"common/getAcademicSession/"+academicSessionId;
                academicSession = await commonFunction.getExternalAPI(getAcademicSessionUrl);                
                if(!academicSession)
                {
                    res.status(500)
                    return res.json({
                        "status_code" : 500,
                        "message" : "Invalid Academic Session",
                        "success" : false,
                        "error" : errorCode.getStatus(500)
                    });
                }

                let getBatchYearUrl = global.adminPortalAPIUrl+"common/getAcademicSession/"+batchYearId;
                batchYear = await commonFunction.getExternalAPI(getBatchYearUrl);                
                if(!batchYear)
                {
                    res.status(500)
                    return res.json({
                        "status_code" : 500,
                        "message" : "Invalid Batch Year",
                        "success" : false,
                        "error" : errorCode.getStatus(500)
                    });
                }

                if(siblingTypeId != "")
                {
                    siblingType = await dbAdmission.getSiblingType(siblingTypeId);
                    if(siblingType.length == 0)
                    {
                        res.status(500)
                        return res.json({
                            "status_code" : 500,
                            "message" : "Invalid Sibling Type",
                            "success" : false,
                            "error" : errorCode.getStatus(500)
                        });
                    }
                }

                if(lastAcademicSessionId != "")
                {
                    let getLastAcademicSessionUrl = global.adminPortalAPIUrl+"common/getAcademicSession/"+lastAcademicSessionId;
                    lastAcademicSession = await commonFunction.getExternalAPI(getLastAcademicSessionUrl);                
                    if(!lastAcademicSession)
                    {
                        res.status(500)
                        return res.json({
                            "status_code" : 500,
                            "message" : "Invalid Last Academic Session",
                            "success" : false,
                            "error" : errorCode.getStatus(500)
                        });
                    }
                }

                if(lastYearEnrollmentUUID != "")
                {
                    lastYearEnrollment = await dbAdmission.checkValidApplicationForm(lastYearEnrollmentUUID,'','');
                    if(lastYearEnrollment.length == 0)
                    {
                        res.status(500)
                        return res.json({
                            "status_code" : 500,
                            "message" : "Invalid Last Year Enrollment",
                            "success" : false,
                            "error" : errorCode.getStatus(500)
                        });
                    }
                }

                if(currentAcademicSessionId != "")
                {
                    let getCurrentAcademicSessionUrl = global.adminPortalAPIUrl+"common/getAcademicSession/"+currentAcademicSessionId;
                    currentAcademicSession = await commonFunction.getExternalAPI(getCurrentAcademicSessionUrl);                
                    if(!currentAcademicSession)
                    {
                        res.status(500)
                        return res.json({
                            "status_code" : 500,
                            "message" : "Invalid Current Academic Session",
                            "success" : false,
                            "error" : errorCode.getStatus(500)
                        });
                    }
                }

                if(currentYearApplicationUUID != "")
                {
                    currentYearApplication = await dbAdmission.checkValidApplicationForm(currentYearApplicationUUID,'','');
                    if(currentYearApplication.length == 0)
                    {
                        res.status(500)
                        return res.json({
                            "status_code" : 500,
                            "message" : "Invalid Current Year Application",
                            "success" : false,
                            "error" : errorCode.getStatus(500)
                        });
                    }
                }

                //check duplicate parent
                parent = await dbAdmission.checkDuplicateParentEmailMobile(parentEmail, 'Email');
                if(parent.length == 0)
                {
                    parent = await dbAdmission.checkDuplicateParentEmailMobile(parentMobile, 'Mobile');
                    if(parent.length == 1)
                    {
                        parentId = parent[0].id;
                    }
                }    
                else
                {
                    parentId = parent[0].id;
                }
                
                gender = await dbAdmission.getGender(genderId);
                if(gender.length == 0)
                {
                    res.status(500)
                    return res.json({
                        "status_code" : 500,
                        "message" : "Invalid Gender",
                        "success" : false,
                        "error" : errorCode.getStatus(500)
                    });
                }

                let getSyllabusUrl = global.adminPortalAPIUrl+"common/getSyllabus/"+syllabusId;
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

                let getGradeCategoryUrl = global.adminPortalAPIUrl+"common/getGradeCategory/"+gradeCategoryId;
                gradeCategory = await commonFunction.getExternalAPI(getGradeCategoryUrl);                
                if(!gradeCategory)
                {
                    res.status(500)
                    return res.json({
                        "status_code" : 500,
                        "message" : "Invalid Grade Category",
                        "success" : false,
                        "error" : errorCode.getStatus(500)
                    });
                }

                let getGradeUrl = global.adminPortalAPIUrl+"common/getGrade/"+gradeId;
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

                subjectGroup = await dbCommon.getSubjectGroup(subjectGroupId);
                if(subjectGroup.length == 0)
                {
                    res.status(500)
                    return res.json({
                        "status_code" : 500,
                        "message" : "Invalid Subject Group",
                        "success" : false,
                        "error" : errorCode.getStatus(500)
                    });
                }

                let tempSubjectIds = subjectIds.toString().split(",");
                let getSubjectUrl = global.adminPortalAPIUrl+"common/getSubjectByIds/"+subjectIds;
                subjects = await commonFunction.getExternalAPI(getSubjectUrl); 
                if(subjects)
                {
                    if(tempSubjectIds.length != subjects.length)
                    {
                        res.status(500)
                        return res.json({
                            "status_code" : 500,
                            "message" : "Some Subjects Are Invalid",
                            "success" : false,
                            "error" : errorCode.getStatus(500)
                        });
                    }
                    else
                    {
                        const filteredData = {
                            subjectIds: subjects.map(item => ({ id: item.id }))
                        };
                        subjects = filteredData.subjectIds;
                    }
                }
                else
                {
                    res.status(500)
                    return res.json({
                        "status_code" : 500,
                        "message" : "Some Subjects Are Invalid",
                        "success" : false,
                        "error" : errorCode.getStatus(500)
                    });
                }

                let getBatchTypeUrl = global.adminPortalAPIUrl+"common/getBatchType/"+batchTypeId;
                batchType = await commonFunction.getExternalAPI(getBatchTypeUrl);                
                if(!batchType)
                {
                    res.status(500)
                    return res.json({
                        "status_code" : 500,
                        "message" : "Invalid Grade",
                        "success" : false,
                        "error" : errorCode.getStatus(500)
                    });
                }
                
                studentProfileCompletion = await dbAdmission.getStudentProfileCompletion(studentProfileCompletionId);
                if(studentProfileCompletion.length == 0)
                {
                    res.status(500)
                    return res.json({
                        "status_code" : 500,
                        "message" : "Invalid Student Profile Completion",
                        "success" : false,
                        "error" : errorCode.getStatus(500)
                    });
                }

                parentUndertaking = await dbAdmission.getParentUndertaking(studentProfileCompletionId, parentUndertakingId);
                if(parentUndertaking.length == 0)
                {
                    res.status(500)
                    return res.json({
                        "status_code" : 500,
                        "message" : "Invalid Parent Undertaking For Student Profile Completion",
                        "success" : false,
                        "error" : errorCode.getStatus(500)
                    });
                }

                let getStudyCenterUrl = global.adminPortalAPIUrl+"business/getStudyCenter/"+studyCenterUUID;
                studyCenter = await commonFunction.getExternalAPI(getStudyCenterUrl);                
                if(!studyCenter)
                {
                    res.status(500)
                    return res.json({
                        "status_code" : 500,
                        "message" : "Invalid Study Center",
                        "success" : false,
                        "error" : errorCode.getStatus(500)
                    });
                }

                leadStudentType = await dbAdmission.getLeadStudentType(leadStudentTypeId);
                if(leadStudentType.length == 0)
                {
                    res.status(500)
                    return res.json({
                        "status_code" : 500,
                        "message" : "Invalid Lead Student Type",
                        "success" : false,
                        "error" : errorCode.getStatus(500)
                    });
                }

                marketLeadType = await dbAdmission.getMarketLeadType(marketLeadTypeId);
                if(marketLeadType.length == 0)
                {
                    res.status(500)
                    return res.json({
                        "status_code" : 500,
                        "message" : "Invalid Market Lead Type",
                        "success" : false,
                        "error" : errorCode.getStatus(500)
                    });
                }

                if(walkInModeId != "")
                {
                    walkInMode = await dbAdmission.getWalkInMode(walkInModeId);
                    if(walkInMode.length == 0)
                    {
                        res.status(500)
                        return res.json({
                            "status_code" : 500,
                            "message" : "Invalid Walk-In Mode",
                            "success" : false,
                            "error" : errorCode.getStatus(500)
                        });
                    }
                }

                applicationStatus = await dbAdmission.getApplicationFormStatus('Registered', '');
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

                let applicationNumber = "PE/"+academicSession.year+"/";
                let parentUndertakingCode = "";
                if(studentProfileCompletion[0].name == 'Parent')
                {
                    parentUndertakingCode = commonFunction.ramdomString(11);
                }

                applicationForm = await dbAdmission.duplicateApplicationForm(applicationType, studentName, parentId);
                if(applicationForm.length == 0)
                {
                    //insert Application Form
                    let insertJSON = {
                        "uuid" : genUUID.v1(),
                        "parentUndertakingCode" : parentUndertakingCode,
                        "applicationNumber" : applicationNumber,
                        "applicationTypeId" : applicationTypeId,
                        "schoolId" : school.id,
                        "schoolingProgramId" : schoolingProgramId,
                        "academicSessionId" : academicSessionId,
                        "batchYearId" : batchTypeId,
                        "applicationFor" : "B2B",
                        "siblingTypeId" : siblingType?.length ? siblingType[0].id : "",
                        "lastAcademicSessionId" : lastAcademicSession ? lastAcademicSession.id : "",
                        "lastYearEnrollmentId" : lastYearEnrollment?.length > 0 ? lastYearEnrollment[0].id : "",
                        "currentAcademicSessionId" : currentAcademicSession ? currentAcademicSession.id : "",
                        "currentYearApplicationId" : currentYearApplication?.length > 0 ? currentYearApplication[0].id : "",
                        "studentName" : studentName,
                        "parentId" : parentId != null ? parentId : "",
                        "parentName" : parentName,
                        "parentEmail" : parentEmail,
                        "parentMobile" : parentMobile,
                        "genderId" : genderId,
                        "studentRelationship" : studentRelationship,
                        "syllabusId" : syllabusId,
                        "gradeCategoryId" : gradeCategoryId,
                        "gradeId" : gradeId,
                        "subjectGroupId" : subjectGroupId,
                        "batchTypeId" : batchTypeId,
                        "studentProfileCompletionId" : studentProfileCompletionId,
                        "parentUndertakingId" : parentUndertakingId,
                        "admissionDate" : admissionDate,
                        "studyCenterId" : studyCenter.id,
                        "leadStudentTypeId" : leadStudentTypeId,
                        "marketLeadTypeId" : marketLeadTypeId,
                        "walkInModeId" : walkInModeId,
                        "subjectIds" : subjects,
                        "businessPartnerId" : businessPartner.id,
                        "engagementDate" : engagementDate,
                        "coachId" : coach ? coach.id : "",
                        "createdById" : authData.id,
                        "applicationStatusId" : applicationStatus[0].id
                    }
                    
                    let insertApplicationResult = await dbAdmission.insertB2BApplicationForm1(insertJSON);
                    let insertApplicationId = insertApplicationResult.insertId;
        
                    if(parseInt(insertApplicationId) > 0)
                    {
                        res.status(200)
                        return res.json({
                            "uuid" : insertJSON.uuid,
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
                            "message" : "Application Form Not Saved",
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
                        "message" : "Application Form Exist For Same Student Name And Parent Name",
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
