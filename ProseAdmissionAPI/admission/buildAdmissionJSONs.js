const buildCommonJSON = {};
const commonFunction = require('../util/commonFunctions.js');

buildCommonJSON.paymentMethod = function(datas)
{
    let resultJSON = [];

    datas.forEach((data) => 
    { 
        //Final JSON
        let finalJSON = {
            "id" : data.id,
            "name" : data.name
        }
        resultJSON.push(finalJSON);
    });

    return resultJSON;
}

buildCommonJSON.applicationType = function(datas)
{
    let resultJSON = [];

    datas.forEach((data) => 
    { 
        //Final JSON
        let finalJSON = {
            "id" : data.id,
            "name" : data.name
        }
        resultJSON.push(finalJSON);
    });

    return resultJSON;
}

buildCommonJSON.applicationStatus = function(datas)
{
    let resultJSON = [];

    datas.forEach((data) => 
    { 
        //Final JSON
        let finalJSON = {
            "id" : data.id,
            "name" : data.name
        }
        resultJSON.push(finalJSON);
    });

    return resultJSON;
}

buildCommonJSON.gender = function(datas)
{
    let resultJSON = [];

    datas.forEach((data) => 
    { 
        //Final JSON
        let finalJSON = {
            "id" : data.id,
            "name" : data.name
        }
        resultJSON.push(finalJSON);
    });

    return resultJSON;
}

buildCommonJSON.leadStudentType = function(datas)
{
    let resultJSON = [];

    datas.forEach((data) => 
    { 
        //Final JSON
        let finalJSON = {
            "id" : data.id,
            "name" : data.name
        }
        resultJSON.push(finalJSON);
    });

    return resultJSON;
}

buildCommonJSON.marketLeadType = function(datas)
{
    let resultJSON = [];

    datas.forEach((data) => 
    { 
        //Final JSON
        let finalJSON = {
            "id" : data.id,
            "name" : data.name
        }
        resultJSON.push(finalJSON);
    });

    return resultJSON;
}

buildCommonJSON.walkInMode = function(datas)
{
    let resultJSON = [];

    datas.forEach((data) => 
    { 
        //Final JSON
        let finalJSON = {
            "id" : data.id,
            "name" : data.name
        }
        resultJSON.push(finalJSON);
    });

    return resultJSON;
}

buildCommonJSON.siblingType = function(datas)
{
    let resultJSON = [];

    datas.forEach((data) => 
    { 
        //Final JSON
        let finalJSON = {
            "id" : data.id,
            "name" : data.name
        }
        resultJSON.push(finalJSON);
    });

    return resultJSON;
}

buildCommonJSON.studentProfileCompletion = function(datas)
{
    let resultJSON = [];

    datas.forEach((data) => 
    { 
        //Final JSON
        let finalJSON = {
            "id" : data.id,
            "name" : data.name
        }
        resultJSON.push(finalJSON);
    });

    return resultJSON;
}

buildCommonJSON.parentUndertaking = function(datas)
{
    let resultJSON = [];

    datas.forEach((data) => 
    { 
        //Final JSON
        let finalJSON = {
            "id" : data.id,
            "name" : data.name
        }
        resultJSON.push(finalJSON);
    });

    return resultJSON;
}

buildCommonJSON.applicationForms = function(datas, action = 1)
{
    let resultJSON = [];
    let applicationTypeJSON = [];
    let siblingTypeJSON = [];
    let applicationStatusJSON = [];
    let parentJSON = [];

    datas.forEach((data) => 
    { 
        applicationTypeJSON = [];
        siblingTypeJSON = [];
        applicationStatusJSON = [];
        parentJSON = [];
                
        applicationTypeJSON = {
            "id" : data.applicationTypeId,
            "name" : data.applicationTypeName
        };
        siblingTypeJSON = {
            "id" : data.siblingTypeId,
            "name" : data.siblingTypeName
        };
        parentJSON = {
            "id" : data.parentId,
            "name" : data.parentName,
            "mobile" : data.parentMobile,
            "email" : data.parentEmail
        };
        applicationStatusJSON = {
            "id" : data.applicationStatusId,
            "name" : data.applicationStatusName
        };
        //Final JSON
        let finalJSON = {
            "id" : data.id,
            "uuid" : data.uuid,
            "applicationNumber" : data.applicationNumber,
            "enrollmentNumber" : data.enrollmentNumber || "",
            "admissionDate" : commonFunction.getFormattedDate(data.admissionDate, "yyyy-mm-dd"),
            "studentName" : data.studentName,
            "parent" : parentJSON,
            "profileCompletion" : {"id" : data.profileCompletionId, "name" : data.profileCompletionName},
            "grade" : {"id" : data.gradeId, "name" : data.gradeName},
            "applicationType" : applicationTypeJSON,
            "siblingType" : siblingTypeJSON,
            "applicationStatus" : applicationStatusJSON
        }
        if(action == 1)
        {
            resultJSON.push(finalJSON);
        }
        else
        {
            resultJSON = finalJSON;
        }
    });

    return resultJSON;
}

