let dbConn = require('../util/dbConnection');
const commonFunction = require('../util/commonFunctions');
let secretKey = commonFunction.getSecretKey();
let db = {};

db.updateLoginLogoutHistoryForModule = (ullh) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `UPDATE user_login_logout_history SET logout_on = NOW(), logout_as = '${ullh.logoutAs}' 
            WHERE user_id = ${ullh.userId} AND logout_on IS NULL`
            dbConn.query(sql, (error, result) => 
            {
                if(error)
                {
                    return reject(error);
                }   
                return resolve(result);
            });
        }
        catch(e)
        {
            throw e;
        }
    })
};

db.insertLoginLogoutHistory = (ullh) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `UPDATE user_login_logout_history SET logout_on = NOW(), logout_as = '${ullh.logoutAs}' 
            WHERE user_id = ${ullh.userId} AND module_id = ${ullh.moduleId} AND logout_on IS NULL`
            dbConn.query(sql, (error, result) => 
            {
                if(error)
                {
                    return reject(error);
                }   
        /////       
                let sql1 = `INSERT INTO user_login_logout_history(user_id, module_id, auth_token, login_on) 
                VALUES (${ullh.userId}, ${ullh.moduleId}, '${ullh.authToken}', NOW())`
                dbConn.query(sql1, (error1, result1) => 
                {
                    if(error1)
                    {
                        return reject(error1);
                    }          
                    return resolve(result1);
                });
            });
        }
        catch(e)
        {
            throw e;
        }
    })
};

db.updateAuthToken = (authToken, userId) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `UPDATE user SET auth_token='${authToken}' WHERE id = ${userId}`
            dbConn.query(sql, (error, result) => 
            {
                if(error)
                {
                    return reject(error);
                }       
                return resolve(result);
            });
        }
        catch(e)
        {
            throw e;
        }
    })
};

db.authenticateUser = (email, password) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `select u.id AS userId, u.uuid AS userUUID, u.first_name AS firstName, u.last_name AS lastName, TRIM(CONCAT(u.first_name, ' ', IFNULL(u.last_name, ''))) AS fullName, u.email AS userEmail, 
            u.mobile AS userMobile, u.gender AS userGender, u.profile_pic_file_name AS profilePicFileName,
            ug.id AS userGradeId, ug.name AS userGradeName, ug.code AS userGradeCode,
            uc.id AS userCategoryId, uc.name AS userCategoryName, uc.code AS userCategoryCode
            FROM user u 
            JOIN user_grade ug ON ug.id = u.user_grade_id
            LEFT JOIN user_category uc ON uc.id = u.user_category_id
            WHERE (u.email='${email}' OR u.mobile='${email}') 
            AND password = HEX(AES_ENCRYPT('${password}', '${secretKey}'))
            AND u.is_active = 1 AND u.is_approved_by_admin = 1`
        
            dbConn.query(sql, (error, result) => 
            {
                if(error)
                {
                    return reject(error);
                }     
                return resolve(result);
            });
        }
        catch(e)
        {
            throw e;
        }
    })
};

db.authenticateUserByUUID = (uuid) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `select u.id AS userId, u.uuid AS userUUID, u.first_name AS firstName, u.last_name AS lastName, TRIM(CONCAT(u.first_name, ' ', IFNULL(u.last_name, ''))) AS fullName, u.email AS userEmail, 
            u.mobile AS userMobile, u.gender AS userGender, u.profile_pic_file_name AS profilePicFileName,
            ug.id AS userGradeId, ug.name AS userGradeName, ug.code AS userGradeCode,
            uc.id AS userCategoryId, uc.name AS userCategoryName, uc.code AS userCategoryCode
            FROM user u 
            JOIN user_grade ug ON ug.id = u.user_grade_id
            LEFT JOIN user_category uc ON uc.id = u.user_category_id
            WHERE u.uuid = '${uuid}'
            AND u.is_active = 1 AND u.is_approved_by_admin = 1`
            
            dbConn.query(sql, (error, result) => 
            {
                if(error)
                {
                    return reject(error);
                }     
                return resolve(result);
            });
        }
        catch(e)
        {
            throw e;
        }
    })
};

