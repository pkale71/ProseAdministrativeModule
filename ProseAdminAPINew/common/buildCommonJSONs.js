const buildCommonJSON = {};
const commonFunction = require('../util/commonFunctions.js');

buildCommonJSON.modules = function(datas)
{
    let resultJSON = [];

    datas.forEach((data) => 
    { 
/////Final JSON
        let finalJSON = {
            "id" : data.moduleId,
            "name" : data.moduleName
        }
        resultJSON.push(finalJSON);
    });

    return resultJSON;
}

buildCommonJSON.userGrades = function(datas)
{
    let resultJSON = [];

    datas.forEach((data) => 
    { 
/////Final JSON
        let finalJSON = {
            "id" : data.userGradeId,
            "name" : data.userGradeName,
            "code" : data.userGradeCode
        }
        resultJSON.push(finalJSON);
    });

    return resultJSON;
}

buildCommonJSON.userCategories = function(datas)
{
    let resultJSON = [];

    datas.forEach((data) => 
    { 
/////Final JSON
        let finalJSON = {
            "id" : data.userCategoryId,
            "name" : data.userCategoryName,
            "code" : data.userCategoryCode
        }
        resultJSON.push(finalJSON);
    });

    return resultJSON;
}

buildCommonJSON.userRoles = function(datas)
{
    let resultJSON = [];
    let moduleJSON = [];

    datas.forEach((data) => 
    { 
        moduleJSON = [];
        moduleJSON = {
            "id" : data.moduleId,
            "name" : data.moduleName
        }
/////Final JSON
        let finalJSON = {
            "id" : data.userRoleId,
            "name" : data.userRoleName,
            "isActive" : data.userRoleIsActive,
            "tableName" : data.tableName ? data.tableName : '',
            "module" : moduleJSON
        }
        resultJSON.push(finalJSON);
    });

    return resultJSON;
}

buildCommonJSON.userTypes = function(datas)
{
    let resultJSON = [];
    let moduleJSON = [];
    let userRoleJSON = [];

    datas.forEach((data) => 
    { 
        moduleJSON = [];
        userRoleJSON = []; 
        moduleJSON = {
            "id" : data.moduleId,
            "name" : data.moduleName
        }
        userRoleJSON = {
            "id" : data.userRoleId,
            "name" : data.userRoleName
        }
/////Final JSON
        let finalJSON = {
            "id" : data.userTypeId,
            "name" : data.userTypeName,
            "isActive" : data.userTypeIsActive,
            "tableName" : data.tableName ? data.tableName : '',
            "module" : moduleJSON,
            "userRole" : userRoleJSON
        }
        resultJSON.push(finalJSON);
    });

    return resultJSON;
}

///Academic Admin
buildCommonJSON.schoolingProgrmas = function(datas)
{
    let resultJSON = [];
    let schoolingCategoryJSON = [];

    datas.forEach((data) => 
    { 
        schoolingCategoryJSON = [];
        schoolingCategoryJSON = {
            "id" : data.schoolingCategoryId,
            "name" : data.schoolingCategoryName
        }
/////Final JSON
        let finalJSON = {
            "id" : data.schoolingProgramId,
            "name" : data.schoolingProgramName,
            "isActive" : data.isActive,
            "tableName" : data.tableName ? data.tableName : '',
            "schoolingCategory" : schoolingCategoryJSON,
            "isExist" :  data.isExist
        }
        resultJSON.push(finalJSON);
    });

    return resultJSON;
}

