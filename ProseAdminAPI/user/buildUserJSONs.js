const buildUserJSON = {};
const commonFunction = require('../util/commonFunctions.js');

buildUserJSON.userModules = function(datas)
{
    let resultJSON = [];
    let moduleJSON = [];
    let userRoleJSON = [];
    let userTypeJSON = [];

    datas.forEach((data) => 
    {
        moduleJSON = [];
        userRoleJSON = [];
        userTypeJSON = [];
        
        moduleJSON = {
            "id" : data.moduleId,
            "name" : data.moduleName
        }
        userRoleJSON = {
            "id" : data.userRoleId,
            "name" : data.userRoleName
        }
        userTypeJSON = {
            "id" : data.userTypeId,
            "name" : data.userTypeName
        }

/////Final JSON
        let finalJSON = {
            "id" : data.userModuleId,
            "isActive" : data.isActive,
            "tableName" : data.tableName ? data.tableName : '' ? data.tableName : '',
            "module" : moduleJSON,
            "userRole" : userRoleJSON,
            "userType" : userTypeJSON,
            "isModuleAdminApproved" : data.isApproved
        }
//If action == 1 for mupltiple rows
        resultJSON.push(finalJSON);
    });

    return resultJSON;
}

buildUserJSON.user = function(datas, action = 1)
{
    let resultJSON = [];
    let userGradeJSON = [];
    let userCategoryJSON = [];

    datas.forEach((data) => 
    {
        userGradeJSON = [];
        userCategoryJSON = [];

        userGradeJSON = {
            "id" : data.userGradeId,
            "code" : data.userGradeCode,
            "name" : data.userGradeName
        }
        
        userCategoryJSON = {
            "id" : data.userCategoryId != null ? data.userCategoryId : "",
            "code" : data.userCategoryCode != null ? data.userCategoryCode : "",
            "name" : data.userCategoryName != null ? data.userCategoryName : ""
        }    
/////Final JSON
        let finalJSON = {
            "uuid" : data.userUUID,
            "firstName" : data.firstName,
            "lastName" : data.lastName != null ? data.lastName : "",
            "fullName" : data.fullName,
            "email" : data.userEmail,
            "mobile" : data.userMobile,
            "gender" : data.userGender,
            "profilePicFileName" : data.profilePicFileName != null ? data.profilePicFileName : "",
            "password" : data.password,
            "isActive" : data.userIsActive,
            "tableName" : data.tableName ? data.tableName : '' ? data.tableName : '',
            "isAdminApproved" : data.userIsApproved,
            "userGrade" : userGradeJSON,
            "userCategory" : userCategoryJSON
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

buildUserJSON.userOnBoarding = function(datas, action = 1)
{
    let resultJSON = [];
    let userJSON = [];

    datas.forEach((data) => 
    {
        userJSON = [];
       
        userJSON = {
            "uuid" : data.userUUID != null ? data.userUUID : "",
            "name" : data.userFullName != null ? data.userFullName : ""
        }  
/////Final JSON
        let finalJSON = {
            "id" : data.id,
            "code" : data.code,
            "email" : data.email,
            "mobile" : data.mobile,
            "createdOn" : commonFunction.getFormattedDate(data.createdOn, "yyyy-mm-dd"),
            "sentOn" : commonFunction.getFormattedDate(data.sentOn, "yyyy-mm-dd"),
            "isSent" : data.isSent,
            "status" : data.status,
            "createdUser" : userJSON
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

module.exports = buildUserJSON;