db.checkDuplicateEmailMobile = (email, mobile) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT u.id AS userId
            FROM user u 
            WHERE u.email = '${email}' OR u.mobile = '${mobile}'`
            dbConn.query(sql, (error, result) => 
            {
                if(error)
                {
                    return reject(error);
                }  
                return resolve(result);
            });
        }
        catch(e)
        {
            throw e;
        }
    })
};

db.checkOldPassword = (userId, oldPassword) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT u.id AS userId
            FROM user u 
            WHERE u.id = ${userId} AND u.password = HEX(AES_ENCRYPT('${oldPassword}', '${secretKey}'))`
            dbConn.query(sql, (error, result) => 
            {
                if(error)
                {
                    return reject(error);
                }  
                return resolve(result);
            });
        }
        catch(e)
        {
            throw e;
        }
    })
};

db.changePassword = (loginUser, newPassword) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `UPDATE user SET password = HEX(AES_ENCRYPT('${newPassword}', '${secretKey}'))
            WHERE uuid = '${loginUser.uuid}'`
            dbConn.query(sql, (error, result) => 
            {
                if(error)
                {
                    return reject(error);
                }   
                return resolve(result);
            });
        }
        catch(e)
        {
            throw e;
        }
    })
};

db.updateUserStatus = (userId) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `UPDATE user SET is_active = IF(is_active = 1,0,1), auth_token = null
            WHERE id = ${userId}`
            dbConn.query(sql, (error, result) => 
            {
                if(error)
                {
                    return reject(error);
                }  
                ///Update History       
                let sql1 = `UPDATE user_login_logout_history SET logout_on = NOW(), logout_as = 'Normal' 
                WHERE user_id=${userId} AND logout_on IS NULL`
                dbConn.query(sql1, (error1, result1) => 
                {
                    if(error1)
                    {
                        return reject(error1);
                    }          
                    return resolve(result1);
                });
            });
        }
        catch(e)
        {
            throw e;
        }
    })
};

db.updateUserModuleStatus = (userId, moduleId) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `UPDATE user_module SET is_active = IF(is_active = 1,0,1)
            WHERE user_id = ${userId} AND module_id = ${moduleId}`
    
            dbConn.query(sql, (error, result) => 
            {
                if(error)
                {
                    return reject(error);
                }  
                return resolve(result);
            });
        }
        catch(e)
        {
            throw e;
        }
    })
};

db.checkAuthToken = (authToken) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `select u.id AS userId
            FROM user u 
            WHERE u.auth_token = '${authToken}'`;
            dbConn.query(sql, (error, result) => 
            {
                if(error)
                {
                    return reject(error);
                }
                return resolve(result);
            });
        }
        catch(e)
        {
            throw e;
        }
    })
};

db.signout = (userId, logoutAs) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `UPDATE user SET auth_token = null WHERE id = ${userId}`
            dbConn.query(sql, (error, result) => 
            {
                if(error)
                {
                    return reject(error);
                }   
        ///Update History       
                let sql1 = `UPDATE user_login_logout_history SET logout_on = NOW(), logout_as = '${logoutAs}' 
                WHERE user_id=${userId} AND logout_on IS NULL`
                dbConn.query(sql1, (error1, result1) => 
                {
                    if(error1)
                    {
                        return reject(error1);
                    }          
                    return resolve(result1);
                });
            });
        }
        catch(e)
        {
            throw e;
        }
    })
};

db.getUser = (userId) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `select u.id AS userId, u.uuid AS userUUID, u.first_name AS firstName, u.last_name AS lastName, TRIM(CONCAT(u.first_name, ' ', IFNULL(u.last_name, ''))) AS fullName, u.email AS userEmail, 
            u.mobile AS userMobile, u.gender AS userGender, u.profile_pic_file_name AS profilePicFileName,
            u.is_approved_by_admin AS userIsApproved, is_active AS userIsActive,
            ug.id AS userGradeId, ug.name AS userGradeName, ug.code AS userGradeCode,
            uc.id AS userCategoryId, uc.name AS userCategoryName, uc.code AS userCategoryCode
            FROM user u 
            JOIN user_grade ug ON ug.id = u.user_grade_id
            LEFT JOIN user_category uc ON uc.id = u.user_category_id`;
            if(!isNaN(userId))
            {
                sql = sql + ` WHERE u.id = ${userId}`;
            }
            else
            {
                sql = sql + ` WHERE u.uuid='${userId}'`;
            }
            dbConn.query(sql, (error, result) => 
            {
                if(error)
                {
                    return reject(error);
                }
                return resolve(result);
            });
        }
        catch(e)
        {
            throw e;
        }
    })
};