buildCommonJSON.syllabuses = function(datas, action = 1)
{
    let resultJSON = [];
    let gradeCategoryJSON = [];

    datas.forEach((data) => 
    { 
        gradeCategoryJSON = [];
        let gradeCategoryIds = data.gradeCategoryIds.toString().split(",");
        let gradeCategoryNames = data.gradeCategoryNames.toString().split(",");
        for(let i=0;i<gradeCategoryIds.length;i++)
        {
            gradeCategoryJSON.push({
                "id" : gradeCategoryIds[i],
                "name" : gradeCategoryNames[i]
            });
        }
        //Final JSON
        let finalJSON = {
            "id" : data.syllabusId,
            "name" : data.syllabusName,
            "isActive" : data.isActive,
            "tableName" : data.tableName,
            "gradeCategories" : gradeCategoryJSON,
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

buildCommonJSON.academicSessions = function(datas, action = 1)
{
    let resultJSON = [];

    datas.forEach((data) => 
    { 
/////Final JSON
        let finalJSON = {
            "id" : data.id,
            "year" : data.year,
            "batchYear" : data.batchYear,
            "isCurrentSession" : data.isCurrentSession,
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

buildCommonJSON.gradeCategories = function(datas)
{
    let resultJSON = [];

    datas.forEach((data) => 
    { 
/////Final JSON
        let finalJSON = {
            "id" : data.id,
            "name" : data.name,
            "isActive" : data.isActive,
            "tableName" : data.tableName ? data.tableName : '',
            "isExist" : data.isExist
        }
        resultJSON.push(finalJSON);
    });

    return resultJSON;
}

buildCommonJSON.grades = function(datas)
{
    let gradeCategoryJSON;
    let resultJSON = [];

    datas.forEach((data) => 
    { 
        gradeCategoryJSON = [];
        gradeCategoryJSON = {
            "id" : data.gradeCategoryId,
            "name" : data.gradeCategoryName,
        } 
/////Final JSON
        let finalJSON = {
            "id" : data.id,
            "name" : data.name,
            "isActive" : data.isActive,
            "tableName" : data.tableName ? data.tableName : '',
            "gradeCategory" : gradeCategoryJSON,
            "isExist" : data.isExist
        }
        resultJSON.push(finalJSON);
    });

    return resultJSON;
}

buildCommonJSON.subjects = function(datas, action = 1)
{  
    let gradeCategoryJSON;
    let gradeJSON;
    let syllabusJSON;
    let applicableFromYearJSON;
    let effectiveTillYearJSON;
    let subjectTypeJSON;
    let resultJSON = [];
    datas.forEach((data) => 
    { 
        gradeCategoryJSON = [];
        gradeJSON = [];
        syllabusJSON = [];
        applicableFromYearJSON = [];
        effectiveTillYearJSON = [];
        subjectTypeJSON = [];
        
        gradeCategoryJSON = {
            "id" : data.gradeCategoryId,
            "name" : data.gradeCategoryName,
        }

        gradeJSON = {
            "id" : data.gradeId,
            "name" : data.gradeName,
        }

        syllabusJSON = {
            "id" : data.syllabusId,
            "name" : data.syllabusName,
        } 

        applicableFromYearJSON = {
            "id" : data.applicableFromYearId,
            "year" : data.applicableFromYear,
        }

        effectiveTillYearJSON = {
            "id" : data.effectiveTillYearId,
            "year" : data.effectiveTillYear
        }

        subjectTypeJSON = {
            "id" : data.subjectTypeId,
            "name" : data.subjectTypeName,
        } 
        //Final JSON
        let finalJSON = {
            "id" : data.id,
            "name" : data.name,
            "isActive" : data.isActive,
            "tableName" : data.tableName ? data.tableName : '' ? data.tableName : '',
            "gradeCategory" : gradeCategoryJSON,
            "grade" : gradeJSON,
            "syllabus" : syllabusJSON,
            "applicableFromYear" : applicableFromYearJSON,
            "effectiveTillYear" : effectiveTillYearJSON,
            "subjectType" : subjectTypeJSON,
            "totalSession" : data.totalSession,
            "sessionDuration" : data.sessionDuration,
            "hasPractical" : data.hasPractical,
            "isMandatory" : data.isMandatory,
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
        // resultJSON.push(finalJSON);
    });
    return resultJSON;
}

buildCommonJSON.chapters = function(datas)
{
    let gradeCategoryJSON;
    let gradeJSON;
    let syllabusJSON;
    let subjectJSON;
    let applicableFromYearJSON;
    let effectiveTillYearJSON;
    let resultJSON = [];

    datas.forEach((data) => 
    { 
        gradeCategoryJSON = [];
        syllabusJSON = [];
        gradeJSON = [];
        subjectJSON = [];
        applicableFromYearJSON = [];
        effectiveTillYearJSON = [];
        
        gradeCategoryJSON = {
            "id" : data.gradeCategoryId,
            "name" : data.gradeCategoryName,
        }

        gradeJSON = {
            "id" : data.gradeId,
            "name" : data.gradeName,
        }

        syllabusJSON = {
            "id" : data.syllabusId,
            "name" : data.syllabusName,
        } 

        subjectJSON = {
            "id" : data.subjectId,
            "name" : data.subjectName,
        } 

        applicableFromYearJSON = {
            "id" : data.applicableFromYearId,
            "year" : data.applicableFromYear,
        }

        effectiveTillYearJSON = {
            "id" : data.effectiveTillYearId,
            "year" : data.effectiveTillYear
        }
        //Final JSON
        let finalJSON = {
            "id" : data.id,
            "name" : data.name,
            "isActive" : data.isActive,
            "tableName" : data.tableName ? data.tableName : '' ? data.tableName : '',
            "gradeCategory" : gradeCategoryJSON,
            "grade" : gradeJSON,
            "syllabus" : syllabusJSON,
            "subject" : subjectJSON,
            "applicableFromYear" : applicableFromYearJSON,
            "effectiveTillYear" : effectiveTillYearJSON,
            "isExist" : data.isExist
        }
        resultJSON.push(finalJSON);
    });

    return resultJSON;
}

buildCommonJSON.topics = function(datas)
{
    let gradeCategoryJSON;
    let gradeJSON;
    let syllabusJSON;
    let subjectJSON;
    let chapterJSON;
    let applicableFromYearJSON;
    let effectiveTillYearJSON;
    let resultJSON = [];

    datas.forEach((data) => 
    { 
        gradeCategoryJSON = [];
        syllabusJSON = [];
        gradeJSON = [];
        subjectJSON = [];
        chapterJSON = [];
        applicableFromYearJSON = [];
        effectiveTillYearJSON = [];
        
        gradeCategoryJSON = {
            "id" : data.gradeCategoryId,
            "name" : data.gradeCategoryName,
        }

        gradeJSON = {
            "id" : data.gradeId,
            "name" : data.gradeName,
        }

        syllabusJSON = {
            "id" : data.syllabusId,
            "name" : data.syllabusName,
        } 

        subjectJSON = {
            "id" : data.subjectId,
            "name" : data.subjectName,
        } 

        chapterJSON = {
            "id" : data.chapterId,
            "name" : data.chapterName
        }

        applicableFromYearJSON = {
            "id" : data.applicableFromYearId,
            "year" : data.applicableFromYear,
        }

        effectiveTillYearJSON = {
            "id" : data.effectiveTillYearId,
            "year" : data.effectiveTillYear
        }
        //Final JSON
        let finalJSON = {
            "id" : data.id,
            "name" : data.name,
            "isActive" : data.isActive,
            "tableName" : data.tableName ? data.tableName : '' ? data.tableName : '',
            "gradeCategory" : gradeCategoryJSON,
            "grade" : gradeJSON,
            "syllabus" : syllabusJSON,
            "subject" : subjectJSON,
            "chapter" : chapterJSON,
            "applicableFromYear" : applicableFromYearJSON,
            "effectiveTillYear" : effectiveTillYearJSON,
            "isExist" : data.isExist
        }
        resultJSON.push(finalJSON);
    });

    return resultJSON;
}

buildCommonJSON.schoolingGroups = function(datas)
{
    let resultJSON = [];

    datas.forEach((data) => 
    { 
/////Final JSON
        let finalJSON = {
            "id" : data.id,
            "name" : data.name,
            "isActive" : data.isActive,
            "tableName" : data.tableName ? data.tableName : '',
            "isExist" : data.isExist
        }
        resultJSON.push(finalJSON);
    });

    return resultJSON;
}

buildCommonJSON.schoolingCategories = function(datas)
{
    let resultJSON = [];

    datas.forEach((data) => 
    { 
/////Final JSON
        let finalJSON = {
            "id" : data.id,
            "name" : data.name,
            "isActive" : data.isActive,
            "tableName" : data.tableName ? data.tableName : '',
            "isExist" : data.isExist
        }
        resultJSON.push(finalJSON);
    });

    return resultJSON;
}

buildCommonJSON.schoolSubGroups = function(datas)
{
    let resultJSON = [];

    datas.forEach((data) => 
    { 
/////Final JSON
        let finalJSON = {
            "id" : data.id,
            "name" : data.name,
            "isActive" : data.isActive,
            "tableName" : data.tableName ? data.tableName : '',
            "isExist" : data.isExist
        }
        resultJSON.push(finalJSON);
    });

    return resultJSON;
}

buildCommonJSON.batchTypes = function(datas)
{
    let resultJSON = [];
    let academicSessionJSON;

    datas.forEach((data) => 
    { 
        academicSessionJSON = [];

        academicSessionJSON = {
            "id" : data.academicSessionId,
            "year" : data.academicSessionYear,
            "batchYear" : data.batchYear
        } 

///Final JSON
        let finalJSON = {
            "id" : data.id,
            "name" : data.name,
            "startTime" : data.startTime,
            "endTime" : data.endTime,
            "academicSession" : academicSessionJSON,
            "isActive" : data.isActive,
            "tableName" : data.tableName ? data.tableName : '',
            "isExist" : data.isExist
        }
        resultJSON.push(finalJSON);
    });

    return resultJSON;
}

buildCommonJSON.subjectTypes = function(datas)
{
    let resultJSON = [];

    datas.forEach((data) => 
    { 
/////Final JSON
        let finalJSON = {
            "id" : data.id,
            "name" : data.name
        }
        resultJSON.push(finalJSON);
    });

    return resultJSON;
}

module.exports = buildCommonJSON;