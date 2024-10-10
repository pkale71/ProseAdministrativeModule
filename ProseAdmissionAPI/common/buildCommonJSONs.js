const buildCommonJSON = {};
const commonFunction = require('../util/commonFunctions.js');

buildCommonJSON.appBase = function(datas)
{
    let resultJSON = [];

    datas.forEach((data) => 
    { 
        //Final JSON
        let finalJSON = {
            "id" : data.id,
            "apiUrl" : data.apiUrl,
            "uiUrl" : data.uiUrl
        }
        resultJSON = finalJSON;
    });

    return resultJSON;
}

buildCommonJSON.exitReasonTypes = function(datas)
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

buildCommonJSON.taxTypes = function(datas)
{
    let resultJSON = [];

    datas.forEach((data) => 
    { 
        //Final JSON
        let finalJSON = {
            "id" : data.id,
            "name" : data.name,
            "tableName" : data.tableName,
            "isActive" : data.isActive,
            "isExist" : data.isExist
        }
        resultJSON.push(finalJSON);
    });

    return resultJSON;
}

buildCommonJSON.taxRates = function(datas, action = 1)
{
    let academicSessionJSON = [];
    let taxTypeJSON = [];
    let resultJSON = [];

    datas.forEach((data) => 
    { 
        academicSessionJSON = [];
        taxTypeJSON = [];

        academicSessionJSON = {
            "id" : data.academicSessionId,
            "year" : data.academicSessionYear
        }

        taxTypeJSON = {
            "id" : data.taxTypeId,
            "name" : data.taxTypeName
        }

        //Final JSON
        let finalJSON = {
            "id" : data.id,
            "academicSession" : academicSessionJSON,
            "taxType" : taxTypeJSON,
            "rate" : data.rate,
            "tableName" : data.tableName,
            "isActive" : data.isActive,
            "isExist" : data.isExist
        }
        //If action == 1 for mupltiple rows
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

buildCommonJSON.feeTypes = function(datas)
{
    let resultJSON = [];

    datas.forEach((data) => 
    { 
        //Final JSON
        let finalJSON = {
            "id" : data.id,
            "name" : data.name,
            "code" : data.code,
            "tableName" : data.tableName,
            "isActive" : data.isActive,
            "isExist" : data.isExist
        }
        resultJSON.push(finalJSON);
    });

    return resultJSON;
}

buildCommonJSON.discountTypes = function(datas)
{
    let resultJSON = [];

    datas.forEach((data) => 
    { 
        //Final JSON
        let finalJSON = {
            "id" : data.id,
            "name" : data.name,
            "code" : data.code,
            "tableName" : data.tableName,
            "isActive" : data.isActive,
            "isExist" : data.isExist
        }
        resultJSON.push(finalJSON);
    });

    return resultJSON;
}

buildCommonJSON.feeCategories = function(datas)
{
    let resultJSON = [];

    datas.forEach((data) => 
    { 
        //Final JSON
        let finalJSON = {
            "id" : data.id,
            "name" : data.name,
            "availingInstallment" : data.availingInstallment,
            "tableName" : data.tableName,
            "isActive" : data.isActive,
            "isExist" : data.isExist
        }
        resultJSON.push(finalJSON);
    });

    return resultJSON;
}

buildCommonJSON.studentDocuments = function(datas)
{
    let resultJSON = [];

    datas.forEach((data) => 
    { 
        //Final JSON
        let finalJSON = {
            "id" : data.id,
            "name" : data.name,
            "isActive" : data.isActive,
            "tableName" : data.tableName,
            "isExist" : data.isExist
        }
        resultJSON.push(finalJSON);
    });

    return resultJSON;
}

buildCommonJSON.courseExitReasons = function(datas)
{
    let exitReasonTypeJSON = [];
    let resultJSON = [];

    datas.forEach((data) => 
    { 
        exitReasonTypeJSON = [];

        exitReasonTypeJSON = {
            "id" : data.courseExitReasonTypeId,
            "name" : data.courseExitReasonTypeName
        }
        //Final JSON
        let finalJSON = {
            "id" : data.id,
            "name" : data.name,
            "exitReasonType" : exitReasonTypeJSON,
            "tableName" : data.tableName,
            "isActive" : data.isActive,
            "isExist" : data.isExist
        }
        resultJSON.push(finalJSON);
    });

    return resultJSON;
}

buildCommonJSON.gradeSections = function(datas, action = 1)
{
    let schoolJSON = [];
    let academicSessionJSON = [];
    let syllabusJSON = [];
    let gradeCategoryJSON = [];
    let gradeJSON = [];
    let batchTypeJSON = [];
    let sectionsJSON = [];
    let resultJSON = [];

    datas.forEach((data) => 
    { 
        schoolJSON = [];
        academicSessionJSON = [];
        syllabusJSON = [];
        gradeCategoryJSON = [];
        gradeJSON = [];
        batchTypeJSON = [];
        sectionsJSON = [];

        schoolJSON = {
            "uuid" : data.schoolUUID,
            "name" : data.schoolName
        }
        academicSessionJSON = {
            "id" : data.academicSessionId,
            "year" : data.academicSessionYear
        }
        syllabusJSON = {
            "id" : data.syllabusId,
            "name" : data.syllabusName
        }
        gradeCategoryJSON = {
            "id" : data.gradeCategoryId,
            "name" : data.gradeCategoryName
        }
        gradeJSON = {
            "id" : data.gradeId,
            "name" : data.gradeName
        }
        batchTypeJSON = {
            "id" : data.batchTypeId,
            "name" : data.batchTypeName
        }

        let sectionIds = data.id.toString().split(",");
        let sectionNames = data.section.toString().split(",");
        let isActives = data.isActive.toString().split(",");
        for(let i=0;i<sectionIds.length;i++)
        {
            sectionsJSON.push({
                "id" : sectionIds[i],
                "name" : sectionNames[i],
                "isActive" : isActives[i],
                "tableName" : data.tableName
            })
        }

        //Final JSON
        let finalJSON = {
            "school" : schoolJSON,
            "academicSession" : academicSessionJSON,
            "syllabus" : syllabusJSON,
            "gradeCategory" : gradeCategoryJSON,
            "grade" : gradeJSON,
            "batchType" : batchTypeJSON,
            "sections" : sectionsJSON
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

buildCommonJSON.subjectGroups = function(datas, action = 1)
{
    let syllabusJSON = [];
    let gradeCategoryJSON = [];
    let gradeJSON = [];
    let resultJSON = [];

    datas.forEach((data) => 
    { 
        syllabusJSON = [];
        gradeCategoryJSON = [];
        gradeJSON = [];
        
        syllabusJSON = {
            "id" : data.syllabusId,
            "name" : data.syllabusName
        }
        gradeCategoryJSON = {
            "id" : data.gradeCategoryId,
            "name" : data.gradeCategoryName
        }
        gradeJSON = {
            "id" : data.gradeId,
            "name" : data.gradeName
        }
        
        //Final JSON
        let finalJSON = {
            "id" : data.id,
            "groupName" : data.groupName,
            "minSubject" : data.minSubject,
            "maxSubject" : data.maxSubject,
            "syllabus" : syllabusJSON,
            "gradeCategory" : gradeCategoryJSON,
            "grade" : gradeJSON,
            "tableName" : data.tableName,
            "isActive" : data.isActive
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

buildCommonJSON.subjectGroupAllocations = function(datas, action = 1)
{
    let subjectGroupJSON = [];
    let subjectJSON = [];
    let resultJSON = [];

    datas.forEach((data) => 
    { 
        subjectGroupJSON = [];
        subjectJSON = [];
        
        subjectGroupJSON = {
            "id" : data.subjectGroupId,
            "groupName" : data.subjectGroupName,
            "minSubject" : data.minSubject,
            "maxSubject" : data.maxSubject
        }

        subjectJSON = {
            "id" : data.subjectId,
            "name" : data.subjectName
        }
        
        //Final JSON
        let finalJSON = {
            "id" : data.id,
            "subjectGroup" : subjectGroupJSON,
            "subject" : subjectJSON,
            "tableName" : data.tableName,
            "isActive" : data.isActive
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

module.exports = buildCommonJSON;