db.getUsers = (userGradeId, userCategoryId, action) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let secretKey = commonFunction.getSecretKey();
            let sql = `select u.id AS userId, u.uuid AS userUUID, u.first_name AS firstName, u.last_name AS lastName, 
            TRIM(CONCAT(u.first_name, ' ', IFNULL(u.last_name, ''))) AS fullName, u.email AS userEmail, 
            u.mobile AS userMobile, u.gender AS userGender, u.profile_pic_file_name AS profilePicFileName,
            u.is_approved_by_admin AS userIsApproved, is_active AS userIsActive, 
            CONVERT(AES_DECRYPT(UNHEX(password), '${secretKey}'), CHAR) AS password, 'user' AS tableName,
            ug.id AS userGradeId, ug.name AS userGradeName, ug.code AS userGradeCode,
            uc.id AS userCategoryId, uc.name AS userCategoryName, uc.code AS userCategoryCode
            FROM user u 
            JOIN user_grade ug ON ug.id = u.user_grade_id
            LEFT JOIN user_category uc ON uc.id = u.user_category_id 
            WHERE u.deleted_on IS NULL AND deleted_by_id IS NULL`;
            if(userGradeId != '')
            {
                sql = sql + ` AND u.user_grade_id = ${userGradeId}`;
            }
            if(userCategoryId != "")
            {
                sql = sql + ` AND u.user_category_id = ${userCategoryId}`;
            }
            if(action == "Active")
            {
                sql = sql + ` AND u.is_active = 1`;
            }
            sql = sql + ` ORDER BY u.first_name`;
            
            dbConn.query(sql, (error, result) => 
            {
                if(error)
                {
                    return reject(error);
                }
                return resolve(result);
            });
        }
        catch(e)
        {
            throw e;
        }
    })
};

db.getUsersByModule = (moduleId) =>
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `select u.id AS userId, u.uuid AS userUUID, u.first_name AS firstName, u.last_name AS lastName, 
            TRIM(CONCAT(u.first_name, ' ', IFNULL(u.last_name, ''))) AS fullName, u.email AS userEmail, 
            u.mobile AS userMobile, u.gender AS userGender, u.profile_pic_file_name AS profilePicFileName, IF(u.is_approved_by_admin = 1 && u.is_active = 1, IF(um.user_role_id IS NOT NULL AND user_type_id IS NOT NULL AND um.is_active = 1 AND um.is_approved_by_module_admin = 1, 'Active', IF(um.user_role_id IS NULL OR user_type_id IS NULL, 'Pending','Deactive')), 'Deactive By HR Admin') AS userStatus,
            CONVERT(AES_DECRYPT(UNHEX(password), '${secretKey}'), CHAR) AS password,
            u.is_approved_by_admin AS userIsApproved, u.is_active AS userIsActive, 
            ug.id AS userGradeId, ug.name AS userGradeName, ug.code AS userGradeCode,
            uc.id AS userCategoryId, uc.name AS userCategoryName, uc.code AS userCategoryCode
            FROM user u 
            JOIN user_grade ug ON ug.id = u.user_grade_id
            JOIN user_module um ON um.user_id = u.id
            LEFT JOIN user_category uc ON uc.id = u.user_category_id 
            WHERE u.deleted_on IS NULL AND deleted_by_id IS NULL 
            AND um.module_id = ${moduleId}`

            dbConn.query(sql, (error, result) => 
            {
                if(error)
                {
                    return reject(error);
                }   
                return resolve(result);
            });
        }
        catch(e)
        {
            throw e;
        }
    })
}

db.insertUser = (user) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
           let sql = `INSERT INTO user (first_name, last_name, email, mobile, gender, user_grade_id, user_category_id, password, created_on, created_by_id, uuid) 
            VALUES ('${user.firstName}', NULLIF('${user.lastName}', ''), '${user.email}', '${user.mobile}', '${user.gender}', ${user.userGradeId}, NULLIF('${user.userCategoryId}', ''), HEX(AES_ENCRYPT('${user.password}', '${secretKey}')), NOW(), ${user.createdById}, '${user.uuid}')`

            dbConn.query(sql, (error, result) => 
            {
                if(error)
                {
                    return reject(error);
                }   
                return resolve(result);
            });
        }
        catch(e)
        {
            throw e;
        }
    })
};

db.updateUser = (user) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `UPDATE user SET user_grade_id = ${user.userGradeId}, user_category_id = NULLIF('${user.userCategoryId}', ''), updated_on = NOW(), updated_by_id = ${user.createdById} WHERE uuid = '${user.uuid}'`

            dbConn.query(sql, (error, result) => 
            {
                if(error)
                {
                    return reject(error);
                }   
                return resolve(result);
            });
        }
        catch(e)
        {
            throw e;
        }
    })
};

