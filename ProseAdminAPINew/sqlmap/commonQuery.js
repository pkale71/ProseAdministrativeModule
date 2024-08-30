let dbConn = require('../util/dbConnection');
const commonFunction = require('../util/commonFunctions');
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
db.getSchoolingPrograms = (academicSessionId, action) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT sp.id AS schoolingProgramId, sp.name AS schoolingProgramName, sp.is_active AS isActive, 'schooling_program' AS tableName,
            ac.id AS academicSessionId, ac.name AS academicSessionName, COUNT(s.id) AS isExist
            FROM schooling_program sp 
            JOIN academic_session ac ON ac.id = sp.academic_session_id 
            LEFT JOIN syllabus s ON s.schooling_program_id = sp.id`;
            if(academicSessionId != "")
            {
                sql = sql + ` WHERE sp.academic_session_id = ${academicSessionId}`;
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

db.getSchoolingProgram = (id, academicSessionId) => 
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

db.duplicateSchoolingProgram = (name, academicSessionId) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT sp.id AS schoolingProgramId
            FROM schooling_program sp WHERE sp.name = '${name}' AND sp.academic_session_id = ${academicSessionId}`;
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
            let sql = `SELECT s.id AS syllabusId
            FROM syllabus s WHERE s.schooling_program_id = ${id}`;
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
            let sql = `INSERT INTO schooling_program (name, academic_session_id, created_on, created_by_id)
            VALUES('${schoolingProgram.name}', ${schoolingProgram.academicSessionId}, NOW(), ${schoolingProgram.createdById})`;
            
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
            WHERE s.id = ${id}`;
           
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
            let sql = `SELECT acs.id, acs.name, acs.start_date AS startDate, acs.end_date AS endDate, 
            acs.is_admission_open AS isAdmissionOpen, acs.is_current_session AS isCurrentSession, COUNT(sp.id) AS isExist
            FROM academic_session acs 
            LEFT JOIN schooling_program sp ON sp.academic_session_id = acs.id
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

db.duplicateAcademicSession = (name) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT acs.id, acs.name
            FROM academic_session acs 
            WHERE acs.name = '${name}'`;
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

db.insertAcademicSession = (academicSession) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `INSERT INTO academic_session (name, start_date, end_date, is_admission_open, is_current_session, created_on, created_by_id)
            VALUES('${academicSession.name}', '${academicSession.startDate}', '${academicSession.endDate}', ${academicSession.isAdmissionOpen}, ${academicSession.isCurrentSession}, NOW(), ${academicSession.createdById})`;
            
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

db.updateAcademicSession = (academicSession) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `UPDATE academic_session set name = '${academicSession.name}', start_date = '${academicSession.startDate}', end_date = '${academicSession.endDate}', is_admission_open = ${academicSession.isAdmissionOpen}, is_current_session = ${academicSession.isCurrentSession}, modify_on = NOW(), modify_by_id = ${academicSession.modifyById} WHERE id = ${academicSession.id}`;
            
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

db.checkAcademicSessionExist = (id) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT gws.id AS gradeWiseSyllabusId
            FROM grade_wise_syllabus gws WHERE gws.academic_session_id = ${id}`;
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

db.getGradeWiseSyllabuses = (academicSessionId, gradeCategoryId, gradeId, action) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT gws.id, gws.is_active AS isActive, 'grade_wise_syllabus' AS tableName,
            acs.id AS academicSessionId, acs.name AS academicSessionName, 
            sp.id AS schoolingProgramId, sp.name AS schoolingProgramName,
            gc.id AS gradeCategoryId, gc.name AS gradeCategoryName,
            g.id AS gradeId, g.name AS gradeName,
            s.id AS syllabusId, s.name AS syllabusName, COUNT(sws.id) AS isExist
            FROM grade_wise_syllabus gws
            JOIN academic_session acs ON acs.id = gws.academic_session_id  
            JOIN grade g ON g.id = gws.grade_id
            JOIN grade_category gc ON gc.id = g.grade_category_id
            JOIN syllabus s ON s.id = gws.syllabus_id 
            JOIN schooling_program sp ON sp.id = s.schooling_program_id
            LEFT JOIN syllabus_wise_subject sws ON sws.grade_wise_syllabus_id = gws.id`;
            if(parseInt(academicSessionId) > 0)
            {
                sql =sql + ` WHERE acs.id = ${academicSessionId}`;
                if(parseInt(gradeId) > 0)
                {
                    sql =sql + ` AND g.id = ${gradeId}`;
                }
                if(parseInt(gradeCategoryId) > 0)
                {
                    sql =sql + ` AND gc.id = ${gradeCategoryId}`;
                }
                if(action == "Active")
                {
                    sql =sql + ` AND gws.is_active = 1`;
                }
            }
            else
            {
                if(parseInt(gradeId) > 0)
                {
                    sql =sql + ` WHERE g.id = ${gradeId}`;
                    if(parseInt(gradeCategoryId) > 0)
                    {
                        sql =sql + ` AND gc.id = ${gradeCategoryId}`;
                    }
                    if(action == "Active")
                    {
                        sql =sql + ` AND gws.is_active = 1`;
                    }
                }
                else if(parseInt(gradeCategoryId) > 0)
                {
                    sql =sql + ` WHERE gc.id = ${gradeCategoryId}`;
                    if(action == "Active")
                    {
                        sql =sql + ` AND gws.is_active = 1`;
                    }
                }
                else if(action == "Active")
                {
                    sql =sql + ` WHERE gws.is_active = 1`;
                }
            }
            sql = sql + ` GROUP BY gws.id ORDER BY s.name`;

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

db.getGradeWiseSyllabus = (academicSessionId, gradeId, syllabusId) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT gws.id, gws.is_active AS isActive, 'grade_wise_syllabus' AS tableName,
            acs.id AS academicSessionId, acs.name AS academicSessionName, 
            g.id AS gradeId, g.name AS gradeName,
            s.id AS syllabusId, s.name AS syllabusName
            FROM grade_wise_syllabus gws
            JOIN academic_session acs ON acs.id = gws.academic_session_id 
            JOIN grade g ON g.id = gws.grade_id
            JOIN syllabus s ON s.id = gws.syllabus_id 
            WHERE acs.id = ${academicSessionId} AND g.id = ${gradeId} AND s.id = ${syllabusId}`;

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