buildCommonJSON.studentProfile = function(datas)
{
    let resultJSON = [];
    let genderJSON = [];
    let academicSessionJSON = [];
    let schoolJSON = [];
    let schoolingProgramJSON = [];
    let applicationTypeJSON = [];
    let siblingTypeJSON = [];
    let syllabusJSON = [];
    let gradeCategoryJSON = [];
    let gradeJSON = [];
    let profileCompletionJSON = [];
    let parentUndertakingJSON = [];
    let leadStudentTypeJSON = [];
    let marketLeadTypeJSON = [];
    let walkinModeJSON = [];
    let lastAcademicSessionJSON = [];
    let lastEnrollmentJSON = [];
    let currentAcademicSessionJSON = [];
    let currentApplicationJSON = [];
    let studyCenterJSON = [];
    let tieupSchoolJSON = [];
    let applicationStatusJSON = [];

    datas.forEach((data) => 
    { 
        genderJSON = [];
        academicSessionJSON = [];
        schoolJSON = [];
        schoolingProgramJSON = [];
        applicationTypeJSON = [];
        siblingTypeJSON = [];
        syllabusJSON = [];
        gradeCategoryJSON = [];
        gradeJSON = [];
        profileCompletionJSON = [];
        parentUndertakingJSON = [];
        leadStudentTypeJSON = [];
        marketLeadTypeJSON = [];
        walkinModeJSON = [];
        lastAcademicSessionJSON = [];
        lastEnrollmentJSON = [];
        currentAcademicSessionJSON = [];
        currentApplicationJSON = [];
        studyCenterJSON = [];
        tieupSchoolJSON = [];
        applicationStatusJSON = [];
                
        genderJSON = {
            "id" : data.genderId,
            "name" : data.genderName
        };
        academicSessionJSON = {
            "id" : data.academicSessionId,
            "year" : data.academicSessionYear,
            "batchYear" : data.batchYear
        };
        schoolJSON = {
            "uuid" : data.schoolUUID,
            "name" : data.schoolName
        };
        schoolingProgramJSON = {
            "id" : data.schoolingProgramId,
            "name" : data.schoolingProgramName
        };
        applicationTypeJSON = {
            "id" : data.applicationTypeId,
            "name" : data.applicationTypeName
        };
        siblingTypeJSON = {
            "id" : data.siblingTypeId,
            "name" : data.siblingTypeName
        };
        syllabusJSON = {
            "id" : data.syllabusId,
            "name" : data.syllabusName
        };
        gradeCategoryJSON = {
            "id" : data.gradeCategoryId,
            "name" : data.gradeCategoryName
        };
        gradeJSON = {
            "id" : data.gradeId,
            "name" : data.gradeName
        };
        profileCompletionJSON = {
            "id" : data.profileCompletionId,
            "name" : data.profileCompletionName
        };
        parentUndertakingJSON = {
            "id" : data.parentUndertakingId,
            "name" : data.parentUndertakingName
        };
        leadStudentTypeJSON = {
            "id" : data.leadStudentTypeId,
            "name" : data.leadStudentTypeName
        };
        marketLeadTypeJSON = {
            "id" : data.marketLeadTypeId,
            "name" : data.marketLeadTypeName
        };
        walkinModeJSON = {
            "id" : data.walkinModeId,
            "name" : data.walkinModeName
        };
        lastAcademicSessionJSON = {
            "id" : data.lAcademicSessionId,
            "year" : data.lAcademicSessionYear,
            "batchYear" : data.lBatchYear
        };
        lastEnrollmentJSON = {
            "uuid" : data.lEnrollmentUUID,
            "enrollmentNumber" : data.lEnrollmentNumber,
            "studentName" : data.lStudentName
        };
        currentAcademicSessionJSON = {
            "id" : data.cAcademicSessionId,
            "year" : data.cAcademicSessionYear,
            "batchYear" : data.cBatchYear
        };
        currentApplicationJSON = {
            "uuid" : data.cAppplicationUUID,
            "applicationNumber" : data.cApplicationNumber,
            "studentName" : data.cStudentName
        };
        studyCenterJSON = {
            "uuid" : data.studyCenterUUID,
            "name" : data.studyCenterName
        };
        tieupSchoolJSON = {
            "uuid" : data.tieupSchoolUUID,
            "name" : data.tieupSchoolName
        };
        applicationStatusJSON = {
            "id" : data.applicationStatusId,
            "name" : data.applicationStatusName
        };
        //Final JSON
        let finalJSON = {
            "uuid" : data.uuid,
            "applicationNumber" : data.applicationNumber,
            "enrollmentNumber" : data.enrollmentNumber || "",
            "applicationType" : applicationTypeJSON,
            "siblingType" : siblingTypeJSON,
            "admissionDate" : commonFunction.getFormattedDate(data.admissionDate, "yyyy-mm-dd"),
            "studentName" : data.studentName,
            "dob" : commonFunction.getFormattedDate(data.dob, "yyyy-mm-dd"),
            "nationality" : data.nationality || "",
            "aadharNumber" : data.aadharNumber || "",
            "passportNumber" : data.passportNumber || "",
            "gender" : genderJSON,
            "academicSession" : academicSessionJSON,
            "school" : schoolJSON,
            "schoolingProgram" : schoolingProgramJSON,
            "syllabus" : syllabusJSON,
            "gradeCategory" : gradeCategoryJSON,
            "grade" : gradeJSON,
            "profileCompletion" : profileCompletionJSON,
            "parentUndertaking" : parentUndertakingJSON,
            "leadStudentType" : leadStudentTypeJSON,
            "marketLeadType" : marketLeadTypeJSON,
            "walkinMode" : walkinModeJSON,
            "lastAcademicSession" : lastAcademicSessionJSON,
            "lastEnrollment" : lastEnrollmentJSON,
            "currentAcademicSession" : currentAcademicSessionJSON,
            "currentApplication" : currentApplicationJSON,
            "studyCenter" : studyCenterJSON,
            "tieupSchool" : tieupSchoolJSON,
            "applicationStatus" : applicationStatusJSON
        }
        resultJSON = finalJSON;
    });

    return resultJSON;
}

