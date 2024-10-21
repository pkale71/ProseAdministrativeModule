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

buildCommonJSON.currencies = function(datas)
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

buildCommonJSON.feeStructures = function(datas, action = 1)
{
    let schoolJSON = [];
    let academicSessionJSON = [];
    let syllabusJSON = [];
    let gradeCategoryJSON = [];
    let schoolingProgramJSON = [];
    let batchYearJSON = [];
    let feeCategoryJSON = [];
    let currencyJSON = [];
    let resultJSON = [];

    datas.forEach((data) => 
    { 
        schoolJSON = [];
        academicSessionJSON = [];
        syllabusJSON = [];
        gradeCategoryJSON = [];
        schoolingProgramJSON = [];
        batchYearJSON = [];
        feeCategoryJSON = [];
        currencyJSON = [];

        schoolJSON = {
            "uuid" : data.schoolUUID,
            "name" : data.schoolName
        }
        academicSessionJSON = {
            "id" : data.academicSessionId,
            "year" : data.academicSessionYear
        }
        batchYearJSON = {
            "id" : data.batchYearId,
            "batchYear" : data.batchYear
        }
        syllabusJSON = {
            "id" : data.syllabusId,
            "name" : data.syllabusName
        }
        gradeCategoryJSON = {
            "id" : data.gradeCategoryId,
            "name" : data.gradeCategoryName
        }
        schoolingProgramJSON = {
            "id" : data.schoolingProgramId,
            "name" : data.schoolingProgramName
        }
        feeCategoryJSON = {
            "id" : data.feeCategoryId,
            "name" : data.feeCategoryName
        }
        currencyJSON = {
            "id" : data.currencyId,
            "name" : data.currencyName
        }

        //Final JSON
        let finalJSON = {
            "uuid" : data.uuid,
            "validityFrom" : commonFunction.getFormattedDate(data.validityFrom, "yyyy-mm-dd"),
            "validityTo" : commonFunction.getFormattedDate(data.validityTo, "yyyy-mm-dd"),
            "taxApplicable" : data.taxApplicable,
            "school" : schoolJSON,
            "academicSession" : academicSessionJSON,
            "batchYear" : batchYearJSON,
            "syllabus" : syllabusJSON,
            "gradeCategory" : gradeCategoryJSON,
            "schoolingProgram" : schoolingProgramJSON,
            "feeCategory" : feeCategoryJSON,
            "currency" : currencyJSON,
            "totalInstallment" : data.totalInstallment,
            "isActive" : data.isActive,
            "tableName" : data.tableName
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

buildCommonJSON.feeStructureInstallments = function(datas, action = 1)
{
    let resultJSON = [];

    datas.forEach((data) => 
    { 
        //Final JSON
        let finalJSON = {
            "id" : data.id,
            "name" : data.name,
            "installmentRate" : data.installmentRate,
            "dueDate" : commonFunction.getFormattedDate(data.dueDate, "yyyy-mm-dd"),
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

buildCommonJSON.feeStructureFeeTypes = function(datas, action = 1)
{
    let feeTypeJSON = [];
    let resultJSON = [];

    datas.forEach((data) => 
    { 
        feeTypeJSON = [];

        feeTypeJSON = {
            "id" : data.feeTypeId,
            "name" : data.feeTypeName
        }
        //Final JSON
        let finalJSON = {
            "id" : data.id,
            "feeType" : feeTypeJSON,
            "amount" : data.amount,            
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

buildCommonJSON.feeStructureDiscountTypes = function(datas, action = 1)
{
    let discountTypeJSON = [];
    let resultJSON = [];

    datas.forEach((data) => 
    { 
        discountTypeJSON = [];

        discountTypeJSON = {
            "id" : data.discountTypeId,
            "name" : data.discountTypeName
        }
        //Final JSON
        let finalJSON = {
            "id" : data.id,
            "discountType" : discountTypeJSON,
            "amount" : data.amount,            
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

buildCommonJSON.feeStructureTaxRates = function(datas, action = 1)
{
    let taxTypeJSON = [];
    let taxRateJSON = [];
    let resultJSON = [];

    datas.forEach((data) => 
    { 
        taxTypeJSON = [];
        taxRateJSON = [];

        taxTypeJSON = {
            "id" : data.taxTypeId,
            "name" : data.taxTypeName
        }
        taxRateJSON = {
            "id" : data.taxRateId,
            "rate" : data.taxRate
        }

        //Final JSON
        let finalJSON = {
            "id" : data.id,
            "taxType" : taxTypeJSON,
            "taxRate" : taxRateJSON,            
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

buildCommonJSON.feeStructureTotals = function(datas, action = 1)
{
    let feeStructureTaxRateJSON = [];
    let taxTypeJSON = [];
    let taxRateJSON = [];
    let resultJSON = [];

    datas.forEach((data) => 
    { 
        feeStructureTaxRateJSON = [];
        taxTypeJSON = [];
        taxRateJSON = [];

        taxTypeJSON = {
            "id" : data.taxTypeId,
            "name" : data.taxTypeName
        }
        taxRateJSON = {
            "id" : data.taxRateId,
            "rate" : data.taxRate
        }

        feeStructureTaxRateJSON = {
            "id" : data.feeStructureTaxRateId
        }

        //Final JSON
        let finalJSON = {
            "id" : data.id,
            "feeStructureTaxRate" : feeStructureTaxRateJSON,
            "taxType" : taxTypeJSON,
            "taxRate" : taxRateJSON,
            "totalAmount" : data.totalAmount,
            "totalDiscount" : data.totalDiscount,
            "netAmount" : data.netAmount,
            "taxAmount" : data.taxAmount,
            "grossAmount" : data.grossAmount,
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