db.duplicateGradeWiseSyllabus = (academicSessionId, gradeId, syllabusId, id = '') => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT gws.id
            FROM grade_wise_syllabus gws 
            WHERE gws.academic_session_id = ${academicSessionId}
            AND gws.grade_id = ${gradeId} AND gws.syllabus_id = ${syllabusId}`;
            if(id != '')
            {
                sql = sql + ` AND gws.id != ${id}`;
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

db.insertGradeWiseSyllabus = (gradeWiseSyllabus) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `INSERT INTO grade_wise_syllabus (academic_session_id, grade_id, syllabus_id, created_on, created_by_id)
            VALUES(${gradeWiseSyllabus.academicSessionId}, ${gradeWiseSyllabus.gradeId}, ${gradeWiseSyllabus.syllabusId}, NOW(), ${gradeWiseSyllabus.createdById})`;
            
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

db.checkGradeWiseSyllabusExist = (id) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT sws.id AS syllabusWiseSubjectId
            FROM syllabus_wise_subject sws WHERE sws.grade_wise_syllabus_id = ${id}`;
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

db.updateGradeWiseSyllabus = (gradeWiseSyllabus) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `UPDATE grade_wise_syllabus SET academic_session_id = ${gradeWiseSyllabus.academicSessionId}, grade_id = ${gradeWiseSyllabus.gradeId}, syllabus_id = ${gradeWiseSyllabus.syllabusId}, updated_on = NOW(), updated_by_id = ${gradeWiseSyllabus.createdById} WHERE id = ${gradeWiseSyllabus.id}`;
            
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

db.deleteGradeWiseSyllabus = (id) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `DELETE FROM grade_wise_syllabus WHERE id = ${id}`;            
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

