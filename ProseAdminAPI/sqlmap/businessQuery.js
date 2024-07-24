let dbConn = require('../util/dbConnection');
const commonFunction = require('../util/commonFunctions');
const { businessPartner } = require('../business/buildBusinessJSONs');
let db = {};

db.checkDuplicateEmailMobile = (email, mobile, tableName, id) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT id
            FROM ${tableName} 
            WHERE (email = '${email}' OR mobile = '${mobile}')`;
            if(id != "")
            {
                if(!isNaN(id))
                {
                    sql = sql + ` AND id != ${id}`; 
                }
                else
                {
                    sql = sql + ` AND uuid != '${id}'`; 
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

db.getBusinessPartnerTypes = () => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT bpt.id, bpt.name, bpt.code
            FROM business_partner_type bpt 
            ORDER BY bpt.name`;
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

db.getBusinessPartnerType = (id) => 
    {
        return new Promise((resolve, reject) => 
        {
            try
            {
                let sql = `SELECT bpt.id, bpt.name, bpt.code
                FROM business_partner_type bpt 
                WHERE bpt.id = ${id}`;
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

db.getCommissionTerms = () => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT ct.id, ct.name
            FROM commission_term ct 
            ORDER BY ct.name`;
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

db.getCommissionTerm = (id) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT ct.id, ct.name
            FROM commission_term ct 
            WHERE ct.id = ${id}`;
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

db.getCommercialTerms = () => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT ct.id, ct.name
            FROM commercial_term ct 
            ORDER BY ct.name`;
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

db.getCommercialTerm = (id) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT ct.id, ct.name
            FROM commercial_term ct 
            WHERE ct.id = ${id}`;
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

db.getStudyCenterRewardTypes = () => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT scrt.id, scrt.name
            FROM study_center_reward_type scrt 
            ORDER BY scrt.name`;
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

db.getStudyCenterRewardType = (id) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT scrt.id, scrt.name
            FROM study_center_reward_type scrt 
            WHERE scrt.id = ${id}`;
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

db.getStudyCenterTypes = () => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT sct.id, sct.name
            FROM study_center_type sct 
            ORDER BY sct.name`;
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

db.getStudyCenterType = (id) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT sct.id, sct.name
            FROM study_center_type sct 
            WHERE sct.id = ${id}`;
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

db.getBusinessVerticals = (action) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT bv.id, bv.name, bv.is_active AS isActive, 'business_vertical' AS tableName, COUNT(bvg.id) AS isExist
            FROM business_vertical bv 
            LEFT JOIN business_vertical_group bvg ON bvg.business_vertical_id = bv.id`;
            if(action == "Active")
            {
                sql = sql + ' WHERE bv.is_active = 1';
            }
            sql = sql + ` GROUP BY bv.id
            ORDER BY bv.name`;
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

db.getBusinessVertical = (id) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT bv.id, bv.name
            FROM business_vertical bv 
            WHERE bv.id = ${id}`
            
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

db.duplicateBusinessVertical = (name, id) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT bv.id, bv.name
            FROM business_vertical bv 
            WHERE bv.name = '${name}'`;
            if(id != "")
            {
                sql =sql + ` AND bv.id != ${id}`
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

db.insertBusinessVertical = (businessVertical) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `INSERT INTO business_vertical (name, created_on, created_by_id)
            VALUES('${businessVertical.name}', NOW(), ${businessVertical.createdById})`;
            
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

db.updateBusinessVertical = (businessVertical) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `UPDATE business_vertical SET name = '${businessVertical.name}', updated_on = NOW(), 
            updated_by_id = ${businessVertical.createdById} 
            WHERE id = ${businessVertical.id}`;
            
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

db.checkBusinessVerticalExist = (id) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT bvg.id AS businessVerticalGroupId
            FROM business_vertical_group bvg WHERE bvg.business_vertical_id = ${id}`;
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

db.deleteBusinessVertical = (id) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `DELETE FROM business_vertical WHERE id = ${id}`;
            
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

db.getBusinessVerticalGroups = (businessVerticalId, action) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT bvg.id, bvg.name, bvg.is_active AS isActive, 'business_vertical_group' AS tableName, COUNT(bvt.id) AS isExist,
            bv.id AS businessVerticalId, bv.name AS businessVerticalName
            FROM business_vertical_group bvg 
            JOIN business_vertical bv ON bv.id = bvg.business_vertical_id
            LEFT JOIN business_vertical_type bvt ON bvt.business_vertical_group_id = bvg.id`;
            if(businessVerticalId != "")
            {
                sql = sql + ` WHERE bvg.business_vertical_id = ${businessVerticalId}`
                if(action == "Active")
                {
                    sql = sql + ` AND bvg.is_active = 1`
                }
            }
            else if(action == "Active")
            {
                sql = sql + ` WHERE bvg.is_active = 1`
            }
            sql = sql + ` GROUP BY bvg.id
            ORDER BY bvg.name`;
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

db.getBusinessVerticalGroup = (id) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT bvg.id, bvg.name
            FROM business_vertical_group bvg 
            WHERE bvg.id = ${id}`
            
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

db.duplicateBusinessVerticalGroup = (names, businessVerticalId, id) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sqlValues = '';
            if(commonFunction.isJsonArray(names))
            {
                for(let i=0;i<names.length;i++)
                {
                    if(sqlValues == "")
                    {
                        sqlValues = "'" + names[i].name + "'";
                    }
                    else
                    {
                        sqlValues = sqlValues + ",'" + names[i].name + "'";
                    }
                }
            }
            else
            {
                sqlValues = "'" + names + "'";
            }
            let sql = `SELECT bvg.id, bv.name AS businessVerticalName
            FROM business_vertical_group bvg 
            JOIN business_vertical bv ON bv.id = bvg.business_vertical_id
            WHERE bvg.name IN (${sqlValues}) AND bvg.business_vertical_id = ${businessVerticalId}`;
            if(id != "")
            {
                sql =sql + ` AND bvg.id != ${id}`
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

db.insertBusinessVerticalGroup = (businessVerticalGroup) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sqlValues = '';
            for(let i=0;i<businessVerticalGroup.names.length;i++)
            {
                if(sqlValues == '')
                {
                    sqlValues = `('${businessVerticalGroup.names[i].name}', ${businessVerticalGroup.businessVerticalId}, NOW(), ${businessVerticalGroup.createdById})`;
                }
                else
                {
                    sqlValues = sqlValues + `,('${businessVerticalGroup.names[i].name}', ${businessVerticalGroup.businessVerticalId}, NOW(), ${businessVerticalGroup.createdById})`;
                }
            }            
            let sql = `INSERT INTO business_vertical_group (name, business_vertical_id, created_on, created_by_id)
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

db.updateBusinessVerticalGroup = (businessVerticalGroup) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `UPDATE business_vertical_group SET name = '${businessVerticalGroup.name}', business_vertical_id = ${businessVerticalGroup.businessVerticalId}, updated_on = NOW(), 
            updated_by_id = ${businessVerticalGroup.createdById} 
            WHERE id = ${businessVerticalGroup.id}`;
            
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

db.checkBusinessVerticalGroupExist = (id) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT bvt.id AS businessVerticalTypeId
            FROM business_vertical_type bvt WHERE bvt.business_vertical_group_id = ${id}`;
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

db.deleteBusinessVerticalGroup = (id) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `DELETE FROM business_vertical_group WHERE id = ${id}`;
            
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

db.getBusinessVerticalTypes = (businessVerticalId, businessVerticalGroupId, action) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT bvt.id, bvt.name, bvt.is_active AS isActive, 'business_vertical_type' AS tableName, COUNT(c.id) AS isExist,
            bv.id AS businessVerticalId, bv.name AS businessVerticalName, 
            bvg.id AS businessVerticalGroupId, bvg.name AS businessVerticalGroupName
            FROM business_vertical_type bvt 
            JOIN business_vertical bv ON bv.id = bvt.business_vertical_id
            JOIN business_vertical_group bvg ON bvg.id = bvt.business_vertical_group_id
            LEFT JOIN coach c ON c.business_vertical_type_id = bvt.id`;
            if(businessVerticalId != "")
            {
                sql = sql + ` WHERE bvt.business_vertical_id = ${businessVerticalId}`
                if(businessVerticalGroupId != "")
                {
                    sql = sql + ` AND bvt.business_vertical_group_id = ${businessVerticalGroupId}`
                }
                if(action == "Active")
                {
                    sql = sql + ` AND bvt.is_active = 1`
                }
            }
            else if(businessVerticalGroupId != "")
            {
                sql = sql + ` WHERE bvt.business_vertical_group_id = ${businessVerticalGroupId}`
                if(action == "Active")
                {
                    sql = sql + ` AND bvt.is_active = 1`
                }
            }
            else if(action == "Active")
            {
                sql = sql + ` WHERE bvt.is_active = 1`
            }
            sql = sql + ` GROUP BY bvt.id
            ORDER BY bvt.name`;
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

db.getBusinessVerticalType = (id) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT bvt.id, bvt.name, bvt.is_active AS isActive, 'business_vertical_type' AS tableName, COUNT(c.id) AS isExist,
            bv.id AS businessVerticalId, bv.name AS businessVerticalName, 
            bvg.id AS businessVerticalGroupId, bvg.name AS businessVerticalGroupName
            FROM business_vertical_type bvt 
            JOIN business_vertical bv ON bv.id = bvt.business_vertical_id
            JOIN business_vertical_group bvg ON bvg.id = bvt.business_vertical_group_id
            LEFT JOIN coach c ON c.business_vertical_type_id = bvt.id WHERE bvt.id IN (${id}) 
            GROUP BY bvt.id`;
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

db.duplicateBusinessVerticalType = (names, businessVerticalId, businessVerticalGroupId, id) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sqlValues = '';
            if(commonFunction.isJsonArray(names))
            {
                for(let i=0;i<names.length;i++)
                {
                    if(sqlValues == "")
                    {
                        sqlValues = "'" + names[i].name + "'";
                    }
                    else
                    {
                        sqlValues = sqlValues + ",'" + names[i].name + "'";
                    }
                }
            }
            else
            {
                sqlValues = "'" + names + "'";
            }
            let sql = `SELECT bvt.id, bv.name AS businessVerticalName, bvg.name AS businessVerticalGroupName
            FROM business_vertical_type bvt 
            JOIN business_vertical bv ON bv.id = bvt.business_vertical_id
            JOIN business_vertical_group bvg ON bvg.id = bvt.business_vertical_group_id
            WHERE bvt.name IN (${sqlValues}) AND bvt.business_vertical_id = ${businessVerticalId} AND bvt.business_vertical_group_id = ${businessVerticalGroupId}`;
            if(id != "")
            {
                sql = sql + ` AND bvt.id != ${id}`
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

db.insertBusinessVerticalType = (businessVerticalType) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sqlValues = '';
            for(let i=0;i<businessVerticalType.names.length;i++)
            {
                if(sqlValues == '')
                {
                    sqlValues = `('${businessVerticalType.names[i].name}', ${businessVerticalType.businessVerticalId}, ${businessVerticalType.businessVerticalGroupId}, NOW(), ${businessVerticalType.createdById})`;
                }
                else
                {
                    sqlValues = sqlValues + `,('${businessVerticalType.names[i].name}', ${businessVerticalType.businessVerticalId}, ${businessVerticalType.businessVerticalGroupId}, NOW(), ${businessVerticalType.createdById})`;
                }
            }
            let sql = `INSERT INTO business_vertical_type (name, business_vertical_id, business_vertical_group_id, created_on, created_by_id)
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

db.updateBusinessVerticalType = (businessVerticalType) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `UPDATE business_vertical_type SET name = '${businessVerticalType.name}', business_vertical_id = ${businessVerticalType.businessVerticalId}, business_vertical_group_id = ${businessVerticalType.businessVerticalGroupId}, updated_on = NOW(), 
            updated_by_id = ${businessVerticalType.createdById} 
            WHERE id = ${businessVerticalType.id}`;
            
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

db.checkBusinessVerticalTypeExist = (id) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT c.id AS coachId
            FROM coach c WHERE c.business_vertical_type_id = ${id}`;
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

db.deleteBusinessVerticalType = (id) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `DELETE FROM business_vertical_type WHERE id = ${id}`;
            
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

db.getCoaches = (businessVerticalTypeId, action) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT c.id, c.uuid, c.code, c.name, c.email, c.mobile, c.is_active AS isActive, 'coach' AS tableName, COUNT(bpc.id) AS isExist,
            bv.id AS businessVerticalId, bv.name AS businessVerticalName, 
            bvg.id AS businessVerticalGroupId, bvg.name AS businessVerticalGroupName,
            bvt.id AS businessVerticalTypeId, bvt.name AS businessVerticalTypeName
            FROM coach c
            JOIN business_vertical_type bvt ON bvt.id = c.business_vertical_type_id
            JOIN business_vertical bv ON bv.id = bvt.business_vertical_id
            JOIN business_vertical_group bvg ON bvg.id = bvt.business_vertical_group_id
            LEFT JOIN business_partner_coach bpc ON bpc.coach_id = c.id`;
            if(businessVerticalTypeId != "")
            {
                sql = sql + ` WHERE c.business_vertical_type_id = ${businessVerticalTypeId}`
                if(action == "Active")
                {
                    sql = sql + ` AND c.is_active = 1`
                }
            }
            if(action == "Active")
            {
                sql = sql + ` WHERE c.is_active = 1`
            }
            sql = sql + ` GROUP BY c.id
            ORDER BY c.name`;
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

db.getCoach = (coachId) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT c.id, c.uuid, c.code, c.name, c.email, c.mobile, c.is_active AS isActive, 'coach' AS tableName, COUNT(bpc.id) AS isExist,
            bv.id AS businessVerticalId, bv.name AS businessVerticalName, 
            bvg.id AS businessVerticalGroupId, bvg.name AS businessVerticalGroupName,
            bvt.id AS businessVerticalTypeId, bvt.name AS businessVerticalTypeName
            FROM coach c
            JOIN business_vertical_type bvt ON bvt.id = c.business_vertical_type_id
            JOIN business_vertical bv ON bv.id = bvt.business_vertical_id
            JOIN business_vertical_group bvg ON bvg.id = bvt.business_vertical_group_id
            LEFT JOIN business_partner_coach bpc ON bpc.coach_id = c.id`
            if(!isNaN(coachId))
            {
                sql = sql + ` WHERE FIND_IN_SET(c.id, '${coachId}') > 0`;
            }
            else
            {
                sql = sql + ` WHERE FIND_IN_SET(c.uuid, '${coachId}') > 0`;
            }
            sql =sql + ` GROUP BY c.id ORDER BY c.id`;
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

db.insertCoach = (coach) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `INSERT INTO coach (uuid, code, name, email, mobile, business_vertical_type_id, created_on, created_by_id)
            VALUES('${coach.uuid}', '${coach.code}', '${coach.name}', '${coach.email}', '${coach.mobile}', ${coach.businessVerticalTypeId}, NOW(), ${coach.createdById})`;
            
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

db.updateCoachCode = (code, id) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `UPDATE coach SET code = '${code}' WHERE id = ${id}`;
            
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

db.updateCoach = (coach) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `UPDATE coach SET name = '${coach.name}', email = '${coach.email}', mobile = '${coach.mobile}', business_vertical_type_id = ${coach.businessVerticalTypeId}, updated_on = NOW(), 
            updated_by_id = ${coach.createdById} 
            WHERE uuid = '${coach.uuid}'`;
            
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

db.checkCoachExist = (id) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT bpc.id AS businessPartnerCoachId
            FROM business_partner_coach bpc WHERE bpc.coach_id = ${id}`;
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

db.deleteCoach = (id) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `DELETE FROM coach WHERE id = ${id}`;
            
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

db.getAcademyEnclosureDocuments = (action) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT aed.id, aed.name, aed.is_compulsory AS isCompulsory, aed.is_active AS isActive, 'academy_enclosure_document' AS tableName, COUNT(bpdu.id) AS isExist
            FROM academy_enclosure_document aed 
            LEFT JOIN business_partner_doc_upload bpdu ON bpdu.academy_enclosure_document_id = aed.id`;
            if(action == "Active")
            {
                sql = sql + ` WHERE aed.is_active = 1`;
            }
            sql = sql + ` GROUP BY aed.id
            ORDER BY aed.name`;
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

db.getAcademyEnclosureDocument = (id) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT aed.id, aed.name
            FROM academy_enclosure_document aed 
            WHERE  aed.id IN (${id})`;

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

db.duplicateAcademyEnclosureDocument = (name, id) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT aed.id, aed.name
            FROM academy_enclosure_document aed 
            WHERE aed.name = '${name}'`;
            if(id != "")
            {
                sql =sql + ` AND aed.id != ${id}`
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

db.insertAcademyEnclosureDocument = (academyEnclosureDocument) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `INSERT INTO academy_enclosure_document (name, is_compulsory, created_on, created_by_id)
            VALUES('${academyEnclosureDocument.name}', ${academyEnclosureDocument.isCompulsory}, NOW(), ${academyEnclosureDocument.createdById})`;
            
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

db.checkAcademyEnclosureDocumentExist = (id) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT bpdu.id AS businessPartnerDocUploadId
            FROM business_partner_doc_upload bpdu WHERE bpdu.academy_enclosure_document_id = ${id}`;
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

db.deleteAcademyEnclosureDocument = (id) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `DELETE FROM academy_enclosure_document WHERE id = ${id}`;
            
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

db.getCountries = (action) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT c.id, c.name, c.is_active AS isActive, 'country' AS tableName, COUNT(sr.id) AS isExist
            FROM country c 
            LEFT JOIN state_region sr ON sr.country_id = c.id`;
            if(action == "Active")
            {
                sql = sql + ` WHERE c.is_active = 1`;
            }
            sql = sql + ` GROUP BY c.id
            ORDER BY c.name`;
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

db.getCountry = (id) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT c.id, c.name
            FROM country c 
            WHERE c.id = ${id}`;
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

db.duplicateCountry = (name, id) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT c.id, c.name
            FROM country c 
            WHERE c.name = '${name}'`;
            if(id != "")
            {
                sql =sql + ` AND c.id != ${id}`
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

db.insertCountry = (country) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `INSERT INTO country (name, created_on, created_by_id)
            VALUES('${country.name}', NOW(), ${country.createdById})`;
            
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

db.insertMultipleCountry = (countryData, createdById) => 
{
    let sqlValues = '';
    for(let i=0;i<countryData.length;i++)
    {
        sqlValues = sqlValues == '' ? `('${countryData[i].name}', NOW(), ${createdById})` : `${sqlValues}, ('${countryData[i].name}', NOW(), ${createdById})`;
    }
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `INSERT INTO country (name, created_on, created_by_id)
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

db.updateCountry = (country) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `UPDATE country SET name = '${country.name}', updated_on = NOW(), updated_by_id = ${country.createdById} WHERE id = ${country.id}`;
            
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

db.checkCountryExist = (id) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT sr.id AS stateRegionId
            FROM state_region sr WHERE sr.country_id = ${id}`;
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

db.deleteCountry = (id) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `DELETE FROM country WHERE id = ${id}`;
            
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

db.getStateRegions = (countryId, action) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT sr.id, sr.name, sr.is_active AS isActive, 'state_region' AS tableName, COUNT(d.id) AS isExist,
            c.id AS countryId, c.name AS countryName
            FROM state_region sr
            JOIN country c ON c.id = sr.country_id
            LEFT JOIN district d ON d.state_region_id = sr.id 
            WHERE sr.country_id = ${countryId}`;
            if(action == "Active")
            {
                sql = sql + ` AND sr.is_active = 1`;
            }
            sql = sql + ` GROUP BY sr.id
            ORDER BY sr.name`;
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

db.getStateRegion = (id, countryId) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT sr.id, sr.name, sr.is_active AS isActive, 'state_region' AS tableName,
            c.id AS countryId, c.name AS countryName
            FROM state_region sr
            JOIN country c ON c.id = sr.country_id
            WHERE sr.id = ${id}`;
            if(countryId != "")
            {
                sql = sql + ` AND sr.country_id = ${countryId}`;
            }
            sql = sql + ` ORDER BY sr.name`;
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

db.duplicateStateRegion = (name, countryId, id) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT sr.id, sr.name,
            c.id AS countryId, c.name AS countryName
            FROM state_region sr 
            JOIN country c ON c.id = sr.country_id
            WHERE sr.country_id = ${countryId} AND sr.name = '${name}'`;
            if(id != "")
            {
                sql =sql + ` AND sr.id != ${id}`
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

db.insertStateRegion = (stateRegion) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `INSERT INTO state_region (name, country_id, created_on, created_by_id)
            VALUES('${stateRegion.name}', ${stateRegion.countryId}, NOW(), ${stateRegion.createdById})`;
            
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

db.insertMultipleStateRegion = (stateRegionData, countryId, createdById) => 
{
    let sqlValues = '';
    for(let i=0;i<stateRegionData.length;i++)
    {
        sqlValues = sqlValues == '' ? `('${stateRegionData[i].name}', ${countryId}, NOW(), ${createdById})` : `${sqlValues}, ('${stateRegionData[i].name}', ${countryId}, NOW(), ${createdById})`;
    }
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `INSERT INTO state_region (name, country_id, created_on, created_by_id)
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

db.updateStateRegion = (stateRegion, isExist) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = "";
            if(parseInt(isExist) == 1)
            {
                sql = `UPDATE state_region SET name = '${stateRegion.name}', updated_on = NOW(), updated_by_id = ${stateRegion.createdById} WHERE id = ${stateRegion.id}`;
            }
            else
            {
                sql = `UPDATE state_region SET name = '${stateRegion.name}', country_id = '${stateRegion.countryId}', updated_on = NOW(), updated_by_id = ${stateRegion.createdById} WHERE id = ${stateRegion.id}`;
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

db.checkStateRegionExist = (id, countryId) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT d.id AS districtId
            FROM district d WHERE d.country_id = ${countryId} AND d.state_region_id = ${id}`;
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

db.deleteStateRegion = (id, countryId) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `DELETE FROM state_region WHERE id = ${id} AND country_id = ${countryId}`;
            
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

db.getDistricts = (countryId, stateRegionId, action) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT d.id, d.name, d.is_active AS isActive, 'district' AS tableName, COUNT(ct.id) AS isExist,
            c.id AS countryId, c.name AS countryName,
            sr.id AS stateRegionId, sr.name AS stateRegionName
            FROM district d
            JOIN country c ON c.id = d.country_id
            JOIN state_region sr ON sr.id = d.state_region_id
            LEFT JOIN city ct ON ct.district_id = d.id 
            WHERE d.country_id = ${countryId}`;
            if(parseInt(stateRegionId) > 0)
            {
                sql = sql + ` AND d.state_region_id = ${stateRegionId}`;
            }
            if(action == "Active")
            {
                sql = sql + ` AND d.is_active = 1`;
            }
            sql = sql + ` GROUP BY d.id
            ORDER BY d.name`;
            
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

db.getDistrict = (id, countryId, stateRegionId) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT d.id, d.name, d.is_active AS isActive, 'district' AS tableName,
            c.id AS countryId, c.name AS countryName,
            sr.id AS stateRegionId, sr.name AS stateRegionName
            FROM district d
            JOIN country c ON c.id = d.country_id
            JOIN state_region sr ON sr.id = d.state_region_id
            WHERE d.id = ${id}`;
            if(countryId != "")
            {
                sql = sql + ` AND d.country_id = ${countryId}`;
            }
            if(stateRegionId != "")
            {
                sql = sql + ` AND d.state_region_id = ${stateRegionId}`;
            }
            sql = sql + ` ORDER BY d.name`;
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

db.duplicateDistrict = (name, countryId, stateRegionId, id) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT d.id, d.name,
            c.id AS countryId, c.name AS countryName,
            sr.id AS stateRegionId, sr.name AS stateRegionName
            FROM district d 
            JOIN country c ON c.id = d.country_id
            JOIN state_region sr ON sr.id = d.state_region_id
            WHERE d.country_id = ${countryId} AND d.state_region_id = ${stateRegionId} 
            AND d.name = '${name}'`;
            if(id != "")
            {
                sql =sql + ` AND d.id != ${id}`
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

db.insertDistrict = (district) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `INSERT INTO district (name, country_id, state_region_id, created_on, created_by_id)
            VALUES('${district.name}', ${district.countryId}, ${district.stateRegionId}, NOW(), ${district.createdById})`;
            
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

db.insertMultipleDistrict = (districtData, countryId, stateRegionId, createdById) => 
{
    let sqlValues = '';
    for(let i=0;i<districtData.length;i++)
    {
        sqlValues = sqlValues == '' ? `('${districtData[i].name}', ${countryId}, ${stateRegionId}, NOW(), ${createdById})` : `${sqlValues}, ('${districtData[i].name}', ${countryId}, ${stateRegionId}, NOW(), ${createdById})`;
    }
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `INSERT INTO district (name, country_id, state_region_id, created_on, created_by_id)
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

db.updateDistrict = (district, isExist) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = "";
            if(parseInt(isExist) == 1)
            {
                sql = `UPDATE district SET name = '${district.name}', updated_on = NOW(), updated_by_id = ${district.createdById} WHERE id = ${district.id}`;
            }
            else
            {
                sql = `UPDATE district SET name = '${district.name}', country_id = '${district.countryId}', state_region_id = '${district.stateRegionId}', updated_on = NOW(), updated_by_id = ${district.createdById} WHERE id = ${district.id}`;
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

db.checkDistrictExist = (id, countryId, stateRegionId) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT ct.id AS cityId
            FROM city ct WHERE ct.country_id = ${countryId} AND ct.state_region_id = ${stateRegionId} 
            AND ct.district_id = ${id}`;
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

db.deleteDistrict = (id, countryId, stateRegionId) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `DELETE FROM district WHERE id = ${id} AND country_id = ${countryId} AND state_region_id = ${stateRegionId}`;
            
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

db.getCities = (countryId, stateRegionId, districtId, action) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT ct.id, ct.name, ct.is_active AS isActive, 'city' AS tableName, COUNT(bp.id) AS isExist,
            c.id AS countryId, c.name AS countryName,
            sr.id AS stateRegionId, sr.name AS stateRegionName,
            d.id AS districtId, d.name AS districtName
            FROM city ct
            JOIN country c ON c.id = ct.country_id
            JOIN state_region sr ON sr.id = ct.state_region_id
            JOIN district d ON d.id = ct.district_id
            LEFT JOIN business_partner bp ON bp.city_id = ct.id 
            WHERE ct.country_id = ${countryId} AND ct.state_region_id = ${stateRegionId}`;
            if(parseInt(districtId) > 0)
            {
                sql = sql + ` AND ct.district_id = ${districtId}`;
            }
            if(action == "Active")
            {
                sql = sql + ` AND ct.is_active = 1`;
            }
            sql = sql + ` GROUP BY ct.id
            ORDER BY ct.name`;
           
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

db.getCity = (id, countryId, stateRegionId, districtId) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT ct.id, ct.name, ct.is_active AS isActive, 'city' AS tableName,
            c.id AS countryId, c.name AS countryName,
            sr.id AS stateRegionId, sr.name AS stateRegionName,
            d.id AS districtId, d.name AS districtName
            FROM city ct
            JOIN country c ON c.id = ct.country_id
            JOIN state_region sr ON sr.id = ct.state_region_id
            JOIN district d ON d.id = ct.district_id
            WHERE ct.id = ${id}`;
            if(countryId != "")
            {
                sql = sql + ` AND ct.country_id = ${countryId}`;
            }
            if(stateRegionId != "")
            {
                sql = sql + ` AND ct.state_region_id = ${stateRegionId}`;
            }
            if(districtId != "")
            {
                sql = sql + ` AND ct.district_id = ${districtId}`;
            }
            sql = sql + ` ORDER BY ct.name`;
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

db.duplicateCity = (name, countryId, stateRegionId, districtId, id) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT ct.id, ct.name,
            c.id AS countryId, c.name AS countryName,
            sr.id AS stateRegionId, sr.name AS stateRegionName,
            d.id AS districtId, d.name AS districtName
            FROM city ct 
            JOIN country c ON c.id = ct.country_id
            JOIN state_region sr ON sr.id = ct.state_region_id
            JOIN district d ON d.id = ct.district_id
            WHERE ct.country_id = ${countryId} AND ct.state_region_id = ${stateRegionId} AND ct.district_id = ${districtId} 
            AND ct.name = '${name}'`;
            if(id != "")
            {
                sql =sql + ` AND ct.id != ${id}`
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

db.insertCity = (city) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `INSERT INTO city (name, country_id, state_region_id, district_id, created_on, created_by_id)
            VALUES('${city.name}', ${city.countryId}, ${city.stateRegionId}, ${city.districtId}, NOW(), ${city.createdById})`;
            
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

db.insertMultipleCity = (cityData, countryId, stateRegionId, districtId, createdById) => 
{
    let sqlValues = '';
    for(let i=0;i<cityData.length;i++)
    {
        sqlValues = sqlValues == '' ? `('${cityData[i].name}', ${countryId}, ${stateRegionId}, ${districtId}, NOW(), ${createdById})` : `${sqlValues}, ('${cityData[i].name}', ${countryId}, ${stateRegionId}, ${districtId}, NOW(), ${createdById})`;
    }
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `INSERT INTO city (name, country_id, state_region_id, district_id, created_on, created_by_id)
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

db.updateCity = (city, isExist) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = "";
            if(parseInt(isExist) == 1)
            {
                sql = `UPDATE city SET name = '${city.name}', updated_on = NOW(), updated_by_id = ${city.createdById} WHERE id = ${city.id}`;
            }
            else
            {
                sql = `UPDATE city SET name = '${city.name}', country_id = '${city.countryId}', state_region_id = '${city.stateRegionId}', district_id = '${city.districtId}', updated_on = NOW(), updated_by_id = ${city.createdById} WHERE id = ${city.id}`;
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

db.checkCityExist = (id, countryId, stateRegionId, districtId) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT bp.id AS businessPartnerId
            FROM business_partner bp WHERE bp.country_id = ${countryId} AND bp.state_region_id = ${stateRegionId} AND bp.district_id = ${districtId} AND bp.city_id = ${id}`;
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

db.deleteCity = (id, countryId, stateRegionId, districtId) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `DELETE FROM city WHERE id = ${id} AND country_id = ${countryId} AND state_region_id = ${stateRegionId} AND district_id = ${districtId}`;
            
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

db.getBusinessPartners = (businessPartnerTypeId, action) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT bp.id, bp.uuid, bp.name, bp.code, bp.email, bp.pincode, bp.contact_person AS contactPerson, bp.contact_email AS contactEmail, bp.contact_mobile AS contactMobile,
            bp.incharge_person AS inchargePerson, bp.incharge_email AS inchargeEmail, bp.incharge_mobile AS inchargeMobile, bp.applicable_from AS applicableFrom, bp.applicable_to AS applicableTo, bp.is_having_contract AS isHavingContract, 
            bp.reward_applicable AS rewardApplicable, bp.pan_number AS panNumber, bp.gst_number AS gstNumber, bp.is_active AS isActive, 'business_partner' AS tableName, COUNT(sc.id) AS isExist,
            bpt.id AS businessPartnerTypeId, bpt.code AS businessPartnerTypeCode, bpt.name AS businessPartnerTypeName,
            bv.id AS businessVerticalId, bv.name AS businessVerticalName, 
            CONCAT('[', GROUP_CONCAT(
                    CONCAT(
                        '{"id": ', bvt.id, 
                        ', "name": "', bvt.name, '"}'
                    )
                ), ']') AS businessVerticalTypes
            FROM 
            business_partner bp
            JOIN business_partner_type bpt ON bpt.id = bp.business_partner_type_id 
            JOIN business_vertical bv ON bv.id = bp.business_vertical_id 
            JOIN business_vertical_type bvt ON FIND_IN_SET(bvt.id, bp.business_vertical_type_ids) 
            LEFT JOIN study_center sc ON sc.business_partner_id = bp.id 
            WHERE bp.deleted_on IS NULL AND bp.deleted_by_id IS NULL`;
            if(businessPartnerTypeId != 0)
            {
                sql = sql + ` AND bp.business_partner_type_id = ${businessPartnerTypeId}`
            }
            if(action == "Active")
            {
                sql = sql + ` AND bp.is_active = 1`
            }
            sql = sql + ` GROUP BY bp.id
            ORDER BY bp.name`;
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

db.getBusinessPartner = (uuid) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT bp.id, bp.uuid, bp.name, bp.code, bp.email, bp.address, bp.pincode, bp.contact_person AS contactPerson, bp.contact_email AS contactEmail, bp.contact_mobile AS contactMobile, 
            bp.incharge_person AS inchargePerson, bp.incharge_email AS inchargeEmail, bp.incharge_mobile AS inchargeMobile, bp.applicable_from AS applicableFrom, bp.applicable_to AS applicableTo, bp.is_having_contract AS isHavingContract, 
            bp.reward_applicable AS rewardApplicable, bp.pan_number AS panNumber, bp.gst_number AS gstNumber, bp.is_active AS isActive, 'business_partner' AS tableName,
            bpt.id AS businessPartnerTypeId, bpt.code AS businessPartnerTypeCode, bpt.name AS businessPartnerTypeName, 
            bv.id AS businessVerticalId, bv.name AS businessVerticalName, 
            CONCAT('[', GROUP_CONCAT(
                    CONCAT(
                        '{"id": ', bvt.id, 
                        ', "name": "', bvt.name, '"}'
                    )
                ), ']') AS businessVerticalTypes,
            c.id AS countryId, c.name AS countryName,
            sr.id AS stateRegionId, sr.name AS stateRegionName,
            d.id AS districtId, d.name AS districtName,
            ct.id AS cityId, ct.name AS cityName,
            bpch.id as contractId, bpch.contract_from AS contractFrom, bpch.contract_to AS contractTo,
            cot.id as commissionTermId, cot.name AS commissionTermName,
            com.id as commercialTermId, com.name AS commercialTermName
            FROM 
            business_partner bp
            JOIN business_partner_type bpt ON bpt.id = bp.business_partner_type_id 
            JOIN business_vertical bv ON bv.id = bp.business_vertical_id 
            JOIN business_vertical_type bvt ON FIND_IN_SET(bvt.id, bp.business_vertical_type_ids) 
            JOIN country c ON c.id = bp.country_id
            JOIN state_region sr ON sr.id = bp.state_region_id
            JOIN district d ON d.id = bp.district_id
            JOIN city ct ON ct.id = bp.city_id
            LEFT JOIN business_partner_contract_history bpch ON bpch.id = bp.current_contract_history_id
            LEFT JOIN commission_term cot ON cot.id = bp.commission_term_id
            LEFT JOIN commercial_term com ON com.id = bp.commercial_term_id 
            WHERE bp.uuid = '${uuid}'
            GROUP BY bp.id`;
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

db.duplicateBusinessPartner = (name, businessPartnerTypeId, uuid) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT bp.id, bp.name, bpt.id AS businessPartnerTypeId, bpt.name AS businessPartnerTypeName
            FROM business_partner bp 
            JOIN business_partner_type bpt ON bpt.id = bp.business_partner_type_id
            WHERE bp.name = '${name}' AND bp.business_partner_type_id = ${businessPartnerTypeId}`;
            if(uuid != "")
            {
                sql =sql + ` AND bp.uuid != '${uuid}'`
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

db.insertBusinessPartner = (businessPartner) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `INSERT INTO business_partner (uuid, code, name, email, business_partner_type_id, business_vertical_id, business_vertical_type_ids, address, country_id, state_region_id, district_id, city_id, pincode, contact_person, contact_email, contact_mobile, incharge_person, incharge_email, incharge_mobile, applicable_from, applicable_to, reward_applicable, commission_term_id, pan_number, gst_number, commercial_term_id, created_on, created_by_id)
            VALUES('${businessPartner.uuid}', '${businessPartner.code}', '${businessPartner.name}', '${businessPartner.email}', ${businessPartner.businessPartnerTypeId}, ${businessPartner.businessVerticalId}, '${businessPartner.businessVerticalTypeIds}', '${businessPartner.address}', ${businessPartner.countryId}, ${businessPartner.stateRegionId}, ${businessPartner.districtId}, ${businessPartner.cityId}, '${businessPartner.pincode}', '${businessPartner.contactPerson}', '${businessPartner.contactEmail}', '${businessPartner.contactMobile}', NULLIF('${businessPartner.inchargePerson}', ''), NULLIF('${businessPartner.inchargeEmail}', ''), NULLIF('${businessPartner.inchargeMobile}', ''), '${businessPartner.applicableFrom}', '${businessPartner.applicableTo}', NULLIF('${businessPartner.rewardApplicable}', ''), NULLIF('${businessPartner.commissionTermId}', ''), NULLIF('${businessPartner.panNumber}', ''), NULLIF('${businessPartner.gstNumber}', ''), NULLIF('${businessPartner.commercialTermId}', ''), NOW(), ${businessPartner.createdById})`;
            
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

db.updateBusinessPartnerCode = (code, id) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `UPDATE business_partner SET code = '${code}' WHERE id = ${id}`;
            
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

db.updateBusinessPartner = (businessPartner) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `UPDATE business_partner SET name = '${businessPartner.name}', email = '${businessPartner.email}', business_vertical_id = ${businessPartner.businessVerticalId}, business_vertical_type_ids = '${businessPartner.businessVerticalTypeIds}', address = '${businessPartner.address}', country_id = ${businessPartner.countryId}, state_region_id = ${businessPartner.stateRegionId}, district_id = ${businessPartner.districtId}, city_id = ${businessPartner.cityId}, pincode = '${businessPartner.pincode}', contact_person = '${businessPartner.contactPerson}', contact_email = '${businessPartner.contactEmail}', contact_mobile = '${businessPartner.contactMobile}', incharge_person = NULLIF('${businessPartner.inchargePerson}', ''), incharge_email = NULLIF('${businessPartner.inchargeEmail}', ''), incharge_mobile = NULLIF('${businessPartner.inchargeMobile}', ''), applicable_from = '${businessPartner.applicableFrom}', applicable_to = '${businessPartner.applicableTo}', reward_applicable = NULLIF('${businessPartner.rewardApplicable}', ''), commission_term_id = NULLIF('${businessPartner.commissionTermId}', ''), pan_number = NULLIF('${businessPartner.panNumber}', ''), gst_number = NULLIF('${businessPartner.gstNumber}', ''), commercial_term_id = NULLIF('${businessPartner.commercialTermId}', ''), updated_on = NOW(), updated_by_id = ${businessPartner.createdById} WHERE uuid = '${businessPartner.uuid}'`;
            
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

db.deleteBusinessPartner = (id, deletedById) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `UPDATE business_partner SET is_active = 0, deleted_on = NOW(), deleted_by_id = ${deletedById} WHERE id = ${id} AND deleted_on IS NULL AND deleted_by_id IS NULL`;
           
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

db.getBusinessPartnerContractHistories = (businessPartnerId) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT bpch.id AS id, bpch.contract_from AS contractFrom, bpch.contract_to AS contractTo, is_active AS isActive, 'business_partner_contract_history' AS tableName FROM business_partner_contract_history bpch WHERE bpch.business_partner_id = ${businessPartnerId} ORDER BY bpch.id`;
            
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

db.checkBusinessPartnerContractExist = (contractFrom, contractTo, businessPartnerId, id) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT bpch.id AS businessPartnerContractId FROM business_partner_contract_history bpch WHERE bpch.business_partner_id = ${businessPartnerId}`;
            if(id == '')
            {
                sql = sql + ` AND (bpch.contract_from = '${contractFrom}' OR bpch.contract_to = '${contractTo}')`;
            }
            else if(id != '')
            {
                sql = sql + ` AND bpch.id = ${id}`;
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

db.getBusinessPartnerDocuments = (businessPartnerId) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT bpdu.id, bpdu.file_name AS fileName, bpdu.uploaded_on AS uploadedOn,
            aed.id AS documentId, aed.name AS documentName
            FROM business_partner_doc_upload bpdu
            JOIN academy_enclosure_document aed ON aed.id = bpdu.academy_enclosure_document_id 
            WHERE bpdu.business_partner_id = ${businessPartnerId}
            ORDER BY aed.name`;
            
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

db.checkBusinessPartnerDocumentExist = (businessPartnerId, id) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT bpdu.id AS businessPartnerDocumentId, bpdu.file_name AS fileName FROM business_partner_doc_upload bpdu WHERE bpdu.business_partner_id = ${businessPartnerId} AND bpdu.id = ${id}`;
            
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

db.checkDuplicateBusinessPartnerDoc = (businessPartnerId, academyEnclosureDocId) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT bpdu.id, bpdu.file_name AS fileName FROM business_partner_doc_upload bpdu WHERE bpdu.business_partner_id = ${businessPartnerId} AND bpdu.academy_enclosure_document_id = ${academyEnclosureDocId}`;
            
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

db.insertBusinessPartnerDocument = (businessPartnerDocument) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `INSERT INTO business_partner_doc_upload (business_partner_id, academy_enclosure_document_id, file_name, uploaded_on, uploaded_by_id) VALUES (${businessPartnerDocument.businessPartnerId}, ${businessPartnerDocument.documentId}, '${businessPartnerDocument.fileName}', NOW(), ${businessPartnerDocument.createdById})`;
            
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

db.updateBusinessPartnerDocFileName = (fileName, id, updatedById = '') => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `UPDATE business_partner_doc_upload SET file_name = '${fileName}'`;
            if(updatedById != '')
            {
                sql =sql + `, updated_on = NOW(), updated_by_id = ${updatedById}`
            }
            sql =sql + ` WHERE id = ${id}`;
            
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

db.deleteBusinessPartnerDocument = (businessPartnerId, id) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `DELETE FROM business_partner_doc_upload WHERE business_partner_id = ${businessPartnerId} AND id = ${id}`;
            
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

db.insertBusinessPartnerContractHistory = (businessPartnerContractHistory) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
    /////Deactive Old Contracts
            let sql = `UPDATE business_partner_contract_history SET is_active = 0, updated_on = NOW(), updated_by_id = ${businessPartnerContractHistory.createdById} WHERE business_partner_id = ${businessPartnerContractHistory.businessPartnerId} AND is_active = 1`;
            
            dbConn.query(sql, (error, result) => 
            {
                if(error)
                {
                    return reject(error);
                }
    /////Insert New Contract
                let sql1 = `INSERT INTO business_partner_contract_history (business_partner_id, contract_from, contract_to, created_on, created_by_id) VALUES (${businessPartnerContractHistory.businessPartnerId}, '${businessPartnerContractHistory.contractFrom}', '${businessPartnerContractHistory.contractTo}', NOW(), ${businessPartnerContractHistory.createdById})`;
                dbConn.query(sql1, (error1, result1) => 
                {
                    if(error1)
                    {
                        return reject(error1);
                    }
    ///////Update Business Partner Current Contract Id
                    let sql2 = `UPDATE business_partner SET is_having_contract = 1, current_contract_history_id = ${result1.insertId} WHERE id = ${businessPartnerContractHistory.businessPartnerId}`;
                    dbConn.query(sql2, (error2, result2) => 
                    {
                        if(error2)
                        {
                            return reject(error);
                        }
                        return resolve(result2);
                    });
                });
            });
        }
        catch(e)
        {
            throw e;
        }
    })
};

db.deleteBusinessPartnerContractHistory = (businessPartnerContractHistory) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
    /////Delete Old Contracts
            let sql = `DELETE FROM business_partner_contract_history WHERE business_partner_id = ${businessPartnerContractHistory.businessPartnerId} AND id = ${businessPartnerContractHistory.id}`;
            
            dbConn.query(sql, (error, result) => 
            {
                if(error)
                {
                    return reject(error);
                }
    /////Check Any Contract Exist For Business Partner
                let sql1 = `SELECT bpch.id FROM business_partner_contract_history bpch WHERE bpch.business_partner_id = ${businessPartnerContractHistory.businessPartnerId}`;
                dbConn.query(sql1, (error1, result1) => 
                {
                    if(error1)
                    {
                        return reject(error1);
                    }
                    if(result1.length == 0)
                    {
    ///////Update Business Partner Current Contract Id And is Having Contract
                        let sql2 = `UPDATE business_partner SET is_having_contract = 0, current_contract_history_id = NULL WHERE id = ${businessPartnerContractHistory.businessPartnerId}`;
                        dbConn.query(sql2, (error2, result2) => 
                        {
                            if(error2)
                            {
                                return reject(error2);
                            }
                            return resolve(result2);
                        });
                    }
                    else
                    {
                        return resolve(result);
                    }
                });
            });
        }
        catch(e)
        {
            throw e;
        }
    })
};

db.getBusinessPartnerCoaches = (businessPartnerId) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT bpc.id, bpc.is_active AS isActive, 'business_partner_coach' AS tableName,
            c.uuid AS coachUUID, c.name AS coachName, c.email AS coachEmail, c.mobile AS coachMobile, c.is_active AS coachIsActive,
            bvt.id AS businessVerticalTypeId, bvt.name AS businessVerticalTypeName
            FROM business_partner_coach bpc
            JOIN coach c ON c.id = bpc.coach_id
            JOIN business_vertical_type bvt ON bvt.id = c.business_vertical_type_id  
            WHERE bpc.business_partner_id = ${businessPartnerId} ORDER BY c.name`;
            
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

db.getBusinessPartnerCoach = (id) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT bpc.id, bpc.is_active AS isActive, 'business_partner_coach' AS tableName,
            c.uuid AS coachUUID, c.name AS coachName, c.email AS coachEmail, c.mobile AS coachMobile, c.is_active AS coachIsActive,
            bvt.id AS businessVerticalTypeId, bvt.name AS businessVerticalTypeName
            FROM business_partner_coach bpc
            JOIN coach c ON c.id = bpc.coach_id
            JOIN business_vertical_type bvt ON bvt.id = c.business_vertical_type_id  
            WHERE bpc.id = ${id}`;
            
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

db.duplicateBusinessPartnerCoach = (ids, businessPartnerId) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT bpc.id, bpc.is_active AS isActive, 'business_partner_coach' AS tableName,
            c.uuid AS coachUUID, c.name AS coachName, c.email AS coachEmail, c.mobile AS coachMobile, c.is_active AS coachIsActive,
            bvt.id AS businessVerticalTypeId, bvt.name AS businessVerticalTypeName
            FROM business_partner_coach bpc
            JOIN coach c ON c.id = bpc.coach_id
            JOIN business_vertical_type bvt ON bvt.id = c.business_vertical_type_id  
            WHERE bpc.business_partner_id = ${businessPartnerId} AND bpc.coach_id IN (${ids})`;
           
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

db.insertBusinessPartnerCoach = (businessPartnerCoach) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sqlValues = '';
            let coaches = businessPartnerCoach.coaches.toString().split(",");
            for(let i=0;i<coaches.length;i++)
            {
                if(sqlValues == '')
                {
                    sqlValues = `(${businessPartnerCoach.businessPartnerId}, ${coaches[i]}, NOW(), ${businessPartnerCoach.createdById})`;
                }
                else
                {
                    sqlValues = sqlValues + `,(${businessPartnerCoach.businessPartnerId}, ${coaches[i]}, NOW(), ${businessPartnerCoach.createdById})`;
                }
            }
            let sql = `INSERT INTO business_partner_coach (business_partner_id, coach_id, created_on, created_by_id) VALUES ${sqlValues}`;
            
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

db.deleteBusinessPartnerCoach = (id, businessPartnerId) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `DELETE FROM business_partner_coach WHERE id = ${id} AND business_partner_id = ${businessPartnerId}`;
            
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

db.getTieUpSchools = (action) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT tus.id, tus.uuid, tus.name, tus.email, tus.mobile, tus.website, tus.address, tus.pincode, tus.contact_person AS contactPerson, tus.pan_number AS panNumber, tus.is_active AS isActive, 'tie_up_school' AS tableName,
            tuss.id AS syllabusId, tuss.name AS syllabusName,
            c.id AS countryId, c.name AS countryName,
            sr.id AS stateRegionId, sr.name AS stateRegionName,
            d.id AS districtId, d.name AS districtName,
            ct.id AS cityId, ct.name AS cityName
            FROM 
            tie_up_school tus
            JOIN tie_up_school_syllabus tuss ON tuss.id = tus.tie_up_school_syllabus_id 
            JOIN country c ON c.id = tus.country_id 
            JOIN state_region sr ON sr.id = tus.state_region_id 
            JOIN district d ON d.id = tus.district_id 
            JOIN city ct ON ct.id = tus.city_id 
            WHERE tus.deleted_on IS NULL AND tus.deleted_by_id IS NULL `;
            if(action == 'Active')
            {
                sql = sql + ` AND tus.is_active = 1`;
            }
            sql = sql + ` ORDER BY tus.name`;

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

db.getTieUpSchool = (uuid) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT tus.id, tus.uuid, tus.name, tus.email, tus.mobile, tus.website, tus.address, tus.pincode, tus.contact_person AS contactPerson, tus.pan_number AS panNumber, tus.is_active AS isActive, 
            tuss.id AS syllabusId, tuss.name AS syllabusName,
            c.id AS countryId, c.name AS countryName,
            sr.id AS stateRegionId, sr.name AS stateRegionName,
            d.id AS districtId, d.name AS districtName,
            ct.id AS cityId, ct.name AS cityName,
            tusch.id AS contractId, tusch.contract_from AS contractFrom, tusch.contract_to AS contractTo
            FROM 
            tie_up_school tus
            JOIN tie_up_school_syllabus tuss ON tuss.id = tus.tie_up_school_syllabus_id 
            JOIN country c ON c.id = tus.country_id 
            JOIN state_region sr ON sr.id = tus.state_region_id 
            JOIN district d ON d.id = tus.district_id 
            JOIN city ct ON ct.id = tus.city_id 
            LEFT JOIN tie_up_school_contract_history tusch ON tusch.id = tus.current_contract_history_id
            WHERE tus.uuid = '${uuid}'`;

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

db.duplicateTieUpSchool = (name, uuid) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT tus.id, tus.name
            FROM tie_up_school tus 
            WHERE tus.name = '${name}'`;
            if(uuid != "")
            {
                sql =sql + ` AND tus.uuid != '${uuid}'`
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

db.getTieUpSchoolDocuments = (tieUpSchoolId) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT tusdu.id, tusdu.file_name AS fileName, tusdu.uploaded_on AS uploadedOn,
            aed.id AS documentId, aed.name AS documentName
            FROM tie_up_school_doc_upload tusdu
            JOIN academy_enclosure_document aed ON aed.id = tusdu.academy_enclosure_document_id 
            WHERE tusdu.tie_up_school_id = ${tieUpSchoolId}
            ORDER BY aed.name`;
            
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

db.checkTieUpSchoolDocumentExist = (tieUpSchoolId, id) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT tusdu.id AS tieUpSchoolId, tusdu.file_name AS fileName FROM tie_up_school_doc_upload tusdu WHERE tusdu.tie_up_school_id = ${tieUpSchoolId} AND tusdu.id = ${id}`;
            
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

db.checkDuplicateTieUpSchoolDoc = (tieUpSchoolId, academyEnclosureDocId) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT tusdu.id, tusdu.file_name AS fileName FROM tie_up_school_doc_upload tusdu WHERE tusdu.tie_up_school_id = ${tieUpSchoolId} AND tusdu.academy_enclosure_document_id = ${academyEnclosureDocId}`;
            
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

db.insertTieUpSchool = (tieUpSchool) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `INSERT INTO tie_up_school (uuid, name, email, mobile, website, address, pincode,country_id, state_region_id, district_id, city_id, contact_person, pan_number, tie_up_school_syllabus_id, created_on, created_by_id)
            VALUES('${tieUpSchool.uuid}', '${tieUpSchool.name}', '${tieUpSchool.email}', '${tieUpSchool.mobile}', '${tieUpSchool.website}', '${tieUpSchool.address}', '${tieUpSchool.pincode}', ${tieUpSchool.countryId}, ${tieUpSchool.stateRegionId}, ${tieUpSchool.districtId}, ${tieUpSchool.cityId}, '${tieUpSchool.contactPerson}', '${tieUpSchool.panNumber}', ${tieUpSchool.syllabusId}, NOW(), ${tieUpSchool.createdById})`;
            
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

db.updateTieUpSchool = (tieUpSchool) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `UPDATE tie_up_school SET name = '${tieUpSchool.name}', email = '${tieUpSchool.email}', mobile = '${tieUpSchool.mobile}', website = '${tieUpSchool.website}', address = '${tieUpSchool.address}', pincode = '${tieUpSchool.pincode}',country_id = ${tieUpSchool.countryId}, state_region_id = ${tieUpSchool.stateRegionId}, district_id = ${tieUpSchool.districtId}, city_id = ${tieUpSchool.cityId}, contact_person = '${tieUpSchool.contactPerson}', pan_number = '${tieUpSchool.panNumber}', tie_up_school_syllabus_id = ${tieUpSchool.syllabusId}, updated_on = NOW(), updated_by_id = ${tieUpSchool.createdById} WHERE uuid = '${tieUpSchool.uuid}'`;
            
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

db.deleteTieUpSchool = (id, deletedById) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `UPDATE tie_up_school SET is_active = 0, deleted_on = NOW(), deleted_by_id = ${deletedById} WHERE id = ${id} AND deleted_on IS NULL AND deleted_by_id IS NULL`;
            
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

db.insertTieUpSchoolDocument = (tieUpSchoolDocument) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `INSERT INTO tie_up_school_doc_upload (tie_up_school_id, academy_enclosure_document_id, file_name, uploaded_on, uploaded_by_id) VALUES (${tieUpSchoolDocument.tieUpSchoolId}, ${tieUpSchoolDocument.documentId}, '${tieUpSchoolDocument.fileName}', NOW(), ${tieUpSchoolDocument.createdById})`;
            
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

db.updateTieUpSchoolDocFileName = (fileName, id, updatedById = '') => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `UPDATE tie_up_school_doc_upload SET file_name = '${fileName}'`;
            if(updatedById != '')
            {
                sql =sql + `, updated_on = NOW(), updated_by_id = ${updatedById}`
            }
            sql =sql + ` WHERE id = ${id}`;
            
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

db.deleteTieUpSchoolDocument = (tieUpSchoolId, id) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `DELETE FROM tie_up_school_doc_upload WHERE tie_up_school_id = ${tieUpSchoolId} AND id = ${id}`;
            
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

db.getTieUpSchoolContractHistories = (tieUpSchoolId) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT tush.id AS id, tush.contract_from AS contractFrom, tush.contract_to AS contractTo, is_active AS isActive, 'tie_up_school_contract_history' AS tableName FROM tie_up_school_contract_history tush WHERE tush.tie_up_school_id = ${tieUpSchoolId} ORDER BY tush.id`;
            
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

db.insertTieUpSchoolContractHistory = (tieUpSchoolContractHistory) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
    /////Deactive Old Contracts
            let sql = `UPDATE tie_up_school_contract_history SET is_active = 0, updated_on = NOW(), updated_by_id = ${tieUpSchoolContractHistory.createdById} WHERE tie_up_school_id = ${tieUpSchoolContractHistory.tieUpSchoolId} AND is_active = 1`;
            
            dbConn.query(sql, (error, result) => 
            {
                if(error)
                {
                    return reject(error);
                }
    /////Insert New Contract
                let sql1 = `INSERT INTO tie_up_school_contract_history (tie_up_school_id, contract_from, contract_to, created_on, created_by_id) VALUES (${tieUpSchoolContractHistory.tieUpSchoolId}, '${tieUpSchoolContractHistory.contractFrom}', '${tieUpSchoolContractHistory.contractTo}', NOW(), ${tieUpSchoolContractHistory.createdById})`;
                dbConn.query(sql1, (error1, result1) => 
                {
                    if(error1)
                    {
                        return reject(error1);
                    }
    ///////Update Business Partner Current Contract Id
                    let sql2 = `UPDATE tie_up_school SET current_contract_history_id = ${result1.insertId} WHERE id = ${tieUpSchoolContractHistory.tieUpSchoolId}`;
                    dbConn.query(sql2, (error2, result2) => 
                    {
                        if(error2)
                        {
                            return reject(error);
                        }
                        return resolve(result2);
                    });
                });
            });
        }
        catch(e)
        {
            throw e;
        }
    })
};

db.checkTieUpSchoolContractExist = (contractFrom, contractTo, tieUpSchoolId, id) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT tusch.id AS tieUpSchoolContractId FROM tie_up_school_contract_history tusch WHERE tusch.tie_up_school_id = ${tieUpSchoolId}`;
            if(id == '')
            {
                sql = sql + ` AND (tusch.contract_from = '${contractFrom}' OR tusch.contract_to = '${contractTo}')`;
            }
            else if(id != '')
            {
                sql = sql + ` AND tusch.id = ${id}`;
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

db.deleteTieUpSchoolContractHistory = (tieUpSchoolContractHistory) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
    /////Delete Old Contracts
            let sql = `DELETE FROM tie_up_school_contract_history WHERE tie_up_school_id = ${tieUpSchoolContractHistory.tieUpSchoolId} AND id = ${tieUpSchoolContractHistory.id}`;
            
            dbConn.query(sql, (error, result) => 
            {
                if(error)
                {
                    return reject(error);
                }
    /////Check Any Contract Exist For tie_up_school
                let sql1 = `SELECT tusch.id FROM tie_up_school_contract_history tusch WHERE tusch.tie_up_school_id = ${tieUpSchoolContractHistory.tieUpSchoolId}`;
                dbConn.query(sql1, (error1, result1) => 
                {
                    if(error1)
                    {
                        return reject(error1);
                    }
                    if(result1.length == 0)
                    {
    ///////Update Tie-Up School Current Contract Id
                        let sql2 = `UPDATE tie_up_school SET current_contract_history_id = NULL WHERE id = ${tieUpSchoolContractHistory.tieUpSchoolId}`;
                        dbConn.query(sql2, (error2, result2) => 
                        {
                            if(error2)
                            {
                                return reject(error2);
                            }
                            return resolve(result2);
                        });
                    }
                    else
                    {
                        return resolve(result);
                    }
                });
            });
        }
        catch(e)
        {
            throw e;
        }
    })
};

db.getTieUpSchoolSyllabuses = (action) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT tuss.id, tuss.name, tuss.is_active AS isActive, 'tie_up_school_syllabus' AS tableName, COUNT(tus.id) AS isExist
            FROM tie_up_school_syllabus tuss 
            LEFT JOIN tie_up_school tus ON tus.tie_up_school_syllabus_id = tuss.id`;
            if(action == "Active")
            {
                sql = sql + ' WHERE tuss.is_active = 1';
            }
            sql = sql + ` GROUP BY tuss.id
            ORDER BY tuss.name`;
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

db.getTieUpSchoolSyllabus = (id) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT tuss.id, tuss.name
            FROM tie_up_school_syllabus tuss 
            WHERE tuss.id = ${id}`
            
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

db.duplicateTieUpSchoolSyllabus = (name, id) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT tuss.id, tuss.name
            FROM tie_up_school_syllabus tuss 
            WHERE tuss.name = '${name}'`;
            if(id != "")
            {
                sql =sql + ` AND tuss.id != ${id}`
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

db.insertTieUpSchoolSyllabus = (tieUpSchoolSyllabus) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `INSERT INTO tie_up_school_syllabus (name, created_on, created_by_id)
            VALUES('${tieUpSchoolSyllabus.name}', NOW(), ${tieUpSchoolSyllabus.createdById})`;
            
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

db.checkTieUpSchoolSyllabusExist = (id) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT tus.id AS tieUpSchoolId
            FROM tie_up_school tus WHERE tus.tie_up_school_syllabus_id = ${id}`;
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

db.deleteTieUpSchoolSyllabus = (id) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `DELETE FROM tie_up_school_syllabus WHERE id = ${id}`;
            
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

db.getStudyCenters = (studyCenterTypeId) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT sc.id, sc.uuid, sc.name, sc.code, sc.email, sc.mobile, sc.address, sc.pincode, sc.contact_person_name AS contactPersonName, sc.contact_person_email AS contactPersonEmail, sc.contact_person_mobile AS contactPersonMobile, sc.landlord_name AS landlordName, sc.pan_number AS panNumber, sc.gst_number AS gstNumber, sc.is_active AS isActive, 'study_center' AS tableName,
            sct.id AS studyCenterTypeId, sct.name AS studyCenterTypeName,
			bp.uuid AS businessPartnerUUID, bp.name AS businessPartnerName,
			scrt.id AS rewardTypeId, scrt.name AS rewardTypeName,
            c.id AS countryId, c.name AS countryName,
            sr.id AS stateRegionId, sr.name AS stateRegionName,
            d.id AS districtId, d.name AS districtName,
            ct.id AS cityId, ct.name AS cityName
            FROM 
            study_center sc
            JOIN study_center_type sct ON sct.id = sc.study_center_type_id 
			LEFT JOIN business_partner bp ON bp.id = sc.business_partner_id
			LEFT JOIN study_center_reward_type scrt ON scrt.id = sc.study_center_reward_type_id			
            JOIN country c ON c.id = sc.country_id 
            JOIN state_region sr ON sr.id = sc.state_region_id 
            JOIN district d ON d.id = sc.district_id 
            JOIN city ct ON ct.id = sc.city_id 
            WHERE sc.deleted_on IS NULL AND sc.deleted_by_id IS NULL`;
            if(studyCenterTypeId != '')
            {
                sql = sql + ` AND sc.study_center_type_id = ${studyCenterTypeId}`;
            } 
            sql = sql + ` ORDER BY sc.name`;

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

db.getStudyCenter = (uuid) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT sc.id, sc.uuid, sc.name, sc.code, sc.email, sc.mobile, sc.address, sc.pincode, sc.contact_person_name AS contactPersonName, sc.contact_person_email AS contactPersonEmail, sc.contact_person_mobile AS contactPersonMobile,  sc.landlord_name AS landlordName, sc.pan_number AS panNumber, sc.gst_number AS gstNumber, sc.is_active AS isActive, 'study_center' AS tableName,
            sct.id AS studyCenterTypeId, sct.name AS studyCenterTypeName,
			bp.uuid AS businessPartnerUUID, bp.name AS businessPartnerName,
			scrt.id AS rewardTypeId, scrt.name AS rewardTypeName,
            c.id AS countryId, c.name AS countryName,
            sr.id AS stateRegionId, sr.name AS stateRegionName,
            d.id AS districtId, d.name AS districtName,
            ct.id AS cityId, ct.name AS cityName,
            scah.id AS agreementId, scah.agreement_from AS agreementFrom, scah.agreement_to AS agreementTo
            FROM 
            study_center sc
            JOIN study_center_type sct ON sct.id = sc.study_center_type_id 
			LEFT JOIN business_partner bp ON bp.id = sc.business_partner_id
			LEFT JOIN study_center_reward_type scrt ON scrt.id = sc.study_center_reward_type_id			
            JOIN country c ON c.id = sc.country_id 
            JOIN state_region sr ON sr.id = sc.state_region_id 
            JOIN district d ON d.id = sc.district_id 
            JOIN city ct ON ct.id = sc.city_id 
            LEFT JOIN study_center_agreement_history scah ON scah.id = sc.current_agreement_history_id
            WHERE sc.uuid = '${uuid}'`;

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

db.duplicateStudyCenter = (name, uuid) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT sc.id, sc.name, sct.id AS studyCenterTypeId, sct.name AS studyCenterTypeName
            FROM study_center sc
            JOIN study_center_type sct ON sct.id = sc.study_center_type_id 
            WHERE sc.name = '${name}'`;
            if(uuid != "")
            {
                sql =sql + ` AND sc.uuid != '${uuid}'`
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

db.checkStudyCenterDocumentExist = (studyCenterId, id) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT scdu.id AS studyCenterId, scdu.file_name AS fileName FROM study_center_doc_upload scdu WHERE scdu.study_center_id = ${studyCenterId} AND scdu.id = ${id}`;
            
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

db.checkDuplicateStudyCenterDoc = (studyCenterId, academyEnclosureDocId) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT scdu.id, scdu.file_name AS fileName FROM study_center_doc_upload scdu WHERE scdu.study_center_id = ${studyCenterId} AND scdu.academy_enclosure_document_id = ${academyEnclosureDocId}`;
            
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

db.insertStudyCenter = (studyCenter) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `INSERT INTO study_center (uuid, name, email, mobile, study_center_type_id, address, pincode, country_id, state_region_id, district_id, city_id, contact_person_name, contact_person_email, contact_person_mobile, landlord_name, pan_number, gst_number, study_center_reward_type_id, business_partner_id, created_on, created_by_id)
            VALUES('${studyCenter.uuid}', '${studyCenter.name}', '${studyCenter.email}', '${studyCenter.mobile}', '${studyCenter.studyCenterTypeId}', '${studyCenter.address}', '${studyCenter.pincode}', ${studyCenter.countryId}, ${studyCenter.stateRegionId}, ${studyCenter.districtId}, ${studyCenter.cityId}, NULLIF('${studyCenter.contactPersonName}', ''), NULLIF('${studyCenter.contactPersonEmail}', ''), NULLIF('${studyCenter.contactPersonMobile}', ''), NULLIF('${studyCenter.landlordName}', ''), NULLIF('${studyCenter.panNumber}', ''), NULLIF('${studyCenter.gstNumber}', ''), NULLIF('${studyCenter.rewardTypeId}', ''), NULLIF('${studyCenter.businessPartnerId}', ''), NOW(), ${studyCenter.createdById})`;
            
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

db.updateStudyCenterCode = (code, id) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `UPDATE study_center SET code = '${code}' WHERE id = ${id}`;
            
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

db.updateStudyCenter = (studyCenter) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `UPDATE study_center SET name = '${studyCenter.name}', email = '${studyCenter.email}', mobile = '${studyCenter.mobile}', address = '${studyCenter.address}', pincode = '${studyCenter.pincode}', country_id = ${studyCenter.countryId}, state_region_id = ${studyCenter.stateRegionId}, district_id = ${studyCenter.districtId}, city_id = ${studyCenter.cityId}, contact_person_name = NULLIF('${studyCenter.contactPersonName}', ''), contact_person_email = NULLIF('${studyCenter.contactPersonEmail}', ''), contact_person_mobile = NULLIF('${studyCenter.contactPersonMobile}', ''), landlord_name = NULLIF('${studyCenter.landlordName}', ''), pan_number = NULLIF('${studyCenter.panNumber}', ''), gst_number = NULLIF('${studyCenter.gstNumber}', ''), study_center_reward_type_id = NULLIF('${studyCenter.rewardTypeId}', ''), business_partner_id = NULLIF('${studyCenter.businessPartnerId}', ''), updated_on = NOW(), updated_by_id = ${studyCenter.createdById} WHERE uuid = '${studyCenter.uuid}'`;
            
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

db.deleteStudyCenter = (id, deletedById) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `UPDATE study_center SET is_active = 0, deleted_on = NOW(), deleted_by_id = ${deletedById} WHERE id = ${id} AND deleted_on IS NULL AND deleted_by_id IS NULL`;
            
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

db.getStudyCenterDocuments = (studyCenterId) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT scdu.id, scdu.file_name AS fileName, scdu.uploaded_on AS uploadedOn,
            aed.id AS documentId, aed.name AS documentName
            FROM study_center_doc_upload scdu
            JOIN academy_enclosure_document aed ON aed.id = scdu.academy_enclosure_document_id 
            WHERE scdu.study_center_id = ${studyCenterId}
            ORDER BY aed.name`;
            
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

db.insertStudyCenterDocument = (studyCenterDocument) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `INSERT INTO study_center_doc_upload (study_center_id, academy_enclosure_document_id, file_name, uploaded_on, uploaded_by_id) VALUES (${studyCenterDocument.studyCenterId}, ${studyCenterDocument.documentId}, '${studyCenterDocument.fileName}', NOW(), ${studyCenterDocument.createdById})`;
            
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

db.updateStudyCenterDocFileName = (fileName, id, updatedById = '') => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `UPDATE study_center_doc_upload SET file_name = '${fileName}'`;
            if(updatedById != '')
            {
                sql =sql + `, updated_on = NOW(), updated_by_id = ${updatedById}`
            }
            sql =sql + ` WHERE id = ${id}`;
            
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

db.deleteStudyCenterDocument = (studyCenterId, id) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `DELETE FROM study_center_doc_upload WHERE study_center_id = ${studyCenterId} AND id = ${id}`;
            
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

db.getStudyCenterAgreementHistories = (studyCenterId) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT scah.id AS id, scah.agreement_from AS agreementFrom, scah.agreement_to AS agreementTo, is_active AS isActive, 'study_center_agreement_history' AS tableName FROM study_center_agreement_history scah WHERE scah.study_center_id = ${studyCenterId} ORDER BY scah.id`;
            
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

db.insertStudyCenterAgreementHistory = (studyCenterAgreementHistory) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
    /////Deactive Old Contracts
            let sql = `UPDATE study_center_agreement_history SET is_active = 0, updated_on = NOW(), updated_by_id = ${studyCenterAgreementHistory.createdById} WHERE study_center_id = ${studyCenterAgreementHistory.studyCenterId} AND is_active = 1`;
            
            dbConn.query(sql, (error, result) => 
            {
                if(error)
                {
                    return reject(error);
                }
    /////Insert New Contract
                let sql1 = `INSERT INTO study_center_agreement_history (study_center_id, agreement_from, agreement_to, created_on, created_by_id) VALUES (${studyCenterAgreementHistory.studyCenterId}, '${studyCenterAgreementHistory.agreementFrom}', '${studyCenterAgreementHistory.agreementTo}', NOW(), ${studyCenterAgreementHistory.createdById})`;
                dbConn.query(sql1, (error1, result1) => 
                {
                    if(error1)
                    {
                        return reject(error1);
                    }
    ///////Update Business Partner Current Contract Id
                    let sql2 = `UPDATE study_center SET current_agreement_history_id = ${result1.insertId} WHERE id = ${studyCenterAgreementHistory.studyCenterId}`;
                    dbConn.query(sql2, (error2, result2) => 
                    {
                        if(error2)
                        {
                            return reject(error);
                        }
                        return resolve(result2);
                    });
                });
            });
        }
        catch(e)
        {
            throw e;
        }
    })
};

db.checkStudyCenterAgreementExist = (agreementFrom, agreementTo, studyCenterId, id) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT scah.id AS studyCenterAgreementId FROM study_center_agreement_history scah WHERE scah.study_center_id = ${studyCenterId}`;
            if(id == '')
            {
                sql = sql + ` AND (scah.agreement_from = '${agreementFrom}' OR scah.agreement_to = '${agreementTo}')`;
            }
            else if(id != '')
            {
                sql = sql + ` AND scah.id = ${id}`;
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

db.deleteStudyCenterAgreementHistory = (studyCenterAgreementHistory) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
    /////Delete Old Contracts
            let sql = `DELETE FROM study_center_agreement_history WHERE study_center_id = ${studyCenterAgreementHistory.studyCenterId} AND id = ${studyCenterAgreementHistory.id}`;
            
            dbConn.query(sql, (error, result) => 
            {
                if(error)
                {
                    return reject(error);
                }
    /////Check Any Agreement Exist For study center
                let sql1 = `SELECT scah.id FROM study_center_agreement_history scah WHERE scah.study_center_id = ${studyCenterAgreementHistory.studyCenterId}`;
                dbConn.query(sql1, (error1, result1) => 
                {
                    if(error1)
                    {
                        return reject(error1);
                    }
                    if(result1.length == 0)
                    {
    ///////Update Study Center Current Agreement Id
                        let sql2 = `UPDATE study_center SET current_agreement_history_id = NULL WHERE id = ${studyCenterAgreementHistory.studyCenterId}`;
                        dbConn.query(sql2, (error2, result2) => 
                        {
                            if(error2)
                            {
                                return reject(error2);
                            }
                            return resolve(result2);
                        });
                    }
                    else
                    {
                        return resolve(result);
                    }
                });
            });
        }
        catch(e)
        {
            throw e;
        }
    })
};

module.exports = db