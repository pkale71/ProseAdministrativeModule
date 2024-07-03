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
    let academicSessionJSON = [];

    datas.forEach((data) => 
    { 
        academicSessionJSON = [];
        academicSessionJSON = {
            "id" : data.academicSessionId,
            "name" : data.academicSessionName
        }
/////Final JSON
        let finalJSON = {
            "id" : data.schoolingProgramId,
            "name" : data.schoolingProgramName,
            "isActive" : data.isActive,
            "tableName" : data.tableName ? data.tableName : '',
            "academicSession" : academicSessionJSON,
            "isExist" :  data.isExist
        }
        resultJSON.push(finalJSON);
    });

    return resultJSON;
}

buildCommonJSON.syllabuses = function(datas)
{
    let resultJSON = [];
    let schoolingProgramJSON = [];
    let academicSessionJSON = [];

    datas.forEach((data) => 
    { 
        schoolingProgramJSON = {
            "id" : data.schoolingProgramId,
            "name" : data.schoolingProgramName
        }

        academicSessionJSON = {
            "id" : data.academicSessionId,
            "name" : data.academicSessionName
        }
/////Final JSON
        let finalJSON = {
            "id" : data.syllabusId,
            "name" : data.syllabusName,
            "isActive" : data.isActive,
            "tableName" : data.tableName ? data.tableName : '',
            "schoolingProgram" : schoolingProgramJSON,
            "academicSession" : academicSessionJSON,
            "isExist" : data.isExist
        }
        resultJSON.push(finalJSON);
    });

    return resultJSON;
}