db.getSyllabusWiseSubjects = (academicSessionId, syllabusId, gradeCategoryId, gradeId, action) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let filters = "";
            let sql = `SELECT sws.id, sws.name, sws.is_active AS isActive, 'syllabus_wise_subject' AS tableName,
            acs.id AS academicSessionId, acs.name AS academicSessionName, 
            gc.id AS gradeCategoryId, gc.name AS gradeCategoryName,
            g.id AS gradeId, g.name AS gradeName,
            s.id AS syllabusId, s.name AS syllabusName, 
            sp.id AS schoolingProgramId, sp.name AS schoolingProgramName,
            COUNT(swc.id) AS isExist
            FROM syllabus_wise_subject sws
            JOIN grade_wise_syllabus gws ON gws.id = sws.grade_wise_syllabus_id 
            JOIN academic_session acs ON acs.id = sws.academic_session_id 
            JOIN grade g ON g.id = gws.grade_id
            JOIN grade_category gc ON gc.id = g.grade_category_id
            JOIN syllabus s ON s.id = gws.syllabus_id  
            JOIN schooling_program sp ON sp.id = s.schooling_program_id
            LEFT JOIN subject_wise_chapter swc ON swc.syllabus_wise_subject_id = sws.id`;
            if(action == 'Active')
            {
                if(filters == "")
                {
                    filters =filters + ` WHERE sws.is_active = 1`;
                }
                else
                {
                    filters =filters + ` AND sws.is_active = 1`;
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
            sql = sql + filters + ` GROUP BY sws.id ORDER BY sws.name`;

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

db.duplicateSyllabusWiseSubject = (academicSessionId, gradeId, syllabusId, name, id) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = "";
            sql = `SELECT sws.id
            FROM syllabus_wise_subject sws 
            JOIN grade_wise_syllabus gws ON gws.id = sws.grade_wise_syllabus_id
            WHERE gws.academic_session_id = ${academicSessionId}
                AND gws.grade_id = ${gradeId} AND gws.syllabus_id = ${syllabusId} 
                AND sws.name = '${name}'`;
            if(id != "")
            {
                sql = sql + ` AND sws.id != ${id}`;
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

db.checkSyllabusWiseSubjectExist = (id) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT sws.id
            FROM syllabus_wise_subject sws WHERE sws.id = ${id}`;
            
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

db.checkInUseSyllabusWiseSubjectExist = (id) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT swc.id
            FROM subject_wise_chapter swc WHERE swc.syllabus_wise_subject_id = ${id}`;
            
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

db.insertSyllabusWiseSubject = (syllabusWiseSubject) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `INSERT INTO syllabus_wise_subject (academic_session_id, grade_wise_syllabus_id, name, created_on, created_by_id)
            VALUES(${syllabusWiseSubject.academicSessionId}, ${syllabusWiseSubject.gradeWiseSyllabusId}, '${syllabusWiseSubject.name}', NOW(), ${syllabusWiseSubject.createdById})`;
            
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

db.updateSyllabusWiseSubject = (syllabusWiseSubject) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `UPDATE syllabus_wise_subject SET academic_session_id = ${syllabusWiseSubject.academicSessionId}, grade_wise_syllabus_id = ${syllabusWiseSubject.gradeWiseSyllabusId}, name = '${syllabusWiseSubject.name}', updated_on = NOW(), updated_by_id = ${syllabusWiseSubject.createdById} WHERE id = ${syllabusWiseSubject.id}`;
            
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

db.deleteSyllabusWiseSubject = (id) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `DELETE FROM syllabus_wise_subject WHERE id = ${id}`;            
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

db.getSubjectWiseChapters = (academicSessionId, syllabusId, gradeCategoryId, gradeId, subjectId, action) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let filters = "";
            let sql = `SELECT swc.id, swc.name, swc.is_active AS isActive, 'subject_wise_chapter' AS tableName,
            sws.id AS syllabusWiseSubjectId, sws.name AS syllabusWiseSubjectName, 
            acs.id AS academicSessionId, acs.name AS academicSessionName, 
            gc.id AS gradeCategoryId, gc.name AS gradeCategoryName,
            g.id AS gradeId, g.name AS gradeName,
            s.id AS syllabusId, s.name AS syllabusName, 
            sp.id AS schoolingProgramId, sp.name AS schoolingProgramName,
            COUNT(cwt.id) AS isExist
            FROM subject_wise_chapter swc
            JOIN syllabus_wise_subject sws ON sws.id = swc.syllabus_wise_subject_id
            JOIN grade_wise_syllabus gws ON gws.id = sws.grade_wise_syllabus_id 
            JOIN academic_session acs ON acs.id = swc.academic_session_id 
            JOIN grade g ON g.id = gws.grade_id
            JOIN grade_category gc ON gc.id = g.grade_category_id
            JOIN syllabus s ON s.id = gws.syllabus_id 
            JOIN schooling_program sp ON sp.id = s.schooling_program_id
            LEFT JOIN chapter_wise_topic cwt ON cwt.subject_wise_chapter_id = swc.id`;
            if(action == 'Active')
            {
                if(filters == "")
                {
                    filters =filters + ` WHERE swc.is_active = 1`;
                }
                else
                {
                    filters =filters + ` AND swc.is_active = 1`;
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
            sql = sql + filters + ` GROUP BY swc.id ORDER BY swc.name`;

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

db.checkSubjectWiseChapterExist = (id) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = "";
            sql = `SELECT swc.id
            FROM subject_wise_chapter swc 
            WHERE swc.id = ${id}`;
            
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
    
    
db.duplicateSubjectWiseChapter = (academicSessionId, syllabusWiseSubjectId, name, id) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = "";
            sql = `SELECT swc.id
            FROM subject_wise_chapter swc 
            WHERE swc.academic_session_id = ${academicSessionId}
                AND swc.syllabus_wise_subject_id = ${syllabusWiseSubjectId} 
                AND swc.name = '${name}'`;
            if(id != "")
            {
                sql = sql + ` AND swc.id != ${id}`;
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

db.insertSubjectWiseChapter = (subjectWiseChapter) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `INSERT INTO subject_wise_chapter (academic_session_id, syllabus_wise_subject_id, name, created_on, created_by_id)
            VALUES(${subjectWiseChapter.academicSessionId}, ${subjectWiseChapter.syllabusWiseSubjectId}, '${subjectWiseChapter.name}', NOW(), ${subjectWiseChapter.createdById})`;
            
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

db.updateSubjectWiseChapter = (subjectWiseChapter) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `UPDATE subject_wise_chapter SET academic_session_id = ${subjectWiseChapter.academicSessionId}, syllabus_wise_subject_id = ${subjectWiseChapter.syllabusWiseSubjectId}, name = '${subjectWiseChapter.name}', updated_on = NOW(), updated_by_id = ${subjectWiseChapter.createdById} WHERE id = ${subjectWiseChapter.id}`;
            
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

db.checkInUseSubjectWiseChapterExist = (id) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT cwt.id
            FROM chapter_wise_topic cwt WHERE cwt.subject_wise_chapter_id = ${id}`;
            
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

db.deleteSubjectWiseChapter = (id) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `DELETE FROM subject_wise_chapter WHERE id = ${id}`;            
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

module.exports = db