db.updateUserProfilePic = (fileName, userId) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `UPDATE user SET profile_pic_file_name = '${fileName}' WHERE id = ${userId}`
            
            dbConn.query(sql, (error, result) => 
            {
                if(error)
                {
                    return reject(error);
                }   
                return resolve(result);
            });
        }
        catch(e)
        {
            throw e;
        }
    })
};

db.deleteUser = (uuid, userId) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `UPDATE user SET deleted_on = NOW(), deleted_by_id = ${userId}, is_active = 0, auth_token = NULL 
            WHERE uuid = '${uuid}'`
            
            dbConn.query(sql, (error, result) => 
            {
                if(error)
                {
                    return reject(error);
                }   
                return resolve(result);
            });
        }
        catch(e)
        {
            throw e;
        }
    })
};

db.approveDenyUser = (uuid, action, userId) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = "";
            if(action == "Approve")
            {
                sql = `UPDATE user SET is_approved_by_admin = 1, approved_on = NOW(), approved_by_id = ${userId}, 
                auth_token = NULL, denied_on = NULL, denied_by_id = NULL
                WHERE uuid = '${uuid}'`
            }
            else if(action == "Deny")
            {
                sql = `UPDATE user SET is_approved_by_admin = 0, denied_on = NOW(), denied_by_id = ${userId}, 
                auth_token = NULL, approved_on = NULL, approved_by_id = NULL
                WHERE uuid = '${uuid}'`
            }
            if(sql != "")
            {
                dbConn.query(sql, (error, result) => 
                {
                    if(error)
                    {
                        return reject(error);
                    }   
                    return resolve(result);
                });
            }
            else
            {
                return resolve("");
            }
        }
        catch(e)
        {
            throw e;
        }
    })
};

db.getUserModules = (userUUID, action, moduleId = '') => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT um.id AS userModuleId, m.id AS moduleId, m.name AS moduleName, m.redirect_url AS moduleRedirectUrl,
            um.is_approved_by_module_admin AS isApproved, um.is_active AS isActive, 'user_module' AS tableName,
            ur.id AS userRoleId, ur.name AS userRoleName, 
            ut.id AS userTypeId, ut.name AS userTypeName, ut.code AS userTypeCode
            FROM user_module um
            JOIN module m ON m.id = um.module_id
            LEFT JOIN user_role ur ON ur.id = um.user_role_id
            LEFT JOIN user_type ut ON ut.id = um.user_type_id
            WHERE um.user_id = (SELECT id 
            FROM user WHERE uuid = '${userUUID}')`;
            if(moduleId != '')
            {
                sql =sql + ` AND m.id = ${moduleId}`;
            }
            if(action == "Approved")
            {
                sql =sql + ` AND um.is_approved_by_module_admin = 1`;
            }            
            sql =sql + ` ORDER BY um.id`;
            
            dbConn.query(sql, (error, result) => 
            {
                if(error)
                {
                    return reject(error);
                }
                return resolve(result);
            });
        }
        catch(e)
        {
            throw e;
        }
    })
};

db.getUserModule = (id) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT um.id AS userModuleId, um.id AS moduleId,
            um.is_approved_by_module_admin AS isApproved, um.user_id AS userId, 
            um.user_role_id AS userRoleId, um.user_type_id AS userTypeId
            FROM user_module um
            WHERE um.id = ${id}`;
            
            dbConn.query(sql, (error, result) => 
            {
                if(error)
                {
                    return reject(error);
                }
                return resolve(result);
            });
        }
        catch(e)
        {
            throw e;
        }
    })
};