buildCommonJSON.parentProfile = function(datas)
{
    let resultJSON = [];
    let countryJSON = [];
    let stateJSON = [];
    let districtJSON = [];
    let cityJSON = [];

    datas.forEach((data) => 
    { 
        countryJSON = [];
        stateJSON = [];
        districtJSON = [];
        cityJSON = [];
                
        countryJSON = {
            "id" : data.parentCountryId,
            "name" : data.parentCountryName
        };
        stateJSON = {
            "id" : data.parentStateId,
            "name" : data.parentStateName
        };
        districtJSON = {
            "id" : data.parentDistrictId,
            "name" : data.parentDistrictName
        };
        cityJSON = {
            "id" : data.parentCityId,
            "name" : data.parentCityName
        };
        
        //Final JSON
        let finalJSON = {
            "id" : data.id,
            "name" : data.parentName,
            "email" : data.parentEmail,
            "mobile" : data.parentMobile,
            "relationship" : data.parentRelationship,
            "aadharNumber" : data.parentAadhanrNumber,
            "panNumber" : data.parentPanNumber || "",
            "passportNumber" : data.parentPassportNumber || "",
            "address" : data.parentAddress,
            "country" : countryJSON,
            "state" : stateJSON,
            "district" : districtJSON,
            "city" : cityJSON
        }
        resultJSON = finalJSON;
    });

    return resultJSON;
}

buildCommonJSON.applicationSubjectGroup = function(datas)
{
    let resultJSON = [];
    let subjectJSON = [];
    let batchTypeJSON = [];

    datas.forEach((data) => 
    { 
        subjectJSON = [];
        batchTypeJSON = [];
                
        batchTypeJSON = {
            "id" : data.batchTypeId,
            "name" : data.batchTypeName,
            "startTime" : data.startTime,
            "endTime" : data.endTime
        };
        let subjectIdArray = (data.subjectIds).toString().split(",");
        let subjectNameArray = (data.subjectNames).toString().split(",");
        let subjectSessionArray = (data.totalSessions).toString().split(",");
        let subjectDurationArray = (data.sessionDurations).toString().split(",");
        let subjectPracticalArray = (data.hasPracticals).toString().split(",");
        let subjectMandatoryArray = (data.isMandatories).toString().split(",");
        let subjectTypeIdArray = (data.subjectTypeIds).toString().split(",");
        let subjectTypeNameArray = (data.subjectTypeNames).toString().split(",");
        for(let i=0;i<subjectIdArray.length;i++)
        {
            subjectJSON.push({
                "id" : subjectIdArray[i],
                "name" : subjectNameArray[i],
                "subjectType" : {"id" : subjectTypeIdArray[i], "name" : subjectTypeNameArray[i]},
                "totalSession" : subjectSessionArray[i],
                "duration" : subjectDurationArray[i],
                "hasPractical" : subjectPracticalArray[i],
                "isMandatory" : subjectMandatoryArray[i]
            });
        }
        //Final JSON
        let finalJSON = {
            "id" : data.id,
            "name" : data.name,
            "batchType" : batchTypeJSON,
            "subjects" : subjectJSON
        }
        resultJSON = finalJSON;
    });

    return resultJSON;
}

