let dbConn = require('../util/dbConnection');
const commonFunction = require('../util/commonFunctions');
const { resolve } = require('path');
const { error } = require('console');
const { promises } = require('dns');
let db = {};

db.checkDatabaseExist = () =>
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let databaseName = commonFunction.databaseName();

            let sql = `SELECT SCHEMA_NAME
            FROM INFORMATION_SCHEMA.SCHEMATA
            WHERE SCHEMA_NAME = '${databaseName}'`;
            
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

db.checkTableExist = (tableName) =>
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let databaseName = commonFunction.databaseName();

            let sql = `SELECT TABLE_NAME FROM information_schema.tables 
            WHERE table_schema = '${databaseName}' AND table_name = '${tableName}'`;
           
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

db.updateIsActive = (id, tableName) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `UPDATE ${tableName} SET is_active = IF(is_active = 1, 0, 1)`;            
            if(isNaN(id))
            {
                sql = sql + ` WHERE uuid = '${id}'`;
            }
            else
            {
                sql = sql + ` WHERE id = ${id}`;
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

db.updateSubChapTopIsActive = (updateJSON) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `UPDATE ${updateJSON.tableName} SET is_active = IF(is_active = 1, 0, 1), 
            effective_till_year_id = IF(is_active = 1, NULL, ${updateJSON.academicYearId}), 
            updated_on = NOW(), updated_by_id = ${updateJSON.createdById}`;
            
            if(isNaN(updateJSON.id))
            {
                sql = sql + ` WHERE uuid = '${updateJSON.id}'`;
            }
            else
            {
                sql = sql + ` WHERE id = ${updateJSON.id}`;
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

db.checkDuplicateEmailMobile = (emailMobile, actionOn, tableName, id = "") => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT id
            FROM ${tableName}`;
            if(actionOn == 'Email')
            {
                sql = sql + ` WHERE email='${emailMobile}'`
            }
            else if(actionOn == 'Mobile')
            {
                sql = sql + ` WHERE mobile='${emailMobile}'`
            }
            if(id != "")
            {
                if(isNaN(id))
                {
                    sql = sql + ` AND uuid != '${id}'`;
                }
                else
                {
                    sql = sql + ` AND id != ${id}`;
                }
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

db.validateToken = (token) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT u.id, u.uuid, 
            ug.id AS userGradeId, ug.name AS userGradeName, ug.code AS userGradeCode,
            uc.id AS userCategoryId, uc.name AS userCategoryName, uc.code AS userCategoryCode 
            FROM user u 
            JOIN user_grade ug ON ug.id = u.user_grade_id
            LEFT JOIN user_category uc ON uc.id = u.user_category_id
            WHERE auth_token='${token}'`
            
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

db.getModules = () => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT m.id AS moduleId, m.name AS moduleName
            FROM module m ORDER BY m.name`;
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

db.getModule = (id) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT m.id AS moduleId, m.name AS moduleName
            FROM module m WHERE id = ${id}`;
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

db.getUserRoles = (moduleId, action) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT ur.id AS userRoleId, ur.name AS userRoleName, 
            ur.is_active AS userRoleIsActive, 'user_role' AS tableName,
            m.id AS moduleId, m.name AS moduleName
            FROM user_role ur 
            JOIN module m ON m.id = ur.module_id`;
            if(parseInt(moduleId) > 0)
            {
                sql =sql + ` WHERE ur.module_id = ${moduleId}`;
                if(action == "Active")
                {
                    sql =sql + ` AND ur.is_active = 1`;
                }
            }
            else if(action == "Active")
            {
                sql =sql + ` WHERE ur.is_active = 1`;
            }
            sql = sql + ` ORDER BY ur.name`;
            
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

db.getUserRole = (moduleId, roleId) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT ur.id AS userRoleId, ur.name AS userRoleName,
            m.id AS moduleId, m.name AS moduleName
            FROM user_role ur JOIN module m ON m.id = ur.module_id
            WHERE ur.id = ${roleId} AND ur.module_id = ${moduleId}`;
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

db.getUserGrades = () => 
    {
        return new Promise((resolve, reject) => 
        {
            try
            {
                let sql = `SELECT ug.id AS userGradeId, ug.name AS userGradeName, ug.code AS userGradeCode
                FROM user_grade ug ORDER BY ug.name`;
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

db.getUserCategories = () => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT uc.id AS userCategoryId, uc.name AS userCategoryName, uc.code AS userCategoryCode
            FROM user_category uc ORDER BY uc.name`;
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

db.duplicateUserRole = (moduleId, name) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT ur.id, m.name AS moduleName 
            FROM user_role ur 
            JOIN module m ON m.id = ur.module_id
            WHERE ur.module_id = ${moduleId} AND ur.name = '${name}'`;
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

db.insertUserRole = (userRole) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `INSERT INTO user_role (module_id, name, created_on, created_by_id)
            VALUES(${userRole.moduleId}, '${userRole.name}', NOW(), ${userRole.createdById})`;
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

db.deleteUserRole = (id, action) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `DELETE FROM user_role WHERE id = ${id}`;
           
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

db.getUserTypes = (moduleId, userRoleId, action) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT ut.id AS userTypeId, ut.name AS userTypeName, ut.is_active AS userTypeIsActive, 'user_type' AS tableName,
            ur.id AS userRoleId, ur.name AS userRoleName, 
            m.id AS moduleId, m.name AS moduleName
            FROM user_type ut 
            JOIN module m ON m.id = ut.module_id
            JOIN user_role ur ON ur.id = ut.user_role_id`;
            if(parseInt(moduleId) > 0)
            {
                sql =sql + ` WHERE ut.module_id = ${moduleId}`;
                if(parseInt(userRoleId) > 0)
                {
                    sql =sql + ` AND ut.user_role_id = ${userRoleId}`;
                }
                if(action == "Active")
                {
                    sql =sql + ` AND ut.is_active = 1`;
                }
            }
            else if(parseInt(userRoleId) > 0)
            {
                sql =sql + ` WHERE ut.user_role_id = ${userRoleId} `;
                if(action == "Active")
                {
                    sql =sql + ` AND ut.is_active = 1`;
                }
            }
            else if(action == "Active")
            {
                sql =sql + ` WHERE ut.is_active = 1`;
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

db.getUserType = (moduleId, userRoleId, userTypeId) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT ut.id AS userTypeId, ut.name AS userTypeName, ut.is_active AS userTypeIsActive,
            ur.id AS userRoleId, ur.name AS userRoleName, 
            m.id AS moduleId, m.name AS moduleName
            FROM user_type ut 
            JOIN module m ON m.id = ut.module_id
            JOIN user_role ur ON ur.id = ut.user_role_id 
            WHERE ut.module_id = ${moduleId} AND ut.user_role_id = ${userRoleId} 
            AND ut.id = ${userTypeId}`;
                        
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

db.duplicateUserType = (moduleId, roleId, name) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT id
            FROM user_type 
            WHERE module_id = ${moduleId} AND user_role_id = ${roleId} AND name = '${name}'`;
           
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

db.insertUserType = (userType) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `INSERT INTO user_type (module_id, user_role_id, name, created_on, created_by_id)
            VALUES(${userType.moduleId}, ${userType.userRoleId}, '${userType.name}', NOW(), ${userType.createdById})`;
            
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

db.deleteUserType = (id, action) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `DELETE FROM user_type WHERE id = ${id}`;
           
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

///////////Academic Admin
db.getSchoolingPrograms = (schoolingCategoryId, action) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT sp.id AS schoolingProgramId, sp.name AS schoolingProgramName, sp.is_active AS isActive, 'schooling_program' AS tableName,
            sc.id AS schoolingCategoryId, sc.name AS schoolingCategoryName, COUNT(sspd.id) AS isExist
            FROM schooling_program sp 
            JOIN schooling_category sc ON sc.id = sp.schooling_category_id 
            LEFT JOIN school_schooling_program_detail sspd ON sspd.schooling_program_id = sp.id`;
            if(schoolingCategoryId != "")
            {
                sql = sql + ` WHERE sp.schooling_category_id = ${schoolingCategoryId}`;
                if(action == "Active")
                {
                    sql = sql + ` AND sp.is_active = 1`;
                }
            }
            else if(action == "Active")
            {
                sql = sql + ` WHERE sp.is_active = 1`;
            }
            sql = sql + ` GROUP BY sp.id ORDER BY sp.name`;
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

db.getSchoolingProgram = (id) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT sp.id AS schoolingProgramId, sp.name AS schoolingProgramName
            FROM schooling_program sp WHERE id = ${id}`;
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

db.duplicateSchoolingProgram = (names, schoolingCategoryId, id) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT sp.id AS schoolingProgramId
            FROM schooling_program sp WHERE FIND_IN_SET(sp.name, '${names}') > 0 AND sp.schooling_category_id = ${schoolingCategoryId}`;
            if(id != '')
            {
                sql = sql + ` AND sp.id != ${id}`;
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

db.checkSchoolingProgramExist = (id) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT sspd.id AS schoolSchoolingProgramDetailId
            FROM school_schooling_program_detail sspd WHERE sspd.schooling_program_id = ${id}`;
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

db.insertSchoolingProgram = (schoolingProgram) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sqlValues = '';
            let nameArray = schoolingProgram.names.toString().split(",");
            for(let i = 0;i<nameArray.length;i++)
            {
                if(sqlValues == '')
                {
                    sqlValues = `('${nameArray[i]}', ${schoolingProgram.schoolingCategoryId}, NOW(), ${schoolingProgram.createdById})`;
                }
                else
                {
                    sqlValues = sqlValues + `,('${nameArray[i]}', ${schoolingProgram.schoolingCategoryId}, NOW(), ${schoolingProgram.createdById})`;
                }
            }
            let sql = `INSERT INTO schooling_program (name, schooling_category_id, created_on, created_by_id)
            VALUES ${sqlValues}`;
            
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

db.updateSchoolingProgram = (schoolingProgram) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `UPDATE schooling_program SET name = '${schoolingProgram.name}', schooling_category_id = ${schoolingProgram.schoolingCategoryId}, updated_on = NOW(), updated_by_id = ${schoolingProgram.createdById} WHERE id = ${schoolingProgram.id}`;
            
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

db.deleteSchoolingProgram = (id, action) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql  = `DELETE FROM schooling_program WHERE id = ${id}`;
           
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

db.getSyllabuses = (action) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT s.id AS syllabusId, s.name AS syllabusName, s.is_active AS isActive, 'syllabus' AS tableName,
            GROUP_CONCAT(gc.id ORDER BY gc.id) AS gradeCategoryIds, GROUP_CONCAT(gc.name ORDER BY gc.id) AS gradeCategoryNames, COUNT(sub.id) AS isExist
            FROM syllabus s
            JOIN grade_category gc ON FIND_IN_SET(gc.id, s.grade_category_ids) > 0
            LEFT JOIN subject sub ON sub.syllabus_id = s.id`;
            if(action == "Active")
            {
                sql =sql + ` WHERE s.is_active = 1`;
            }
            sql =sql + ` GROUP BY s.id ORDER BY s.id`;

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

db.getSyllabus = (id) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT s.id AS syllabusId, s.name AS syllabusName, s.is_active AS isActive,
            GROUP_CONCAT(gc.id ORDER BY gc.id) AS gradeCategoryIds, GROUP_CONCAT(gc.name ORDER BY gc.id) AS gradeCategoryNames
            FROM syllabus s
            JOIN grade_category gc ON FIND_IN_SET(gc.id, s.grade_category_ids) > 0
            WHERE FIND_IN_SET(s.id, '${id}') > 0
            GROUP BY s.id, s.name, s.is_active`;
           
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

db.getSyllabusGradeCategory = (id, gradeCategoryId) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT s.id AS syllabusId, s.name AS syllabusName
            FROM syllabus s
            WHERE s.id = ${id} AND FIND_IN_SET(${gradeCategoryId}, s.grade_category_ids) > 0`;
            
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

db.duplicateSyllabus = (name) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT s.id AS syllabusId, s.name AS syllabusName
            FROM syllabus s 
            WHERE s.name = '${name}'`;
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

db.insertSyllabus = (syllabus) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `INSERT INTO syllabus (name, grade_category_ids, created_on, created_by_id)
            VALUES('${syllabus.name}', '${syllabus.gradeCategoryIds}', NOW(), ${syllabus.createdById})`;
            
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

db.updateSyllabus = (syllabus) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `UPDATE syllabus SET grade_category_ids = CONCAT(grade_category_ids, ',${syllabus.gradeCategoryIds}'), updated_on = NOW(), updated_by_id = ${syllabus.createdById} WHERE id = ${syllabus.id}`;
            
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

db.checkSyllabusExist = (id) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT sub.id AS subjectId
            FROM subject sub WHERE sub.syllabus_id = ${id}`;
            
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

db.deleteSyllabus = (id) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `DELETE FROM syllabus WHERE id = ${id}`;
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

db.deleteSyllabusGradeCategory = (id, gradeCategoryId) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `UPDATE syllabus SET grade_category_ids = remove_comma_separated_string(grade_category_ids,'${gradeCategoryId}') WHERE id = ${id}`;
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

db.getAcademicSessions = () => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT acs.id, acs.year, acs.batch_year AS batchYear, acs.is_current_session AS isCurrentSession, COUNT(sub.id) AS isExist
            FROM academic_session acs 
            LEFT JOIN subject sub ON (sub.applicable_from_year_id = acs.id OR sub.effective_till_year_id = acs.id)
            GROUP BY acs.id
            ORDER BY acs.id`;
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

db.getAcademicSession = (id) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT acs.id
            FROM academic_session acs WHERE acs.id = ${id}`;
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

db.duplicateAcademicSession = (year) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT acs.id, acs.year
            FROM academic_session acs 
            WHERE acs.year = '${year}'`;
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

// db.insertAcademicSession = (academicSession) => 
// {
//     return new Promise((resolve, reject) => 
//     {
//         try
//         {
//             let batchYearArray = academicSession.year.toString().split("-");
//             let sql = `INSERT INTO academic_session (year, batch_year, is_current_session, created_on, created_by_id)
//             VALUES('${academicSession.year}', '${batchYearArray[0].toString().trim()}', ${academicSession.isCurrentSession}, NOW(), ${academicSession.createdById})`;
            
//             dbConn.query(sql, (error, result) => 
//             {
//                 if(error)
//                 {
//                     return reject(error);
//                 }
//                 return resolve(result);
//             });
//         }
//         catch(e)
//         {
//             throw e;
//         }
//     })
// };

db.insertAcademicSession = (academicSession) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let batchYearArray = academicSession.year.toString().split("-");
            // insert new academic session
            let sql = `INSERT INTO academic_session (year, batch_year, is_current_session, created_on, created_by_id)
            VALUES('${academicSession.year}', '${batchYearArray[0].toString().trim()}', ${academicSession.isCurrentSession}, NOW(), ${academicSession.createdById})`;
            dbConn.query(sql, (error,result) => 
            {
                if(error)
                {
                    return reject(error);
                }    
        //check any other academic session is_current_session = 1 or not            
                if(parseInt(academicSession.isCurrentSession) == 1)
                {
                    let sql1 = `UPDATE academic_session SET is_current_session = 0 WHERE is_current_session = 1 AND id != ${result.insertId}`;
                    dbConn.query(sql1, (error1, result1) => 
                    {
                        if(error1)
                        {
                            return reject(error1);
                        }
                        return resolve(result);
                    });
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

db.updateAcademicSession = (academicSession) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let batchYearArray = academicSession.year.toString().split("-");
            let sql = `UPDATE academic_session set year = '${academicSession.year}', batch_year = '${batchYearArray[0].toString().trim()}', is_current_session = ${academicSession.isCurrentSession}, modify_on = NOW(), modify_by_id = ${academicSession.modifyById} WHERE id = ${academicSession.id}`;
            
            dbConn.query(sql, (error, result) => 
            {
                if(error)
                {
                    return reject(error);
                }
                //check any other academic session is_current_session = 1 or not            
                if(parseInt(academicSession.isCurrentSession) == 1)
                {
                    let sql1 = `UPDATE academic_session SET is_current_session = 0 WHERE is_current_session = 1 AND id != ${academicSession.id}`;
                    dbConn.query(sql1, (error1, result1) => 
                    {
                        if(error1)
                        {
                            return reject(error1);
                        }
                        return resolve(result);
                    });
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

db.checkAcademicSessionExist = (id) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT sub.id AS subjectId
            FROM subject sub WHERE (sub.applicable_from_year = ${id} OR sub.effective_till_year = ${id})`;
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

db.deleteAcademicSession = (id) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `DELETE FROM academic_session WHERE id = ${id}`;
                        
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

db.getCurrentAcademicSession = () => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT acs.id, acs.year, acs.batch_year AS batchYear, 
            acs.is_current_session AS isCurrentSession FROM academic_session acs 
            WHERE acs.is_current_session = 1`;
            
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
    });
}; 

db.getGradeCategories = (action) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT gc.id, gc.name, gc.is_active AS isActive, 'grade_category' AS tableName, 
            COUNT(g.id) AS isExist
            FROM grade_category gc 
            LEFT JOIN grade g ON g.grade_category_id = gc.id`;
            if(action == "Active")
            {
                sql = sql + ` WHERE gc.is_active = 1`;
            }
            sql = sql + ` GROUP BY gc.id 
            ORDER BY gc.name`;
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

db.getGradeCategory = (id) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT gc.id            
            FROM grade_category gc WHERE FIND_IN_SET(gc.id, '${id}') > 0`;
            
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

db.duplicateGradeCategory = (name) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT gc.id, gc.name
            FROM grade_category gc 
            WHERE gc.name = '${name}'`;
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

db.insertGradeCategory = (gradeCategory) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `INSERT INTO grade_category (name, created_on, created_by_id)
            VALUES('${gradeCategory.name}', NOW(), ${gradeCategory.createdById})`;
            
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

db.checkGradeCategoryExist = (id) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT g.id AS gradeId
            FROM grade g WHERE g.grade_category_id = ${id}`;
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

db.deleteGradeCategory = (id) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `DELETE FROM grade_category WHERE id = ${id}`;
                        
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

db.getGrades = (gradeCategoryId, action) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT g.id, g.name, g.is_active AS isActive, 'grade' AS tableName,
            gc.id AS gradeCategoryId, gc.name AS gradeCategoryName, COUNT(gws.id) AS isExist
            FROM grade g 
            JOIN grade_category gc ON gc.id = g.grade_category_id 
            LEFT JOIN grade_wise_syllabus gws ON gws.grade_id = g.id`;
            if(gradeCategoryId != "")
            {
                sql = sql + ` WHERE g.grade_category_id = ${gradeCategoryId}`;
                if(action == "Active")
                {
                    sql = sql + ` AND g.is_active = 1`;
                }
            }
            else if(action == "Active")
            {
                sql = sql + ` WHERE g.is_active = 1`;
            }
            sql = sql + ` GROUP BY g.id ORDER BY g.name`;
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

db.getGrade = (id) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT g.id
            FROM grade g 
            WHERE g.id = ${id}`;
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

db.duplicateGrade = (names, gradeCategoryId) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT g.id, gc.name
            FROM grade g 
            JOIN grade_category gc ON gc.id = g.grade_category_id 
            WHERE FIND_IN_SET(g.name, '${names}') > 0 AND g.grade_category_id = ${gradeCategoryId}`;
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

db.insertGrade = (grade) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let nameArray = (grade.names).toString().split(",");
            let sqlValues = "";
            for(let i=0;i<nameArray.length;i++)
            {
                if(sqlValues == '')
                {
                    sqlValues = `('${nameArray[i].toString().trim()}', ${grade.gradeCategoryId}, NOW(), ${grade.createdById})`;
                }
                else
                {
                    sqlValues = sqlValues + `,('${nameArray[i].toString().trim()}', ${grade.gradeCategoryId}, NOW(), ${grade.createdById})`;
                }
            }
            let sql = `INSERT INTO grade (name, grade_category_id, created_on, created_by_id)
            VALUES ${sqlValues}`;
            
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

db.checkGradeExist = (id) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT gws.id AS gradeWiseSyllabusId
            FROM grade_wise_syllabus gws WHERE gws.grade_id = ${id}`;
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

db.deleteGrade = (id, action) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `DELETE FROM grade WHERE id = ${id}`;
           
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

db.getSubjects = (gradeCategoryId, gradeId, syllabusId, action) => 
    {
        return new Promise((resolve, reject) => 
        {
            try
            {
                let filters = "";
                let sql = `SELECT sub.id, sub.name, sub.is_active AS isActive, 'subject' AS tableName,
                gc.id AS gradeCategoryId, gc.name AS gradeCategoryName,
                g.id AS gradeId, g.name AS gradeName,
                s.id AS syllabusId, s.name AS syllabusName,
                afy.id AS applicableFromYearId, afy.year AS applicableFromYear,
                ety.id AS effectiveTillYearId, ety.year AS effectiveTillYear,
                COUNT(c.id) AS isExist
                FROM subject sub
                JOIN syllabus s ON s.id = sub.syllabus_id
                JOIN grade g ON g.id = sub.grade_id
                JOIN grade_category gc ON gc.id = sub.grade_category_id
                JOIN academic_session afy ON afy.id = sub.applicable_from_year_id
                LEFT JOIN academic_session ety ON ety.id = sub.effective_till_year_id
                LEFT JOIN chapter c ON c.subject_id = sub.id`; 

                // GROUP BY sub.id, sub.name, sub.is_active, gc.id, gc.name, g.id, g.name, s.id, s.name, acs.id, acs.year
    
                if(action == 'Active')
                {
                    if(filters == "")
                    {
                        filters = filters + ` WHERE sub.is_active = 1`;
                    }
                    else
                    {
                        filters = filters + ` AND sub.is_active = 1`;
                    }
                }       
                if(parseInt(gradeCategoryId) > 0)
                {
                    if(filters == "")
                    {
                        filters = filters + ` WHERE gc.id = ${gradeCategoryId}`;
                    }
                    else
                    {
                        filters = filters + ` AND gc.id = ${gradeCategoryId}`;
                    }
                }
                if(parseInt(gradeId) > 0)
                {
                    if(filters == "")
                    {
                        filters = filters + ` WHERE g.id = ${gradeId}`;
                    }
                    else
                    {
                        filters = filters + ` AND g.id = ${gradeId}`;
                    }
                }
                if(parseInt(syllabusId) > 0)
                {
                    if(filters == "")
                    {
                        filters = filters + ` WHERE s.id = ${syllabusId}`;
                    }
                    else
                    {
                        filters = filters + ` AND s.id = ${syllabusId}`;
                    }
                }     
                sql = sql + filters + ` GROUP BY sub.id ORDER BY sub.name`;
    
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
    
db.getSubject = (id) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT sub.id, sub.name, sub.is_active AS isActive, 'subject' AS tableName,
            gc.id AS gradeCategoryId, gc.name AS gradeCategoryName,
            g.id AS gradeId, g.name AS gradeName,
            s.id AS syllabusId, s.name AS syllabusName,
            afy.id AS applicableFromYearId, afy.year AS applicableFromYear,
            ety.id AS effectiveTillYearId, ety.year AS effectiveTillYear
            FROM subject sub
            JOIN syllabus s ON s.id = sub.syllabus_id
            JOIN grade g ON g.id = sub.grade_id
            JOIN grade_category gc ON gc.id = sub.grade_category_id
            JOIN academic_session afy ON afy.id = sub.applicable_from_year_id
            LEFT JOIN academic_session ety ON ety.id = sub.effective_till_year_id
            WHERE sub.id = '${id}'`;
            
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

db.duplicateSubject = (gradeCategoryId, gradeId, syllabusId, name, id) =>
{
    return new Promise((resolve,reject) => 
    {
        try
        {
            let sql = "";
            sql = `SELECT sub.id FROM subject sub JOIN syllabus s ON s.id = sub.syllabus_id
            WHERE sub.grade_category_id = ${gradeCategoryId} AND sub.grade_id = ${gradeId} AND
            FIND_IN_SET(sub.syllabus_id, '${syllabusId}') > 0 AND sub.name = '${name}'`;

            if(id != "")
            {
                sql = sql + ` AND sub.id != ${id}`;
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
        }
        catch(e)
        {
            throw e;
        }        
    });
}

db.checkInUseSubjectExist = (id) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT c.id
            FROM chapter c WHERE c.subject_id = ${id}`;
            
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
    
db.insertSubject = (subject) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let syllabusArray = (subject.syllabusIds).toString().split(",");
            let sqlValues = "";
            for(let i=0; i<syllabusArray.length; i++)
            {
                if(sqlValues == '')
                {
                    sqlValues = `('${subject.name}', '${syllabusArray[i].toString().trim()}', ${subject.gradeCategoryId}, ${subject.gradeId}, ${subject.applicableFromYearId}, 
                    NOW(), ${subject.createdById})`;
                }
                else
                {
                    sqlValues = sqlValues + `,('${subject.name}', '${syllabusArray[i].toString().trim()}', 
                    ${subject.gradeCategoryId}, ${subject.gradeId}, ${subject.applicableFromYearId},  NOW(), ${subject.createdById})`;
                }
            }
            let sql = `INSERT INTO subject (name, syllabus_id, grade_category_id, grade_id, applicable_from_year_id, created_on, created_by_id)
            VALUES ${sqlValues}`;
                        
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

db.updateSubject = (subject) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `UPDATE subject SET applicable_From_year_id = ${subject.applicableFromYearId},
            grade_category_id = ${subject.gradeCategoryId}, grade_id = ${subject.gradeId}, syllabus_id = ${subject.syllabusId}, name = '${subject.name}', updated_on = NOW(), updated_by_id = ${subject.createdById} WHERE id = ${subject.id}`;
            
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

db.deleteSubject = (id) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `DELETE FROM subject WHERE id = ${id}`;            
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

db.getChapters = (gradeCategoryId, gradeId, syllabusId, subjectId, action) =>
{
    return new Promise((resolve, reject) =>
    {
        try
        {
            let filters = "";
            let sql = `SELECT c.id, c.name, c.is_active AS isActive, 'chapter' AS tableName,
            gc.id AS gradeCategoryId, gc.name AS gradeCategoryName,
            g.id AS gradeId, g.name AS gradeName,
            s.id AS syllabusId, s.name AS syllabusName,
            sub.id AS subjectId, sub.name AS subjectName, 
            afy.id AS applicableFromYearId, afy.year AS applicableFromYear,
            ety.id AS effectiveTillYearId, ety.year AS effectiveTillYear,
            COUNT(t.id) AS isExist
            FROM chapter c
            JOIN subject sub ON sub.id = c.subject_id
            JOIN grade_category gc ON gc.id = sub.grade_category_id
            JOIN grade g ON g.id = sub.grade_id
            JOIN syllabus s ON s.id = sub.syllabus_id
            JOIN academic_session afy ON afy.id = c.applicable_from_year_id
            LEFT JOIN academic_session ety ON ety.id = c.effective_till_year_id
            LEFT JOIN topic t ON t.chapter_id = c.id`;
            
            if(action == 'Active')
            {
                if(filters == "")
                {
                    filters = filters + ` WHERE c.is_active = 1`;
                }
                else
                {
                    filters = filters + ` AND c.is_active = 1`;
                }
            }
            if(parseInt(gradeCategoryId) > 0)
            {
                if(filters == "")
                {
                    filters = filters + ` WHERE gc.id = ${gradeCategoryId}`;
                }
                else
                {
                    filters = filters + ` AND gc.id = ${gradeCategoryId}`;
                }
            }
            if(parseInt(gradeId) > 0)
            {
                if(filters == "")
                {
                    filters = filters + ` WHERE g.id = ${gradeId}`;
                }
                else
                {
                    filters = filters + ` AND g.id = ${gradeId}`;
                }
            }            
            if(parseInt(syllabusId) > 0)
            {
                if(filters == "")
                {
                    filters = filters + ` WHERE s.id = ${syllabusId}`;
                }
                else
                {
                    filters = filters + ` AND s.id = ${syllabusId}`;
                }
            }
            if(parseInt(subjectId) > 0)
            {
                if(filters == "")
                {
                    filters = filters + ` WHERE sub.id = ${subjectId}`;
                }
                else
                {
                    filters = filters + ` AND sub.id = ${subjectId}`;
                }
            }
            sql = sql + filters + ` GROUP BY c.id ORDER BY c.name`;

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
    });
}; 

db.checkSubjectExist = (id) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = "";
            sql = `SELECT sub.id FROM subject sub WHERE sub.id = ${id}`;
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

db.duplicateChapter = (subjectId, names, id) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sqlValues = '';
            // let nameArray = (names[0].name).trim().split(',');
            // console.log(nameArray)
            if(commonFunction.isJsonArray(names))
            {
                let nameArray = (names[0].name).trim().split(',');
                for(let i = 0; i < nameArray.length; i++)
                {
                    if(sqlValues == "")
                    {
                        sqlValues = "'" + nameArray[i].trim().split(',') + "'";
                    }
                    else
                    {
                        sqlValues = sqlValues + ",'" + nameArray[i].trim().split(',') + "'";
                    }
                }
            }
            else
            {
                sqlValues = "'" + names + "'";
            }

            let sql = `SELECT c.id, acs.year AS applicableFromYear, sub.name AS subjectName
            FROM chapter c
            JOIN academic_session acs ON acs.id = c.applicable_from_year_id
            JOIN subject sub ON sub.id = c.subject_id
            WHERE c.name IN (${sqlValues}) AND c.subject_id = ${subjectId}`;
            //AND c.applicable_from_year_id = ${applicableFromYearId} 

            if(id != "")
            {
                sql = sql + ` AND c.id != ${id}`;
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
        }
        catch(e)
        {
            throw e;
        }
    })
};

db.insertChapter = (chapter) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let nameArray = (chapter.names[0].name).split(',');
            let sqlValues = "";
            for(let i = 0; i < nameArray.length; i++)
            {
                if(sqlValues == '')
                {
                    sqlValues = `('${nameArray[i].trim().split(',')}', '${chapter.applicableFromYearId}', 
                    ${chapter.subjectId}, NOW(), ${chapter.createdById})`;
                }
                else
                {
                    sqlValues = sqlValues + `,('${nameArray[i].trim().split(',')}', '${chapter.applicableFromYearId}', ${chapter.subjectId}, NOW(), ${chapter.createdById})`;
                }
            }
            let sql = `INSERT INTO chapter (name, applicable_from_year_id, subject_id, created_on, created_by_id)
            VALUES ${sqlValues}`;
                        
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

db.updateChapter = (chapter) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `UPDATE chapter SET applicable_from_year_id = ${chapter.applicableFromYearId}, subject_id = ${chapter.subjectId}, name = '${chapter.name}', updated_on = NOW(), updated_by_id = ${chapter.createdById} WHERE id = ${chapter.id}`;
            
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

db.checkInUseChapterExist = (id) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT t.id
            FROM topic t WHERE t.chapter_id = ${id}`;
            
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

db.deleteChapter = (id) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `DELETE FROM chapter WHERE id = ${id}`;            
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





db.checkChapterExist = (id) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT c.id FROM chapter c WHERE c.id = ${id}`;
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
    });
}

db.duplicateTopic = (chapterId, names, id) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sqlValues = '';
            if(commonFunction.isJsonArray(names))
            {
                let nameArray = (names[0].name).trim().split(',');
                for(let i = 0; i < nameArray.length; i++)
                {
                    if(sqlValues == "")
                    {
                        sqlValues = "'" + nameArray[i].trim().split(',') + "'";
                    }
                    else
                    {
                        sqlValues = sqlValues + ",'" + nameArray[i].trim().split(',') + "'";
                    }
                }
            }
            else
            {
                sqlValues = "'" + names + "'";
            }

            let sql = `SELECT t.id, acs.year AS applicableFromYear, c.name AS chapterName
            FROM topic t
            JOIN academic_session acs ON acs.id = t.applicable_from_year_id
            JOIN chapter c ON c.id = t.chapter_id
            WHERE t.name IN (${sqlValues}) AND t.chapter_id = ${chapterId}`;

            if(id != "")
            {
                sql = sql + ` AND t.id != ${id}`;
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
        }
        catch(e)
        {
            throw e;
        }
    })
};

db.insertTopic = (topic) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let nameArray = (topic.names[0].name).split(',');
            let sqlValues = "";
            for(let i = 0; i < nameArray.length; i++)
            {
                if(sqlValues == '')
                {
                    sqlValues = `('${nameArray[i].trim().split(',')}', '${topic.applicableFromYearId}', 
                    ${topic.chapterId}, NOW(), ${topic.createdById})`;
                }
                else
                {
                    sqlValues = sqlValues + `,('${nameArray[i].trim().split(',')}', 
                    '${topic.applicableFromYearId}', ${topic.chapterId}, NOW(), ${topic.createdById})`;
                }
            }
            let sql = `INSERT INTO topic (name, applicable_from_year_id, chapter_id, created_on, 
            created_by_id)
            VALUES ${sqlValues}`;
                        
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
    




db.getChapterWiseTopics = (academicSessionId, syllabusId, gradeCategoryId, gradeId, subjectId, chapterId, action) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let filters = "";
            let sql = `SELECT cwt.id, cwt.name, cwt.is_active AS isActive, 'chapter_wise_topic' AS tableName,
            swc.id AS subjectWiseChapterId, swc.name AS subjectWiseChapterName,
            sws.id AS syllabusWiseSubjectId, sws.name AS syllabusWiseSubjectName, 
            acs.id AS academicSessionId, acs.name AS academicSessionName, 
            gc.id AS gradeCategoryId, gc.name AS gradeCategoryName,
            g.id AS gradeId, g.name AS gradeName,
            s.id AS syllabusId, s.name AS syllabusName,
            sp.id AS schoolingProgramId, sp.name AS schoolingProgramName
            FROM chapter_wise_topic cwt
            JOIN subject_wise_chapter swc ON swc.id = cwt.subject_wise_chapter_id
            JOIN syllabus_wise_subject sws ON sws.id = swc.syllabus_wise_subject_id
            JOIN grade_wise_syllabus gws ON gws.id = sws.grade_wise_syllabus_id 
            JOIN academic_session acs ON acs.id = cwt.academic_session_id 
            JOIN grade g ON g.id = gws.grade_id
            JOIN grade_category gc ON gc.id = g.grade_category_id
            JOIN syllabus s ON s.id = gws.syllabus_id 
            JOIN schooling_program sp ON sp.id = s.schooling_program_id`;
            if(action == "Active")
            {
                if(filters == "")
                {
                    filters =filters + ` WHERE cwt.is_active = 1`;
                }
                else
                {
                    filters =filters + ` AND cwt.is_active = 1`;
                }
            }
            if(parseInt(academicSessionId) > 0)
            {
                if(filters == "")
                {
                    filters =filters + ` WHERE acs.id = ${academicSessionId}`;
                }
                else
                {
                    filters =filters + ` AND acs.id = ${academicSessionId}`;
                }
            }
            if(parseInt(syllabusId) > 0)
            {
                if(filters == "")
                {
                    filters =filters + ` WHERE s.id = ${syllabusId}`;
                }
                else
                {
                    filters =filters + ` AND s.id = ${syllabusId}`;
                }
            }            
            if(parseInt(gradeCategoryId) > 0)
            {
                if(filters == "")
                {
                    filters =filters + ` WHERE gc.id = ${gradeCategoryId}`;
                }
                else
                {
                    filters =filters + ` AND gc.id = ${gradeCategoryId}`;
                }
            }
            if(parseInt(gradeId) > 0)
            {
                if(filters == "")
                {
                    filters =filters + ` WHERE g.id = ${gradeId}`;
                }
                else
                {
                    filters =filters + ` AND g.id = ${gradeId}`;
                }
            }
            if(parseInt(subjectId) > 0)
            {
                if(filters == "")
                {
                    filters =filters + ` WHERE sws.id = ${subjectId}`;
                }
                else
                {
                    filters =filters + ` AND sws.id = ${subjectId}`;
                }
            }
            if(parseInt(chapterId) > 0)
            {
                if(filters == "")
                {
                    filters =filters + ` WHERE swc.id = ${chapterId}`;
                }
                else
                {
                    filters =filters + ` AND swc.id = ${chapterId}`;
                }
            }
            sql = sql + filters + ` ORDER BY swc.name`;
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

db.duplicateChapterWiseTopic = (academicSessionId, subjectWiseChapterId, name, id) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = "";
            sql = `SELECT cwt.id
            FROM chapter_wise_topic cwt 
            WHERE cwt.academic_session_id = ${academicSessionId}
                AND cwt.subject_wise_chapter_id = ${subjectWiseChapterId} 
                AND cwt.name = '${name}'`;
            if(id != "")
            {
                sql = sql + ` AND cwt.id != ${id}`;
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
        }
        catch(e)
        {
            throw e;
        }
    })
};

db.insertChapterWiseTopic = (ChapterWiseTopic) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `INSERT INTO chapter_wise_topic (academic_session_id, subject_wise_chapter_id, name, created_on, created_by_id)
            VALUES(${ChapterWiseTopic.academicSessionId}, ${ChapterWiseTopic.subjectWiseChapterId}, '${ChapterWiseTopic.name}', NOW(), ${ChapterWiseTopic.createdById})`;
            
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

db.insertMultipleTopic = (topicData, academicSessionId, chapterId, createdById) => 
{
    let sqlValues = '';
    for(let i=0;i<topicData.length;i++)
    {
        sqlValues = sqlValues == '' ? `(${academicSessionId}, ${chapterId}, '${topicData[i].name}', NOW(), ${createdById})` : `${sqlValues}, (${academicSessionId}, ${chapterId}, '${topicData[i].name}', NOW(), ${createdById})`;
    }
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `INSERT INTO chapter_wise_topic (academic_session_id, subject_wise_chapter_id, name, created_on, created_by_id)
            VALUES ${sqlValues}`;

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

db.updateChapterWiseTopic = (chapterWiseTopic) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `UPDATE chapter_wise_topic SET academic_session_id = ${chapterWiseTopic.academicSessionId}, subject_wise_chapter_id = ${chapterWiseTopic.subjectWiseChapterId}, name = '${chapterWiseTopic.name}', updated_on = NOW(), updated_by_id = ${chapterWiseTopic.createdById} WHERE id = ${chapterWiseTopic.id}`;
            
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

db.deleteChapterWiseTopic = (id) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `DELETE FROM chapter_wise_topic WHERE id = ${id}`;            
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

db.getSchoolingGroups = (action) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT sg.id, sg.name, sg.is_active AS isActive, 'schooling_group' AS tableName, 
            COUNT(s.id) AS isExist
            FROM schooling_group sg 
            LEFT JOIN school s ON s.schooling_group_id = sg.id`;
            if(action == "Active")
            {
                sql = sql + ` WHERE sg.is_active = 1`;
            }
            sql = sql + ` GROUP BY sg.id 
            ORDER BY sg.name`;
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

db.duplicateSchoolingGroup = (name) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT sg.id, sg.name
            FROM schooling_group sg 
            WHERE sg.name = '${name}'`;
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

db.insertSchoolingGroup = (schoolingGroup) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `INSERT INTO schooling_group (name, created_on, created_by_id)
            VALUES('${schoolingGroup.name}', NOW(), ${schoolingGroup.createdById})`;
            
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

db.checkSchoolingGroupExist = (id) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT s.id AS schoolId
            FROM school s WHERE s.schooling_group_id = ${id}`;
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

db.deleteSchoolingGroup = (id) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `DELETE FROM schooling_group WHERE id = ${id}`;
                        
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

db.getSchoolingCategories = (action) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT sc.id, sc.name, sc.is_active AS isActive, 'schooling_category' AS tableName, 
            COUNT(sp.id) AS isExist
            FROM schooling_category sc 
            LEFT JOIN schooling_program sp ON sp.schooling_category_id = sc.id`;
            if(action == "Active")
            {
                sql = sql + ` WHERE sc.is_active = 1`;
            }
            sql = sql + ` GROUP BY sc.id 
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

db.getSchoolingCategory = (id) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT sc.id, sc.name, sc.is_active AS isActive
            FROM schooling_category sc WHERE sc.id = ${id}`;
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

db.duplicateSchoolingCategory = (name) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT sc.id, sc.name
            FROM schooling_category sc 
            WHERE sc.name = '${name}'`;
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

db.insertSchoolingCategory = (schoolingCategory) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `INSERT INTO schooling_category (name, created_on, created_by_id)
            VALUES('${schoolingCategory.name}', NOW(), ${schoolingCategory.createdById})`;
            
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

db.checkSchoolingCategoryExist = (id) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT sp.id AS schoolingProgramId
            FROM schooling_program sp WHERE sp.schooling_category_id = ${id}`;
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

db.deleteSchoolingCategory = (id) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `DELETE FROM schooling_category WHERE id = ${id}`;
                        
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

db.getSchoolSubGroups = (action) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT ssg.id, ssg.name, ssg.is_active AS isActive, 'school_sub_group' AS tableName, 
            COUNT(s.id) AS isExist
            FROM school_sub_group ssg 
            LEFT JOIN school s ON s.school_sub_group_id = ssg.id`;
            if(action == "Active")
            {
                sql = sql + ` WHERE ssg.is_active = 1`;
            }
            sql = sql + ` GROUP BY ssg.id 
            ORDER BY ssg.name`;
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

db.getSchoolSubGroup = (id) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT ssg.id            
            FROM school_sub_group ssg WHERE ssg.id = ${id}`;
            
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

db.duplicateSchoolSubGroup = (name) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT ssg.id, ssg.name
            FROM school_sub_group ssg 
            WHERE ssg.name = '${name}'`;
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

db.insertSchoolSubGroup = (schoolSubGroup) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `INSERT INTO school_sub_group (name, created_on, created_by_id)
            VALUES('${schoolSubGroup.name}', NOW(), ${schoolSubGroup.createdById})`;
            
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

db.checkSchoolSubGroupExist = (id) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT s.id AS schoolId
            FROM school s WHERE s.school_sub_group_id = ${id}`;
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

db.deleteSchoolSubGroup = (id) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `DELETE FROM school_sub_group WHERE id = ${id}`;
                        
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


db.getBatchTypes = (academicSessionId, action) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT bt.id, bt.name, bt.start_time AS startTime, bt.end_time AS endTime, bt.is_active AS isActive, 'batch_type' AS tableName, 
            acs.id AS academicSessionId, acs.year AS academicSessionYear, acs.batch_year AS batchYear,
            COUNT(sspd.id) AS isExist
            FROM batch_type bt 
            JOIN academic_session acs ON acs.id = bt.applicable_from_year_id
            LEFT JOIN school_schooling_program_detail sspd ON FIND_IN_SET(bt.id, sspd.batch_type_ids) > 0`;
            if(academicSessionId != "")
            {
                sql = sql + ` WHERE bt.applicable_from_year_id = ${academicSessionId}`;
                if(action == "Active")
                {
                    sql = sql + ` AND bt.is_active = 1`;
                }
            }
            else if(action == "Active")
            {
                sql = sql + ` WHERE bt.is_active = 1`;
            }
            sql = sql + ` GROUP BY bt.id 
            ORDER BY bt.name`;
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

db.getBatchType = (id) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT bt.id            
            FROM batch_type bt WHERE bt.id = ${id}`;
            
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

db.duplicateBatchType = (name, academicSessionId, id) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT bt.id, bt.name
            FROM batch_type bt 
            WHERE bt.name = '${name}' AND bt.applicable_from_year_id = ${academicSessionId}`;
            if(id != "")
            {
                sql = sql + ` AND bt.id != ${id}`
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

db.insertBatchType = (batchType) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `INSERT INTO batch_type (name, start_time, end_time, applicable_from_year_id, created_on, created_by_id)
            VALUES('${batchType.name}', '${batchType.startTime}', '${batchType.endTime}', ${batchType.academicSessionId}, NOW(), ${batchType.createdById})`;
            
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

db.updateBatchType = (batchType) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `UPDATE batch_type SET name= '${batchType.name}', start_time = '${batchType.startTime}', end_time = '${batchType.endTime}', applicable_from_year_id = ${batchType.academicSessionId}, updated_on = NOW(), updated_by_id = ${batchType.createdById} WHERE id = ${batchType.id}`;
            
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

db.checkBatchTypeExist = (id) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT sspd.id AS schoolingProgramDetailId
            FROM school_schooling_program_detail sspd WHERE FIND_IN_SET(${id}, sspd.batch_type_ids) > 0`;
           
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

db.deleteBatchType = (id) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `DELETE FROM batch_type WHERE id = ${id}`;
                        
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