db.duplicateUserModule = (userUUID, moduleId, userRoleId, userTypeId) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT id
            FROM user_module
            WHERE user_id = (SELECT id FROM user WHERE uuid = '${userUUID}') AND
            module_id = ${moduleId}`;
            if(userRoleId != '')
            {
                sql = sql + ` AND user_role_id = ${userRoleId}`;
            }
            if(userRoleId != '')
            {
                sql = sql + ` AND user_type_id = ${userTypeId}`;
            }

            dbConn.query(sql, (error, result) => 
            {
                if(error)
                {
                    return reject(error);
                }
                return resolve(result);
            });
        }
        catch(e)
        {
            throw e;
        }
    })
};

db.insertUserModule = (userModule) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `INSERT INTO user_module (user_id, module_id, created_on, created_by_id) 
            VALUES (${userModule.userId}, ${userModule.moduleId}, NOW(), ${userModule.createdById})`
        
            dbConn.query(sql, (error, result) => 
            {
                if(error)
                {
                    return reject(error);
                }   
                return resolve(result);
            });
        }
        catch(e)
        {
            throw e;
        }
    })
};

db.updateUserModule = (userModule) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `UPDATE user_module SET user_role_id = ${userModule.userRoleId}, user_type_id = ${userModule.userTypeId}, updated_on = NOW(), updated_by_id = ${userModule.createdById} WHERE user_id = ${userModule.userId} AND module_id = ${userModule.moduleId} AND id = ${userModule.id}`
       
            dbConn.query(sql, (error, result) => 
            {
                if(error)
                {
                    return reject(error);
                }   
                return resolve(result);
            });
        }
        catch(e)
        {
            throw e;
        }
    })
};

db.approveDenyUserModule = (id, action, userId) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = "";
            if(action == "Approve")
            {
                sql = `UPDATE user_module SET is_approved_by_module_admin = 1, approved_on = NOW(), approved_by_id = ${userId}, 
                denied_on = NULL, denied_by_id = NULL
                WHERE id = ${id}`
            }
            else if(action == "Deny")
            {
                sql = `UPDATE user_module SET is_approved_by_module_admin = 0, denied_on = NOW(), denied_by_id = ${userId}, 
                approved_on = NULL, approved_by_id = NULL
                WHERE id = ${id}`
            }
            if(sql != "")
            {
                dbConn.query(sql, (error, result) => 
                {
                    if(error)
                    {
                        return reject(error);
                    }   
                    return resolve(result);
                });
            }
            else
            {
                return resolve("");
            }
        }
        catch(e)
        {
            throw e;
        }
    })
};

db.deleteUserModule = (id, userId) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `DELETE FROM user_module WHERE user_id = ${userId} AND id = ${id}`
            
            dbConn.query(sql, (error, result) => 
            {
                if(error)
                {
                    return reject(error);
                }   
                return resolve(result);
            });
        }
        catch(e)
        {
            throw e;
        }
    })
};

db.insertUserModuleHistory = (userModuleHistory) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `INSERT INTO user_module_history (user_id, module_id, user_role_id, user_type_id, assigned_on, assigned_by_id, remark) 
            VALUES (${userModuleHistory.userId}, ${userModuleHistory.moduleId}, NULLIF('${userModuleHistory.userRoleId}', ''), NULLIF('${userModuleHistory.userTypeId}',''), NOW(), ${userModuleHistory.createdById}, '${userModuleHistory.remark}')`

            dbConn.query(sql, (error, result) => 
            {
                if(error)
                {
                    return reject(error);
                }   
                return resolve(result);
            });
        }
        catch(e)
        {
            throw e;
        }
    })
};

db.checkUserRoleTypeExist = (userRoleId, userTypeId) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT id
            FROM user_module`;
            if(userRoleId != "")
            {
                sql = sql + ` WHERE user_role_id = ${userRoleId}`;
            }
            else if(userTypeId != "")
            {
                sql = sql + ` WHERE user_type_id = ${userTypeId}`;
            }
            dbConn.query(sql, (error, result) => 
            {
                if(error)
                {
                    return reject(error);
                }
                return resolve(result);
            });
        }
        catch(e)
        {
            throw e;
        }
    })
};