buildCommonJSON.applicationSportEngagement = function(datas)
{
    let resultJSON = [];
    let businessPartnerJSON = [];
    let coachJSON = [];
    let otherCountryJSON = [];
    let otherStateJSON = [];
    let otherDistrictJSON = [];
    let otherCityJSON = [];
    let bpCountryJSON = [];
    let bpStateJSON = [];
    let bpDistrictJSON = [];
    let bpCityJSON = [];

    datas.forEach((data) => 
    { 
        businessPartnerJSON = [];
        coachJSON = [];
        otherCountryJSON = [];
        otherStateJSON = [];
        otherDistrictJSON = [];
        otherCityJSON = [];
        bpCountryJSON = [];
        bpStateJSON = [];
        bpDistrictJSON = [];
        bpCityJSON = [];
        
        coachJSON = {
            "uuid" : data.coachUUID,
            "name" : data.coachName
        };

        bpCountryJSON = {
            "id" : data.businessPartnerCountryId,
            "name" : data.businessPartnerCountryName
        };

        bpStateJSON = {
            "id" : data.businessPartnerStateId,
            "name" : data.businessPartnerStateName
        };

        bpDistrictJSON = {
            "id" : data.businessPartnerDistrictId,
            "name" : data.businessPartnerDistrictName
        };

        bpCityJSON = {
            "id" : data.businessPartnerCityId,
            "name" : data.businessPartnerCityName
        };

        businessPartnerJSON = {
            "uuid" : data.businessPartnerUUID,
            "name" : data.businessPartnerName,
            "address" : data.businessPartnerAddress,
            "coach" : coachJSON,
            "country" : bpCountryJSON,
            "state" : bpStateJSON,
            "district" : bpDistrictJSON,
            "city" : bpCityJSON
        };
        
        otherCountryJSON = {
            "id" : data.otherAcademyCountryId,
            "name" : data.otherAcademyCountryName
        };

        otherStateJSON = {
            "id" : data.otherAcademyStateId,
            "name" : data.otherAcademyStateName
        };

        otherDistrictJSON = {
            "id" : data.otherAcademyDistrictId,
            "name" : data.otherAcademyDistrictName
        };

        otherCityJSON = {
            "id" : data.otherAcademyCityId,
            "name" : data.otherAcademyCityName
        };

        //Final JSON
        let finalJSON = {
            "engagementDate" : commonFunction.getFormattedDate(data.engagementDate, "yyyy-mm-dd"),
            "businessPartner" : businessPartnerJSON,
            "otherAcademyName" : data.otherAcademyName || "",
            "otherAcademyAddress" : data.otherAcademyAddress || "",
            "otherAcademyCoach" : data.otherAcademyCoach || "",
            "otherAcademyCountry" : otherCountryJSON,
            "otherAcademyState" : otherStateJSON,
            "otherAcademyDistrict" : otherDistrictJSON,
            "otherAcademyCity" : otherCityJSON
        }
        resultJSON = finalJSON;
    });

    return resultJSON;
}

buildCommonJSON.applicationUndergoneEducation = function(datas)
{
    let resultJSON = [];
    let syllabusJSON = [];
    let gradeJSON = [];
    let formalCountryJSON = [];
    let formalStateJSON = [];
    let formalDistrictJSON = [];
    let formalCityJSON = [];

    datas.forEach((data) => 
    { 
        syllabusJSON = [];
        gradeJSON = [];
        formalCountryJSON = [];
        formalStateJSON = [];
        formalDistrictJSON = [];
        formalCityJSON = [];
        
        gradeJSON = {
            "id" : data.formalGradeId,
            "name" : data.formalGradeName
        };

        syllabusJSON = {
            "id" : data.formalSyllabusId,
            "name" : data.formalSyllabusName
        };

        formalCountryJSON = {
            "id" : data.formalCountryId,
            "name" : data.formalCountryName
        };

        formalStateJSON = {
            "id" : data.formalStateId,
            "name" : data.formalStateName
        };

        formalDistrictJSON = {
            "id" : data.formalDistrictId,
            "name" : data.formalDistrictName
        };

        formalCityJSON = {
            "id" : data.formalCityId,
            "name" : data.formalCityName
        };

        //Final JSON
        let finalJSON = {
            "studentUndergone" : data.studentUndergone,
            "syllabus" : syllabusJSON,
            "grade" : gradeJSON,
            "formalSchoolName" : data.formalSchoolName || "",
            "formalSchoolAddress" : data.formalSchoolAddress || "",
            "formalCountry" : formalCountryJSON,
            "formalState" : formalStateJSON,
            "formalDistrict" : formalDistrictJSON,
            "formalCity" : formalCityJSON
        }
        resultJSON = finalJSON;
    });

    return resultJSON;
}