buildCommonJSON.academicSessions = function(datas)
{
    let resultJSON = [];

    datas.forEach((data) => 
    { 
/////Final JSON
        let finalJSON = {
            "id" : data.id,
            "name" : data.name,
            "startDate" : commonFunction.getFormattedDate(data.startDate, "yyyy-mm-dd"),
            "endDate" : commonFunction.getFormattedDate(data.endDate, "yyyy-mm-dd"),
            "isAdmissionOpen" : data.isAdmissionOpen,
            "isCurrentSession" : data.isCurrentSession,
            "isExist" : data.isExist
        }
        resultJSON.push(finalJSON);
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

buildCommonJSON.gradeWiseSyllabuses = function(datas)
{
    let academicSessionJSON;
    let gradeCategoryJSON;
    let gradeJSON;
    let syllabusJSON;
    let resultJSON = [];

    datas.forEach((data) => 
    { 
        academicSessionJSON = [];
        gradeCategoryJSON = [];
        gradeJSON = [];
        
        gradeCategoryJSON = {
            "id" : data.gradeCategoryId,
            "name" : data.gradeCategoryName,
        }

        gradeJSON = {
            "id" : data.gradeId,
            "name" : data.gradeName,
        }
        
        academicSessionJSON = {
            "id" : data.academicSessionId,
            "name" : data.academicSessionName,
        } 

        syllabusJSON = {
            "id" : data.syllabusId,
            "name" : data.syllabusName,
        } 
/////Final JSON
        let finalJSON = {
            "id" : data.id,
            "name" : data.name,
            "isActive" : data.isActive,
            "tableName" : data.tableName ? data.tableName : '' ? data.tableName : '',
            "academicSession" : academicSessionJSON,
            "gradeCategory" : gradeCategoryJSON,
            "grade" : gradeJSON,
            "syllabus" : syllabusJSON,
            "isExist" : data.isExist
        }
        resultJSON.push(finalJSON);
    });

    return resultJSON;
}

buildCommonJSON.syllabusWiseSubjects = function(datas)
{
    let academicSessionJSON;
    let gradeCategoryJSON;
    let gradeJSON;
    let syllabusJSON;
    let resultJSON = [];

    datas.forEach((data) => 
    { 
        gradeCategoryJSON = [];
        academicSessionJSON = [];
        syllabusJSON = [];
        gradeJSON = [];
        
        gradeCategoryJSON = {
            "id" : data.gradeCategoryId,
            "name" : data.gradeCategoryName,
        }

        gradeJSON = {
            "id" : data.gradeId,
            "name" : data.gradeName,
        }
        
        academicSessionJSON = {
            "id" : data.academicSessionId,
            "name" : data.academicSessionName,
        } 

        syllabusJSON = {
            "id" : data.syllabusId,
            "name" : data.syllabusName,
        } 
/////Final JSON
        let finalJSON = {
            "id" : data.id,
            "name" : data.name,
            "isActive" : data.isActive,
            "tableName" : data.tableName ? data.tableName : '' ? data.tableName : '',
            "academicSession" : academicSessionJSON,
            "gradeCategory" : gradeCategoryJSON,
            "grade" : gradeJSON,
            "syllabus" : syllabusJSON,
            "isExist" : data.isExist
        }
        resultJSON.push(finalJSON);
    });

    return resultJSON;
}

buildCommonJSON.subjectWiseChapters = function(datas)
{
    let academicSessionJSON;
    let gradeCategoryJSON;
    let gradeJSON;
    let syllabusJSON;
    let subjectJSON;
    let resultJSON = [];

    datas.forEach((data) => 
    { 
        academicSessionJSON = [];
        gradeCategoryJSON = [];
        syllabusJSON = [];
        gradeJSON = [];
        subjectJSON = [];
        
        gradeCategoryJSON = {
            "id" : data.gradeCategoryId,
            "name" : data.gradeCategoryName,
        }

        gradeJSON = {
            "id" : data.gradeId,
            "name" : data.gradeName,
        }
        
        academicSessionJSON = {
            "id" : data.academicSessionId,
            "name" : data.academicSessionName,
        } 

        syllabusJSON = {
            "id" : data.syllabusId,
            "name" : data.syllabusName,
        } 

        subjectJSON = {
            "id" : data.syllabusWiseSubjectId,
            "name" : data.syllabusWiseSubjectName,
        } 
/////Final JSON
        let finalJSON = {
            "id" : data.id,
            "name" : data.name,
            "isActive" : data.isActive,
            "tableName" : data.tableName ? data.tableName : '' ? data.tableName : '',
            "academicSession" : academicSessionJSON,
            "gradeCategory" : gradeCategoryJSON,
            "grade" : gradeJSON,
            "syllabus" : syllabusJSON,
            "subject" : subjectJSON,
            "isExist" : data.isExist
        }
        resultJSON.push(finalJSON);
    });

    return resultJSON;
}

buildCommonJSON.chapterWiseTopics = function(datas)
{
    let academicSessionJSON;
    let gradeCategoryJSON;
    let gradeJSON;
    let syllabusJSON;
    let subjectJSON;
    let chapterJSON;
    let resultJSON = [];

    datas.forEach((data) => 
    { 
        academicSessionJSON = [];
        syllabusJSON = [];
        gradeCategoryJSON = [];
        gradeJSON = [];
        subjectJSON = [];
        chapterJSON = [];

        gradeCategoryJSON = {
            "id" : data.gradeCategoryId,
            "name" : data.gradeCategoryName,
        }

        gradeJSON = {
            "id" : data.gradeId,
            "name" : data.gradeName,
        }
        
        academicSessionJSON = {
            "id" : data.academicSessionId,
            "name" : data.academicSessionName,
        } 

        syllabusJSON = {
            "id" : data.syllabusId,
            "name" : data.syllabusName,
        } 

        subjectJSON = {
            "id" : data.syllabusWiseSubjectId,
            "name" : data.syllabusWiseSubjectName,
        } 

        chapterJSON = {
            "id" : data.subjectWiseChapterId,
            "name" : data.subjectWiseChapterName,
        } 
/////Final JSON
        let finalJSON = {
            "id" : data.id,
            "name" : data.name,
            "isActive" : data.isActive,
            "tableName" : data.tableName ? data.tableName : '' ? data.tableName : '',
            "academicSession" : academicSessionJSON,
            "gradeCategory" : gradeCategoryJSON,
            "grade" : gradeJSON,
            "syllabus" : syllabusJSON,
            "subject" : subjectJSON,
            "chapter" : chapterJSON
        }
        resultJSON.push(finalJSON);
    });

    return resultJSON;
}

module.exports = buildCommonJSON;