db.userOnBoardingExist = (email, mobile) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT id
            FROM user_on_boarding_link WHERE email='${email}' OR mobile='${mobile}'`

            dbConn.query(sql, (error, result) => 
            {
                if(error)
                {
                    return reject(error);
                } 
                if(result.length == 0)
                {   
                    let sql1 = `SELECT id
                    FROM user WHERE email='${email}' OR mobile='${mobile}'`
    
                    dbConn.query(sql1, (error1, result1) => 
                    {
                        if(error1)
                        {
                            return reject(error1);
                        }    
                        return resolve(result1);
                    });
                }
                else
                {
                    return resolve(result);
                }
            });
        }
        catch(e)
        {
            throw e;
        }
    })
};

db.insertUserOnBoarding = (userOnBoarding) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `INSERT INTO user_on_boarding_link (code, email, mobile, user_grade_id, user_category_id, created_on, created_by_id) 
            VALUES ('${userOnBoarding.code}', '${userOnBoarding.email}', '${userOnBoarding.mobile}', ${userOnBoarding.userGradeId}, NULLIF('${userOnBoarding.userCategoryId}', ''), NOW(), ${userOnBoarding.createdById})`
            
            dbConn.query(sql, (error, result) => 
            {
                if(error)
                {
                    return reject(error);
                }   
                return resolve(result);
            });
        }
        catch(e)
        {
            throw e;
        }
    })
};

db.getUserOnBoardingLinks = (status) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT uobl.id, uobl.code, uobl.email, uobl.mobile, DATE(uobl.created_on) AS createdOn,  
            DATE(uobl.sent_on) AS sentOn, uobl.is_sent AS isSent, 
            IF(uobl.created_user_id IS NULL, 'Pending', 'Completed') AS status, 
            cu.uuid AS userUUID, TRIM(CONCAT(cu.first_name, ' ', IFNULL(cu.last_name, ''))) AS userFullName,
            ug.id AS userGradeId, ug.name AS userGradeName, ug.code AS userGradeCode,
            uc.id AS userCategoryId, uc.name AS userCategoryName, uc.code AS userCategoryCode
            FROM user_on_boarding_link uobl 
            JOIN user_grade ug ON ug.id = uobl.user_grade_id
            LEFT JOIN user_category uc ON uc.id = uobl.user_category_id
            LEFT JOIN user cu ON cu.id = uobl.created_user_id`;
            if(status == 'Pending')
            {
                sql = sql + ` WHERE uobl.created_user_id IS NULL`;
            }
            else
            {
                sql = sql + ` WHERE uobl.created_user_id IS NOT NULL`;
            }
            sql = sql + ` ORDER BY uobl.id DESC`;

            dbConn.query(sql, (error, result) => 
            {
                if(error)
                {
                    return reject(error);
                }    
                return resolve(result);
            });
        }
        catch(e)
        {
            throw e;
        }
    })
};

db.getUserOnBoardingLink = (code) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT uobl.code, uobl.email, uobl.mobile, DATE(uobl.created_on) AS createdOn, 
            uobl.created_by_id AS createdById,
            ug.id AS userGradeId, ug.name AS userGradeName, ug.code AS userGradeCode,
            uc.id AS userCategoryId, uc.name AS userCategoryName, uc.code AS userCategoryCode
            FROM user_on_boarding_link uobl
            JOIN user_grade ug ON ug.id = uobl.user_grade_id
            LEFT JOIN user_category uc ON uc.id = uobl.user_category_id
            WHERE uobl.code = '${code}' 
            AND (SELECT COUNT(*) FROM user WHERE email = uobl.email OR mobile = uobl.mobile) = 0`;
            
            dbConn.query(sql, (error, result) => 
            {
                if(error)
                {
                    return reject(error);
                }    
                return resolve(result);
            });
        }
        catch(e)
        {
            throw e;
        }
    })
};

db.getUserOnBoardingLinkById = (id) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT uobl.code, uobl.email, uobl.mobile, DATE(uobl.created_on) AS createdOn, 
            uobl.created_by_id AS createdById
            FROM user_on_boarding_link uobl
            WHERE uobl.id = ${id} 
            AND uobl.created_user_id IS NOT NULL`;
            
            dbConn.query(sql, (error, result) => 
            {
                if(error)
                {
                    return reject(error);
                }    
                return resolve(result);
            });
        }
        catch(e)
        {
            throw e;
        }
    })
};

db.updateUserOnBoardingCompleted = (userOnBoarding) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `UPDATE user_on_boarding_link SET created_user_id = ${userOnBoarding.userId}
            WHERE code = '${userOnBoarding.code}'`;

            dbConn.query(sql, (error, result) => 
            {
                if(error)
                {
                    return reject(error);
                }    
                return resolve(result);
            });
        }
        catch(e)
        {
            throw e;
        }
    })
};

db.updateUserOnBoardingLinkSent = (code) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `UPDATE user_on_boarding_link SET is_sent = 1, sent_on = NOW()
            WHERE code = '${code}'`;

            dbConn.query(sql, (error, result) => 
            {
                if(error)
                {
                    return reject(error);
                }    
                return resolve(result);
            });
        }
        catch(e)
        {
            throw e;
        }
    })
};

db.deleteUserOnBoarding = (id) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `DELETE FROM user_on_boarding_link WHERE id = ${id}`;

            dbConn.query(sql, (error, result) => 
            {
                if(error)
                {
                    return reject(error);
                }    
                return resolve(result);
            });
        }
        catch(e)
        {
            throw e;
        }
    })
};