buildCommonJSON.applicationUndertakingDocument = function(datas)
{
    let resultJSON = [];
    
    datas.forEach((data) => 
    { 
        //Final JSON
        let finalJSON = {
            "undertakingFileName" : data.undertakingFileName || "",
            "undertakingSignFileName" : data.undertakingSignFileName || "",
            "applicationFileName" : data.applicationFileName || "",
        }
        resultJSON = finalJSON;
    });

    return resultJSON;
}

buildCommonJSON.applicationStudentDocuments = function(datas)
{
    let resultJSON = [];
    
    datas.forEach((data) => 
    { 
        //Final JSON
        let finalJSON = {
            "id" : data.id,
            "name" : data.name,
            "fileName" : data.fileName || "",
        }
        resultJSON.push(finalJSON);
    });

    return resultJSON;
}

buildCommonJSON.applicationFeeStructure = function(datas)
{
    let resultJSON = [];
    let feeCategoryJSON = [];
    let feeTypeJSON = [];
    let discountTypeJSON = [];
    let installmentJSON = [];
    let totalJSON = [];
    let r = 0;
    datas.forEach((data) => 
    {
        if(r == 0)
        {
            feeCategoryJSON = {
                "id" : data.feeCategoryId,
                "name" : data.feeCategoryName,
                "totalInstallment" : data.totalInstallment,
                "otherDiscount" : data.otherDiscount
            };
        }
        if(data.unionName == 'Fee Type')
        {
            feeTypeJSON.push({
                "id" : data.feeTypeId,
                "name" : data.feeTypeName,
                "amount" : data.feeTypeAmount
            })
        }
        else if(data.unionName == 'Discount Type')
        {
            discountTypeJSON.push({
                "id" : data.discountTypeId,
                "name" : data.discountTypeName,
                "amount" : data.discountTypeAmount
            })
        }
        else if(data.unionName == 'Installments')
        {
            installmentJSON.push({
                "id" : data.installmentId,
                "name" : data.installmentName,
                "dueDate" : commonFunction.getFormattedDate(data.installmentDueDate, "yyyy-mm-dd"),
                "rate" : data.installmentRate,
                "amount" : data.installmentAmount,
                "amountPaid" : data.installmentAmountPaid
            })
        }
        else if(data.unionName == 'Totals')
        {
            totalJSON = {
                "id" : data.totalsId,
                "taxType" : data.totalsTaxTypeName,
                "taxRate" :data.totalsTaxRate,
                "totalAmount" : data.totalsTotalAmount,
                "totalDiscount" : data.totalsTotalDiscount,
                "netAmount" : data.totalsNetAmount,
                "taxAmount" : data.totalsTaxAmount,
                "grossAmount" : data.totalsGrossAmount
            };
        }
        r++;
    }); 
    if(datas.length > 0)
    {
        //Final JSON
        let finalJSON = {
            "uuid" : datas[0].uuid,
            "feeCategory" : feeCategoryJSON,
            "feeTypes" : feeTypeJSON,
            "discountTypes" : discountTypeJSON,
            "installments" : installmentJSON,
            "total" : totalJSON,
        }
        resultJSON = finalJSON;
    }
    return resultJSON;
}

buildCommonJSON.applicationFeePayments = function(datas)
{
    let resultJSON = [];
    
    datas.forEach((data) => 
    { 
        //Final JSON
        let finalJSON = {
            "receiptNumber" : data.receiptNumber,
            "paymentFor" : data.paymentFor,
            "paymentDate" : commonFunction.getFormattedDate(data.paymentDate, "yyyy-mm-dd"),
            "amount" : data.amount,
            "paymentMethod" : {"id" : data.paymentMethodId, "name" : data.paymentMethodName},
            "bankReference" : data.bankReference || ""
        }
        resultJSON.push(finalJSON);
    });

    return resultJSON;
}

module.exports = buildCommonJSON;