db.getUserSchoolSchoolingPrograms = (userUUID, moduleId) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT ussp.id, sch.uuid AS schoolUUID, sch.name AS schoolName, 
            m.id AS moduleId, m.name AS moduleName, 
            GROUP_CONCAT(sp.id) AS schoolingProgramIds, GROUP_CONCAT(sp.name) AS schoolingProgramNames 
            FROM user_school_schooling_programs ussp
            JOIN user u ON u.id = ussp.user_id
            JOIN module m ON m.id = ussp.module_id
            JOIN school sch ON sch.id = ussp.school_id
            JOIN schooling_program sp ON sp.id = ussp.schooling_program_id
            WHERE u.uuid = '${userUUID}' AND ussp.module_id = ${moduleId}
            GROUP BY sch.id
            ORDER BY sch.name`;

            dbConn.query(sql, (error, result) => 
            {
                if(error)
                {
                    return reject(error);
                }    
                return resolve(result);
            });
        }
        catch(e)
        {
            throw e;
        }
    })
};

db.insertUserSchoolSchoolingPrograms = (user) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sqlParams = "";
            let sql = "";
            
            if(user.schoolingProgramIds != "0")
            {
                let schoolingProgramIdArray = user.schoolingProgramIds.toString().split(",");
                for(let i=0;i<schoolingProgramIdArray.length;i++)
                {
                    if(sqlParams == '')
                    {
                        sqlParams = `(${user.userId}, ${user.moduleId}, ${user.schoolId}, ${schoolingProgramIdArray[i]}, NOW(),  ${user.createdById})`;
                    }
                    else
                    {
                        sqlParams = sqlParams + `, (${user.userId}, ${user.moduleId}, ${user.schoolId}, ${schoolingProgramIdArray[i]}, NOW(),  ${user.createdById})`;
                    }
                }
            
                sql = `INSERT INTO user_school_schooling_programs (user_id, module_id, school_id, schooling_program_id, assigned_on, assigned_by_id) VALUES ${sqlParams}`;

                dbConn.query(sql, (error, result) => 
                {
                    if(error)
                    {
                        return reject(error);
                    } 
                    return resolve(result);
                });
            }
            else if(user.schoolingProgramIds == "0")
            {
                let sql1 = `DELETE FROM user_school_schooling_programs WHERE user_id = ${user.userId} AND school_id = ${user.schoolId} AND module_id = ${user.moduleId}`;
                dbConn.query(sql1, (error1, result1) => 
                {
                    if(error1)
                    {
                        return reject(error1);
                    } 

                    sql = `INSERT INTO user_school_schooling_programs (user_id, module_id, school_id, schooling_program_id, assigned_on, assigned_by_id) 
                    SELECT ${user.userId} AS user_id, ${user.moduleId} AS module_id, ${user.schoolId} AS school_id, schooling_program_id, NOW() AS assigned_on, ${user.createdById} AS assigned_by_id FROM school_schooling_program_detail WHERE school_id = ${user.schoolId} AND is_active = 1`;
                    dbConn.query(sql, (error, result) => 
                    {
                        if(error)
                        {
                            return reject(error);
                        }  

                        let sql2 = `ALTER TABLE user_school_schooling_programs AUTO_INCREMENT = ${result.insertId + 1}`;
                        dbConn.query(sql2, (error2, result2) => 
                        {
                            if(error2)
                            {
                                return reject(error2);
                            }  
                            return resolve(result);                            
                        });
                    });
                });
            }
            
        }
        catch(e)
        {
            throw e;
        }
    })
};

db.deleteUserSchool = (user) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `DELETE FROM user_school_schooling_programs WHERE user_id = ${user.userId} AND school_id = ${user.schoolId} AND module_id = ${user.moduleId}`;
            dbConn.query(sql, (error, result) => 
            {
                if(error)
                {
                    return reject(error);
                } 
                return resolve(result);
            });            
        }
        catch(e)
        {
            throw e;
        }
    })
};

db.deleteUserSchoolSchoolingProgram = (user) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `DELETE FROM user_school_schooling_programs WHERE user_id = ${user.userId} AND school_id = ${user.schoolId} AND schooling_program_id = ${user.schoolingProgramId} AND module_id = ${user.moduleId}`;
            dbConn.query(sql, (error, result) => 
            {
                if(error)
                {
                    return reject(error);
                } 
                return resolve(result);
            });            
        }
        catch(e)
        {
            throw e;
        }
    })
};

db.userSchoolSchoolingProgramsExist = (userId, moduleId, schoolId, schoolingProgramIds) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT id FROM user_school_schooling_programs WHERE user_id = ${userId} AND module_id = ${moduleId} AND school_id = ${schoolId} AND FIND_IN_SET(schooling_program_id, '${schoolingProgramIds}') > 0`;

            dbConn.query(sql, (error, result) => 
            {
                if(error)
                {
                    return reject(error);
                }    
                return resolve(result);
            });
        }
        catch(e)
        {
            throw e;
        }
    })
};

db.getUserStudyCenters = (userUUID, moduleId) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT usc.id, sc.uuid AS studyCenterUUID, sc.name AS studyCenterName,
            m.id AS moduleId, m.name AS moduleName
            FROM user_study_centers usc
            JOIN user u ON u.id = usc.user_id
            JOIN module m ON m.id = usc.module_id
            JOIN study_center sc ON sc.id = usc.study_center_id
            WHERE u.uuid = '${userUUID}' AND usc.module_id = ${moduleId}
            ORDER BY sc.name`;

            dbConn.query(sql, (error, result) => 
            {
                if(error)
                {
                    return reject(error);
                }    
                return resolve(result);
            });
        }
        catch(e)
        {
            throw e;
        }
    })
};

db.insertUserStudyCenters = (user) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sqlParams = "";
            let sql = "";
            
            if(user.studyCenters.length > 0)
            {
                for(let i=0;i<user.studyCenters.length;i++)
                {
                    if(sqlParams == '')
                    {
                        sqlParams = `(${user.userId}, ${user.moduleId}, ${user.studyCenters[i].id}, NOW(),  ${user.createdById})`;
                    }
                    else
                    {
                        sqlParams = sqlParams + `, (${user.userId}, ${user.moduleId}, ${user.studyCenters[i].id}, NOW(),  ${user.createdById})`;
                    }
                }
            
                sql = `INSERT INTO user_study_centers (user_id, module_id, study_center_id, assigned_on, assigned_by_id) VALUES ${sqlParams}`;

                dbConn.query(sql, (error, result) => 
                {
                    if(error)
                    {
                        return reject(error);
                    } 
                    return resolve(result);
                });
            }
            else if(user.studyCenters.length == 0)
            {
                let sql1 = `DELETE FROM user_study_centers WHERE user_id = ${user.userId} AND module_id = ${user.moduleId}`;
                dbConn.query(sql1, (error1, result1) => 
                {
                    if(error1)
                    {
                        return reject(error1);
                    } 
                    sql = `INSERT INTO user_study_centers (user_id, module_id, study_center_id, assigned_on, assigned_by_id) 
                    SELECT ${user.userId} AS user_id, ${user.moduleId} AS module_id, id AS study_center_id, NOW() AS assigned_on, ${user.createdById} AS assigned_by_id FROM study_center WHERE is_active = 1`;
    
                    dbConn.query(sql, (error, result) => 
                    {
                        if(error)
                        {
                            return reject(error);
                        }  

                        let sql2 = `ALTER TABLE user_study_centers AUTO_INCREMENT = ${result.insertId + 1}`;
                        dbConn.query(sql2, (error2, result2) => 
                        {
                            if(error2)
                            {
                                return reject(error2);
                            }  
                            return resolve(result);                            
                        });
                    });
                });
            }
            
        }
        catch(e)
        {
            throw e;
        }
    })
};

db.deleteUserStudyCenter = (user) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `DELETE FROM user_study_centers WHERE user_id = ${user.userId} AND study_center_id = ${user.studyCenterId} AND module_id = ${user.moduleId}`;
            dbConn.query(sql, (error, result) => 
            {
                if(error)
                {
                    return reject(error);
                } 
                return resolve(result);
            });            
        }
        catch(e)
        {
            throw e;
        }
    })
};

db.userStudyCentersExist = (userId, moduleId, studyCenters) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let studyCenterIds = "";
            studyCenters.forEach(studyCenter => {
                if(studyCenterIds == "")
                {
                    studyCenterIds = studyCenter.id;
                }
                else
                {
                    studyCenterIds = studyCenterIds + "," + studyCenter.id;
                }
            });
            let sql = `SELECT id FROM user_study_centers WHERE user_id = ${userId} AND module_id = ${moduleId} AND FIND_IN_SET(study_center_id, '${studyCenterIds}') > 0`;

            dbConn.query(sql, (error, result) => 
            {
                if(error)
                {
                    return reject(error);
                }    
                return resolve(result);
            });
        }
        catch(e)
        {
            throw e;
        }
    })
};

module.exports = db