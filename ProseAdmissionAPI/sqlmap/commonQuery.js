let dbConn = require('../util/dbConnection');
const commonFunction = require('../util/commonFunctions');
const { resolve } = require('path');
const { error } = require('console');
const { promises } = require('dns');
let db = {};

db.getAppBase = (moduleId) =>
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT api_url AS apiUrl, ui_url AS uiUrl FROM app_base ab 
            WHERE ab.module_id = ${moduleId}`;
            
            dbConn.query(sql, (error, result) => 
            {
                if(error)
                {
                    return reject(error);
                }    
                return resolve(result);
            });
        }
        catch(e)
        {
            throw e;
        }
    })
};

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
            WHERE (ug.code = 'MOADM' OR ug.code = 'MOUSR') AND auth_token='${token}'`
            
            dbConn.query(sql, (error, result) => 
            {
                if(error)
                {
                    return reject(error);
                }    
                return resolve(result);
            });
        }
        catch(e)
        {
            throw e;
        }
    })
};

db.getCurrencies = () =>
{
    return new Promise((resolve, reject) =>
    {
        try
        {
            let sql = `SELECT acu.id, acu.name
            FROM admission_currency acu`;
            
            dbConn.query(sql, (error, result) => 
            {
                if(error)
                {
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

db.getCurrency = (id) =>
{
    return new Promise((resolve, reject) =>
    {
        try
        {
            let sql = `SELECT acu.id, acu.name
            FROM admission_currency acu 
            WHERE acu.id = ${id}`;
            
            dbConn.query(sql, (error, result) => 
            {
                if(error)
                {
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

db.getTaxTypes = (action) =>
{
    return new Promise((resolve, reject) =>
    {
        try
        {
            let filters = "";
            let sql = `SELECT att.id, att.name, att.is_active AS isActive, 'admission_tax_type' AS tableName,
            COUNT(atr.id) AS isExist
            FROM admission_tax_type att
            LEFT JOIN admission_tax_rate atr ON atr.tax_type_id = att.id`;
            
            if(action == 'Active')
            {
                if(filters == "")
                {
                    filters = filters + ` WHERE att.is_active = 1`;
                }
                else
                {
                    filters = filters + ` AND att.is_active = 1`;
                }
            }
            
            sql = sql + filters + ` GROUP BY att.id ORDER BY att.name`;

            dbConn.query(sql, (error, result) => 
            {
                if(error)
                {
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

db.getTaxType = (id) =>
{
    return new Promise((resolve, reject) =>
    {
        try
        {
            let sql = `SELECT att.id, att.name, att.is_active AS isActive
            FROM admission_tax_type att 
            WHERE FIND_IN_SET(att.id, '${id}') > 0`;
    
            dbConn.query(sql, (error, result) => 
            {
                if(error)
                {
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

db.duplicateTaxType = (name, id) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT att.id, att.name, att.is_active AS isActive
            FROM admission_tax_type att
            WHERE att.name = '${name}'`;

            if(id != "")
            {
                sql = sql + ` AND att.id != ${id}`;
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

db.insertTaxType = (taxType) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `INSERT INTO admission_tax_type (name, created_on, created_by_id)
            VALUES ('${taxType.name}', NOW(), ${taxType.createdById})`;
                        
            dbConn.query(sql, (error, result) => 
            {
                if(error)
                {
                    return reject(error);
                }
                return resolve(result);
            });
        }
        catch(e)
        {
            throw e;
        }
    })
};  

db.updateTaxType = (taxType) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `UPDATE admission_tax_type SET name = '${taxType.name}', 
            updated_on = NOW(), updated_by_id = ${taxType.createdById} WHERE id = ${taxType.id}`;
            
            dbConn.query(sql, (error, result) => 
            {
                if(error)
                {
                    return reject(error);
                }
                return resolve(result);
            });
        }
        catch(e)
        {
            throw e;
        }
    })
};

db.checkTaxTypeExist = (id) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT atr.id
            FROM admission_tax_rate atr WHERE atr.tax_type_id = ${id}`;
            
            dbConn.query(sql, (error, result) => 
            {
                if(error)
                {
                    return reject(error);
                }
                return resolve(result);
            });
        }
        catch(e)
        {
            throw e;
        }
    })
};

db.deleteTaxType = (id) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `DELETE FROM admission_tax_type WHERE id = ${id}`;            
            dbConn.query(sql, (error, result) => 
            {
                if(error)
                {
                    return reject(error);
                }
                return resolve(result);
            });
        }            

        catch(e)
        {
            throw e;
        }
    })
};

db.getTaxRates = (academicSessionId, taxTypeId, action) =>
{
    return new Promise((resolve, reject) =>
    {
        try
        {
            let filters = "";
            let sql = `SELECT atr.id, atr.rate, atr.is_active AS isActive, 'admission_tax_rate' AS tableName,
            att.id AS taxTypeId, att.name AS taxTypeName,
            acs.id AS academicSessionId, acs.year AS academicSessionYear,
            COUNT(afstr.id) AS isExist
            FROM admission_tax_rate atr
            JOIN admission_tax_type att ON att.id = atr.tax_type_id
            JOIN academic_session acs ON acs.id = atr.academic_session_id
            LEFT JOIN admission_fee_structure_tax_rate afstr ON afstr.tax_rate_id = atr.id`;
            
            if(academicSessionId != '')
            {
                if(filters == "")
                {
                    filters = filters + ` WHERE atr.academic_session_id = ${academicSessionId}`;
                }
                else
                {
                    filters = filters + ` AND atr.academic_session_id = ${academicSessionId}`;
                }
            }
            if(taxTypeId != '')
            {
                if(filters == "")
                {
                    filters = filters + ` WHERE atr.tax_type_id = ${taxTypeId}`;
                }
                else
                {
                    filters = filters + ` AND atr.tax_type_id = ${taxTypeId}`;
                }
            }
            if(action == 'Active')
            {
                if(filters == "")
                {
                    filters = filters + ` WHERE atr.is_active = 1`;
                }
                else
                {
                    filters = filters + ` AND atr.is_active = 1`;
                }
            }
            
            sql = sql + filters + ` GROUP BY atr.id ORDER BY atr.id`;

            dbConn.query(sql, (error, result) => 
            {
                if(error)
                {
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

db.getTaxRate = (id) =>
{
    return new Promise((resolve, reject) =>
    {
        try
        {
            let sql = `SELECT atr.id, atr.rate, atr.is_active AS isActive, 
            att.id AS taxTypeId, att.name AS taxTypeName,
            acs.id AS academicSessionId, acs.year AS academicSessionYear
            FROM admission_tax_rate atr
            JOIN admission_tax_type att ON att.id = atr.tax_type_id
            JOIN academic_session acs ON acs.id = atr.academic_session_id 
            WHERE FIND_IN_SET (atr.id, '${id}') > 0`;

            dbConn.query(sql, (error, result) => 
            {
                if(error)
                {
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

db.duplicateTaxRate = (academicSessionId, taxTypeId, rate, id) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT atr.id
            FROM admission_tax_rate atr
            WHERE atr.academic_session_id = ${academicSessionId} AND atr.tax_type_id = ${taxTypeId}
             AND atr.rate = ${rate}`;

            if(id != "")
            {
                sql = sql + ` AND atr.id != ${id}`;
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

db.insertTaxRate = (taxRate) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `INSERT INTO admission_tax_rate (academic_session_id, tax_type_id, rate, created_on, created_by_id)
            VALUES (${taxRate.academicSessionId}, ${taxRate.taxTypeId}, ${taxRate.rate}, NOW(), ${taxRate.createdById})`;
            
            dbConn.query(sql, (error, result) => 
            {
                if(error)
                {
                    return reject(error);
                }
                return resolve(result);
            });
        }
        catch(e)
        {
            throw e;
        }
    })
};  

db.updateTaxRate = (taxRate) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `UPDATE admission_tax_rate SET academic_session_id = ${taxRate.academicSessionId}, tax_type_id = ${taxRate.taxTypeId}, rate = ${taxRate.rate},
            updated_on = NOW(), updated_by_id = ${taxRate.createdById} WHERE id = ${taxRate.id}`;
            
            dbConn.query(sql, (error, result) => 
            {
                if(error)
                {
                    return reject(error);
                }
                return resolve(result);
            });
        }
        catch(e)
        {
            throw e;
        }
    })
};

db.checkTaxRateExist = (id) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT afstr.id
            FROM admission_fee_structure_tax_rate afstr WHERE afstr.tax_rate_id = ${id}`;
            
            dbConn.query(sql, (error, result) => 
            {
                if(error)
                {
                    return reject(error);
                }
                return resolve(result);
            });
        }
        catch(e)
        {
            throw e;
        }
    })
};

db.deleteTaxRate = (id) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `DELETE FROM admission_tax_rate WHERE id = ${id}`;            
            dbConn.query(sql, (error, result) => 
            {
                if(error)
                {
                    return reject(error);
                }
                return resolve(result);
            });
        }            

        catch(e)
        {
            throw e;
        }
    })
};

db.getFeeTypes = (action) =>
{
    return new Promise((resolve, reject) =>
    {
        try
        {
            let filters = "";
            let sql = `SELECT aft.id, aft.name, aft.code, aft.is_active AS isActive, 'admission_fee_type' AS tableName,
            COUNT(afsft.id) AS isExist
            FROM admission_fee_type aft
            LEFT JOIN admission_fee_structure_fee_type afsft ON afsft.fee_type_id = aft.id`;
            
            if(action == 'Active')
            {
                if(filters == "")
                {
                    filters = filters + ` WHERE aft.is_active = 1`;
                }
                else
                {
                    filters = filters + ` AND aft.is_active = 1`;
                }
            }
            
            sql = sql + filters + ` GROUP BY aft.id ORDER BY aft.name`;

            dbConn.query(sql, (error, result) => 
            {
                if(error)
                {
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

db.getFeeType = (id) =>
{
    return new Promise((resolve, reject) =>
    {
        try
        {
            let sql = `SELECT aft.id, aft.name, aft.code, aft.is_active AS isActive
            FROM admission_fee_type aft 
            WHERE FIND_IN_SET(aft.id, '${id}') > 0`;
    
            dbConn.query(sql, (error, result) => 
            {
                if(error)
                {
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

db.duplicateFeeType = (name, code, id) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT aft.id, aft.name, aft.is_active AS isActive
            FROM admission_fee_type aft`;
            if(code != '')
            {
                sql = sql + ` WHERE (aft.name = '${name}' OR aft.code = '${code}')`;
            }
            else
            {
                sql = sql + ` WHERE aft.name = '${name}'`
            }

            if(id != "")
            {
                sql = sql + ` AND aft.id != ${id}`;
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

db.insertFeeType = (feeType) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `INSERT INTO admission_fee_type (name, code, created_on, created_by_id)
            VALUES ('${feeType.name}', '${feeType.code}', NOW(), ${feeType.createdById})`;
                        
            dbConn.query(sql, (error, result) => 
            {
                if(error)
                {
                    return reject(error);
                }
                return resolve(result);
            });
        }
        catch(e)
        {
            throw e;
        }
    })
};  

db.updateFeeType = (feeType) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `UPDATE admission_fee_type SET name = '${feeType.name}', 
            updated_on = NOW(), updated_by_id = ${feeType.createdById} WHERE id = ${feeType.id}`;
            
            dbConn.query(sql, (error, result) => 
            {
                if(error)
                {
                    return reject(error);
                }
                return resolve(result);
            });
        }
        catch(e)
        {
            throw e;
        }
    })
};

db.checkFeeTypeExist = (id) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT afsft.id
            FROM admission_fee_structure_fee_type afsft WHERE afsft.fee_type_id = ${id}`;
            
            dbConn.query(sql, (error, result) => 
            {
                if(error)
                {
                    return reject(error);
                }
                return resolve(result);
            });
        }
        catch(e)
        {
            throw e;
        }
    })
};

db.deleteFeeType = (id) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `DELETE FROM admission_fee_type WHERE id = ${id}`;            
            dbConn.query(sql, (error, result) => 
            {
                if(error)
                {
                    return reject(error);
                }
                return resolve(result);
            });
        }            

        catch(e)
        {
            throw e;
        }
    })
};

db.getDiscountTypes = (action) =>
{
    return new Promise((resolve, reject) =>
    {
        try
        {
            let filters = "";
            let sql = `SELECT adt.id, adt.name, adt.code, adt.is_active AS isActive, 'admission_discount_type' AS tableName,
            COUNT(afsdt.id) AS isExist
            FROM admission_discount_type adt
            LEFT JOIN admission_fee_structure_discount_type afsdt ON afsdt.discount_type_id = adt.id`;
            
            if(action == 'Active')
            {
                if(filters == "")
                {
                    filters = filters + ` WHERE adt.is_active = 1`;
                }
                else
                {
                    filters = filters + ` AND adt.is_active = 1`;
                }
            }
            
            sql = sql + filters + ` GROUP BY adt.id ORDER BY adt.name`;

            dbConn.query(sql, (error, result) => 
            {
                if(error)
                {
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

db.getDiscountType = (id) =>
{
    return new Promise((resolve, reject) =>
    {
        try
        {
            let sql = `SELECT adt.id, adt.name, adt.code, adt.is_active AS isActive
            FROM admission_discount_type adt 
            WHERE FIND_IN_SET(adt.id, '${id}') > 0`;
    
            dbConn.query(sql, (error, result) => 
            {
                if(error)
                {
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

db.duplicateDiscountType = (name, code, id) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT adt.id, adt.name, adt.is_active AS isActive
            FROM admission_discount_type adt`;
            if(code != '')
            {
                sql = sql + ` WHERE (adt.name = '${name}' OR adt.code = '${code}')`;
            }
            else
            {
                sql = sql + ` WHERE adt.name = '${name}'`
            }

            if(id != "")
            {
                sql = sql + ` AND adt.id != ${id}`;
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

db.insertDiscountType = (discountType) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `INSERT INTO admission_discount_type (name, code, created_on, created_by_id)
            VALUES ('${discountType.name}', '${discountType.code}', NOW(), ${discountType.createdById})`;
                        
            dbConn.query(sql, (error, result) => 
            {
                if(error)
                {
                    return reject(error);
                }
                return resolve(result);
            });
        }
        catch(e)
        {
            throw e;
        }
    })
};  

db.updateDiscountType = (discountType) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `UPDATE admission_discount_type SET name = '${discountType.name}', 
            updated_on = NOW(), updated_by_id = ${discountType.createdById} WHERE id = ${discountType.id}`;
            
            dbConn.query(sql, (error, result) => 
            {
                if(error)
                {
                    return reject(error);
                }
                return resolve(result);
            });
        }
        catch(e)
        {
            throw e;
        }
    })
};

db.checkDiscountTypeExist = (id) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT afsdt.id
            FROM admission_fee_structure_discount_type afsdt WHERE afsdt.discount_type_id = ${id}`;
            
            dbConn.query(sql, (error, result) => 
            {
                if(error)
                {
                    return reject(error);
                }
                return resolve(result);
            });
        }
        catch(e)
        {
            throw e;
        }
    })
};

db.deleteDiscountType = (id) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `DELETE FROM admission_discount_type WHERE id = ${id}`;            
            dbConn.query(sql, (error, result) => 
            {
                if(error)
                {
                    return reject(error);
                }
                return resolve(result);
            });
        }            

        catch(e)
        {
            throw e;
        }
    })
};

db.getFeeCategories = (action) =>
{
    return new Promise((resolve, reject) =>
    {
        try
        {
            let filters = "";
            let sql = `SELECT afc.id, afc.name, afc.availing_installment AS availingInstallment, afc.is_active AS isActive, 'admission_fee_category' AS tableName,
            COUNT(afs.id) AS isExist
            FROM admission_fee_category afc
            LEFT JOIN admission_fee_structure afs ON afs.fee_category_id = afc.id`;
            
            if(action == 'Active')
            {
                if(filters == "")
                {
                    filters = filters + ` WHERE afc.is_active = 1`;
                }
                else
                {
                    filters = filters + ` AND afc.is_active = 1`;
                }
            }
            
            sql = sql + filters + ` GROUP BY afc.id ORDER BY afc.name`;

            dbConn.query(sql, (error, result) => 
            {
                if(error)
                {
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

db.getFeeCategory = (id) =>
{
    return new Promise((resolve, reject) =>
    {
        try
        {
            let sql = `SELECT afc.id, afc.name, afc.availing_installment AS availingInstallment, afc.is_active AS isActive
            FROM admission_fee_category afc 
            WHERE afc.id = ${id}`;
    
            dbConn.query(sql, (error, result) => 
            {
                if(error)
                {
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

db.duplicateFeeCategory = (name, id) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT afc.id, afc.name, afc.is_active AS isActive
            FROM admission_fee_category afc 
            WHERE afc.name = '${name}'`;
            if(id != "")
            {
                sql = sql + ` AND afc.id != ${id}`;
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

db.insertFeeCategory = (feeCategory) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `INSERT INTO admission_fee_category (name, availing_installment, created_on, created_by_id)
            VALUES ('${feeCategory.name}', ${feeCategory.availingInstallment}, NOW(), ${feeCategory.createdById})`;
                        
            dbConn.query(sql, (error, result) => 
            {
                if(error)
                {
                    return reject(error);
                }
                return resolve(result);
            });
        }
        catch(e)
        {
            throw e;
        }
    })
};  

db.updateFeeCategory = (feeCategory) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `UPDATE admission_fee_category SET name = '${feeCategory.name}', availing_installment = ${feeCategory.availingInstallment}, 
            updated_on = NOW(), updated_by_id = ${feeCategory.createdById} WHERE id = ${feeCategory.id}`;
            
            dbConn.query(sql, (error, result) => 
            {
                if(error)
                {
                    return reject(error);
                }
                return resolve(result);
            });
        }
        catch(e)
        {
            throw e;
        }
    })
};

db.checkFeeCategoryExist = (id) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT afs.id
            FROM admission_fee_structure afs WHERE afs.fee_category_id = ${id}`;
            
            dbConn.query(sql, (error, result) => 
            {
                if(error)
                {
                    return reject(error);
                }
                return resolve(result);
            });
        }
        catch(e)
        {
            throw e;
        }
    })
};

db.deleteFeeCategory = (id) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `DELETE FROM admission_fee_category WHERE id = ${id}`;            
            dbConn.query(sql, (error, result) => 
            {
                if(error)
                {
                    return reject(error);
                }
                return resolve(result);
            });
        }            

        catch(e)
        {
            throw e;
        }
    })
};

db.getStudentDocuments = (action) =>
{
    return new Promise((resolve, reject) =>
    {
        try
        {
            let filters = "";
            let sql = `SELECT asd.id, asd.name, asd.is_active AS isActive, 'admission_student_document' AS tableName
            FROM admission_student_document asd`;
            
            if(action == 'Active')
            {
                if(filters == "")
                {
                    filters = filters + ` WHERE asd.is_active = 1`;
                }
                else
                {
                    filters = filters + ` AND asd.is_active = 1`;
                }
            }
            
            sql = sql + filters + ` GROUP BY asd.id ORDER BY asd.name`;

            dbConn.query(sql, (error, result) => 
            {
                if(error)
                {
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

db.getStudentDocument = (id) =>
{
    return new Promise((resolve, reject) =>
    {
        try
        {
            let sql = `SELECT asd.id, asd.name, asd.is_active AS isActive
            FROM admission_student_document asd 
            WHERE asd.id = ${id}`;
    
            dbConn.query(sql, (error, result) => 
            {
                if(error)
                {
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

db.duplicateStudentDocument = (name, id) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT asd.id, asd.name, asd.is_active AS isActive
            FROM admission_student_document asd`;
            sql = sql + ` WHERE asd.name = '${name}'`
            
            if(id != "")
            {
                sql = sql + ` AND asd.id != ${id}`;
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

db.insertStudentDocument = (studentDocument) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `INSERT INTO admission_student_document (name, created_on, created_by_id)
            VALUES ('${studentDocument.name}', NOW(), ${studentDocument.createdById})`;
                        
            dbConn.query(sql, (error, result) => 
            {
                if(error)
                {
                    return reject(error);
                }
                return resolve(result);
            });
        }
        catch(e)
        {
            throw e;
        }
    })
};  

db.deleteStudentDocument = (id) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `DELETE FROM admission_student_document WHERE id = ${id}`;            
            dbConn.query(sql, (error, result) => 
            {
                if(error)
                {
                    return reject(error);
                }
                return resolve(result);
            });
        }            

        catch(e)
        {
            throw e;
        }
    })
};

db.getExitReasonTypes = () =>
{
    return new Promise((resolve, reject) =>
    {
        try
        {
            let sql = `SELECT aert.id, aert.name FROM admission_exit_reason_type aert ORDER BY aert.name`;

            dbConn.query(sql, (error, result) => 
            {
                if(error)
                {
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

db.getExitReasonType = (id) =>
{
    return new Promise((resolve, reject) =>
    {
        try
        {
            let sql = `SELECT aert.id, aert.name FROM admission_exit_reason_type aert WHERE aert.id = ${id}`;

            dbConn.query(sql, (error, result) => 
            {
                if(error)
                {
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

db.getCourseExitReasons = (extiReasonTypeId, action) =>
{
    return new Promise((resolve, reject) =>
    {
        try
        {
            let filters = "";
            let sql = `SELECT acer.id, acer.name, acer.is_active AS isActive, 'admission_course_exit_reason' AS tableName,
            acert.id AS courseExitReasonTypeId, acert.name AS courseExitReasonTypeName
            FROM admission_course_exit_reason acer 
            JOIN admission_exit_reason_type acert ON acert.id = acer.exit_reason_type_id`;
            
            if(extiReasonTypeId != '')
            {
                if(filters == "")
                {
                    filters = filters + ` WHERE acer.exit_reason_type_id = ${extiReasonTypeId}`;
                }
                else
                {
                    filters = filters + ` AND acer.exit_reason_type_id = ${extiReasonTypeId}`;
                }
            }

            if(action == 'Active')
            {
                if(filters == "")
                {
                    filters = filters + ` WHERE acer.is_active = 1`;
                }
                else
                {
                    filters = filters + ` AND acer.is_active = 1`;
                }
            }
            
            sql = sql + filters + ` GROUP BY acer.id ORDER BY acer.name`;

            dbConn.query(sql, (error, result) => 
            {
                if(error)
                {
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

db.getCourseExitReason = (id) =>
{
    return new Promise((resolve, reject) =>
    {
        try
        {
            let sql = `SELECT acer.id, acer.name, acer.is_active AS isActive, 
            acert.id AS courseExitReasonTypeId, acert.name AS courseExitReasonTypeName
            FROM admission_course_exit_reason acer 
            JOIN admission_exit_reason_type acert ON acert.id = acer.exit_reason_type_id 
            WHERE acer.id = ${id}`;
    
            dbConn.query(sql, (error, result) => 
            {
                if(error)
                {
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

db.duplicateCourseExitReason = (name, exitReasonTypeId, id) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT acer.id, acer.name, acer.is_active AS isActive
            FROM admission_course_exit_reason acer 
            WHERE acer.name = '${name}' AND acer.exit_reason_type_id = ${exitReasonTypeId}`;
            if(id != "")
            {
                sql = sql + ` AND acer.id != ${id}`;
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

db.insertCourseExitReason = (courseExitReason) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `INSERT INTO admission_course_exit_reason (name, exit_reason_type_id, created_on, created_by_id)
            VALUES ('${courseExitReason.name}', ${courseExitReason.exitReasonTypeId}, NOW(), ${courseExitReason.createdById})`;
                        
            dbConn.query(sql, (error, result) => 
            {
                if(error)
                {
                    return reject(error);
                }
                return resolve(result);
            });
        }
        catch(e)
        {
            throw e;
        }
    })
};  

db.updateCourseExitReason = (courseExitReason) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `UPDATE admission_course_exit_reason SET name = '${courseExitReason.name}', exit_reason_type_id = ${courseExitReason.exitReasonTypeId}, 
            updated_on = NOW(), updated_by_id = ${courseExitReason.createdById} WHERE id = ${courseExitReason.id}`;
            
            dbConn.query(sql, (error, result) => 
            {
                if(error)
                {
                    return reject(error);
                }
                return resolve(result);
            });
        }
        catch(e)
        {
            throw e;
        }
    })
};

db.deleteCourseExitReason = (id) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `DELETE FROM admission_course_exit_reason WHERE id = ${id}`;            
            dbConn.query(sql, (error, result) => 
            {
                if(error)
                {
                    return reject(error);
                }
                return resolve(result);
            });
        }            

        catch(e)
        {
            throw e;
        }
    })
};

db.getGradeSections = (schoolUUID, academicSessionId, syllabusId, gradeCategoryId, gradeId, batchTypeId, action) =>
{
    return new Promise((resolve, reject) =>
    {
        try
        {
            let filters = "";
            let sql = `SELECT GROUP_CONCAT(ags.id ORDER BY ags.section) AS id, GROUP_CONCAT(ags.section ORDER BY ags.section) AS section, 
            GROUP_CONCAT(ags.is_active ORDER BY ags.section) AS isActive, 'admission_grade_section' AS tableName,
            sch.uuid AS schoolUUID, sch.name AS schoolName,
            acs.id AS academicSessionId, acs.year AS academicSessionYear,
            s.id AS syllabusId, s.name AS syllabusName,
            gc.id AS gradeCategoryId, gc.name gradeCategoryName,
            g.id AS gradeId, g.name gradeName,
            bt.id AS batchTypeId, bt.name AS batchTypeName
            FROM admission_grade_section ags
            JOIN school sch ON sch.id = ags.school_id
            JOIN academic_session acs ON acs.id = ags.academic_session_id
            JOIN syllabus s ON s.id = ags.syllabus_id
            JOIN grade_category gc ON gc.id = ags.grade_category_id
            JOIN grade g ON g.id = ags.grade_id
            JOIN batch_type bt ON bt.id = ags.batch_type_id`;
            
            if(schoolUUID != '')
            {
                if(filters == "")
                {
                    filters = filters + ` WHERE sch.uuid = '${schoolUUID}'`;
                }
                else
                {
                    filters = filters + ` AND sch.uuid = '${schoolUUID}'`;
                }
            }
            if(academicSessionId != '')
            {
                if(filters == "")
                {
                    filters = filters + ` WHERE ags.academic_session_id = ${academicSessionId}`;
                }
                else
                {
                    filters = filters + ` AND ags.academic_session_id = ${academicSessionId}`;
                }
            }
            if(syllabusId != '')
            {
                if(filters == "")
                {
                    filters = filters + ` WHERE ags.syllabus_id = ${syllabusId}`;
                }
                else
                {
                    filters = filters + ` AND ags.syllabus_id = ${syllabusId}`;
                }
            }
            if(gradeCategoryId != '')
            {
                if(filters == "")
                {
                    filters = filters + ` WHERE ags.grade_category_id = ${gradeCategoryId}`;
                }
                else
                {
                    filters = filters + ` AND ags.grade_category_id = ${gradeCategoryId}`;
                }
            }
            if(gradeId != '')
            {
                if(filters == "")
                {
                    filters = filters + ` WHERE ags.grade_id = ${gradeId}`;
                }
                else
                {
                    filters = filters + ` AND ags.grade_id = ${gradeId}`;
                }
            }
            if(batchTypeId != '')
            {
                if(filters == "")
                {
                    filters = filters + ` WHERE ags.batch_type_id = ${batchTypeId}`;
                }
                else
                {
                    filters = filters + ` AND ags.batch_type_id = ${batchTypeId}`;
                }
            }
            if(action == 'Active')
            {
                if(filters == "")
                {
                    filters = filters + ` WHERE ags.is_active = 1`;
                }
                else
                {
                    filters = filters + ` AND ags.is_active = 1`;
                }
            }
            
            sql = sql + filters + ` GROUP BY ags.school_id, ags.academic_session_id, ags.syllabus_id, ags.grade_category_id, ags.grade_id, ags.batch_type_id
            ORDER BY ags.section`;

            dbConn.query(sql, (error, result) => 
            {
                if(error)
                {
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

db.getLastGradeSection = (schoolId, academicSessionId, syllabusId, gradeCategoryId, gradeId, batchTypeId) =>
{
    return new Promise((resolve, reject) =>
    {
        try
        {
            let sql = `SELECT ASCII(ags.section) AS sectionAscii
            FROM admission_grade_section ags
            WHERE ags.school_id = ${schoolId} 
            AND ags.academic_session_id = ${academicSessionId} 
            AND ags.syllabus_id = ${syllabusId} 
            AND ags.grade_category_id = ${gradeCategoryId} 
            AND ags.grade_id = ${gradeId} 
            AND ags.batch_type_id = ${batchTypeId} 
            ORDER BY ags.id DESC LIMIT 1`;

            dbConn.query(sql, (error, result) => 
            {
                if(error)
                {
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

db.insertGradeSection = (gradeSection) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sqlValues = '';
            for(let k=0;k<gradeSection.totalSection;k++)
            {
                if(sqlValues == '')
                {
                    sqlValues = `(${gradeSection.schoolId}, ${gradeSection.academicSessionId}, ${gradeSection.syllabusId}, ${gradeSection.gradeCategoryId}, ${gradeSection.gradeId}, ${gradeSection.batchTypeId}, CONVERT(CHAR(${gradeSection.lastSectionASCII}), CHAR), NOW(), ${gradeSection.createdById})`;
                }
                else
                {
                    sqlValues = sqlValues + `, (${gradeSection.schoolId}, ${gradeSection.academicSessionId}, ${gradeSection.syllabusId}, ${gradeSection.gradeCategoryId}, ${gradeSection.gradeId}, ${gradeSection.batchTypeId}, CONVERT(CHAR(${gradeSection.lastSectionASCII}), CHAR), NOW(), ${gradeSection.createdById})`;
                }
                gradeSection.lastSectionASCII = parseInt(gradeSection.lastSectionASCII) + 1;
            }
            let sql = `INSERT INTO admission_grade_section (school_id, academic_session_id, syllabus_id, grade_category_id, grade_id, batch_type_id, section, created_on, created_by_id)
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

db.deleteGradeSection = (id) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `DELETE FROM admission_grade_section WHERE id = ${id}`;            
            dbConn.query(sql, (error, result) => 
            {
                if(error)
                {
                    return reject(error);
                }
                return resolve(result);
            });
        }            

        catch(e)
        {
            throw e;
        }
    })
};

db.getSubjectGroups = (syllabusId, gradeCategoryId, gradeId, action) =>
{
    return new Promise((resolve, reject) =>
    {
        try
        {
            let filters = "";
            let sql = `SELECT asg.id, asg.group_name AS groupName, asg.min_subject AS minSubject, asg.max_subject AS maxSubject, asg.is_active AS isActive, 'admission_subject_group' AS tableName,
            s.id AS syllabusId, s.name AS syllabusName,
            gc.id AS gradeCategoryId, gc.name gradeCategoryName,
            g.id AS gradeId, g.name gradeName
            FROM admission_subject_group asg
            JOIN syllabus s ON s.id = asg.syllabus_id
            JOIN grade_category gc ON gc.id = asg.grade_category_id
            JOIN grade g ON g.id = asg.grade_id`;
            
            if(syllabusId != '')
            {
                if(filters == "")
                {
                    filters = filters + ` WHERE asg.syllabus_id = ${syllabusId}`;
                }
                else
                {
                    filters = filters + ` AND asg.syllabus_id = ${syllabusId}`;
                }
            }
            if(gradeCategoryId != '')
            {
                if(filters == "")
                {
                    filters = filters + ` WHERE asg.grade_category_id = ${gradeCategoryId}`;
                }
                else
                {
                    filters = filters + ` AND asg.grade_category_id = ${gradeCategoryId}`;
                }
            }
            if(gradeId != '')
            {
                if(filters == "")
                {
                    filters = filters + ` WHERE asg.grade_id = ${gradeId}`;
                }
                else
                {
                    filters = filters + ` AND asg.grade_id = ${gradeId}`;
                }
            }
            if(action == 'Active')
            {
                if(filters == "")
                {
                    filters = filters + ` WHERE asg.is_active = 1`;
                }
                else
                {
                    filters = filters + ` AND asg.is_active = 1`;
                }
            }
            
            sql = sql + filters + ` GROUP BY asg.id ORDER BY asg.group_name`;

            dbConn.query(sql, (error, result) => 
            {
                if(error)
                {
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

db.getSubjectGroup = (id) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT asg.id, asg.group_name AS groupName, asg.min_subject AS minSubject, asg.max_subject AS maxSubject, asg.is_active AS isActive, 'admission_subject_group' AS tableName,
            s.id AS syllabusId, s.name AS syllabusName,
            gc.id AS gradeCategoryId, gc.name gradeCategoryName,
            g.id AS gradeId, g.name gradeName
            FROM admission_subject_group asg
            JOIN syllabus s ON s.id = asg.syllabus_id
            JOIN grade_category gc ON gc.id = asg.grade_category_id
            JOIN grade g ON g.id = asg.grade_id
            WHERE asg.id = ${id}`;

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

db.duplicateSubjectGroup = (name, id) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `SELECT asg.id, asg.group_name, asg.is_active AS isActive
            FROM admission_subject_group asg 
            WHERE asg.group_name = '${name}'`;
            if(id != "")
            {
                sql = sql + ` AND asg.id != ${id}`;
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

db.insertSubjectGroup = (subjectGroup) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let tempSubjectIds = (subjectGroup.subjectIds).toString().split(",");
            
            let sql = `INSERT INTO admission_subject_group (syllabus_id, grade_category_id, grade_id, group_name, min_subject, max_subject, created_on, created_by_id)
            VALUES (${subjectGroup.syllabusId}, ${subjectGroup.gradeCategoryId}, ${subjectGroup.gradeId}, '${subjectGroup.groupName}', ${subjectGroup.minSubject}, ${subjectGroup.maxSubject}, NOW(), ${subjectGroup.createdById})`;
              
            dbConn.query(sql, (error, result) => 
            {
                if(error)
                {
                    return reject(error);
                }
                if(result.insertId > 0)
                {
                    let sqlValues = '';
                    for(let k=0;k<tempSubjectIds.length;k++)
                    {
                        if(sqlValues == '')
                        {
                            sqlValues = `(${result.insertId}, ${tempSubjectIds[k]}, NOW(), ${subjectGroup.createdById})`;
                        }
                        else
                        {
                            sqlValues = sqlValues +`, (${result.insertId}, ${tempSubjectIds[k]}, NOW(), ${subjectGroup.createdById})`;
                        }
                    }
                    let sql1 = `INSERT INTO admission_subject_group_allocation (subject_group_id, subject_id, created_on, created_by_id)
                    VALUES ${sqlValues}`;
                    dbConn.query(sql1, (error1, result1) => 
                    {
                        if(error1)
                        {
                            return reject(error1);
                        }
                        return resolve(result);
                    })
                }
                
            });
        }
        catch(e)
        {
            throw e;
        }
    })
};

db.updateSubjectGroup = (subjectGroup) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `UPDATE admission_subject_group SET syllabus_id = ${subjectGroup.syllabusId}, grade_category_id = ${subjectGroup.gradeCategoryId}, grade_id = ${subjectGroup.gradeId}, group_name = '${subjectGroup.groupName}', min_subject = ${subjectGroup.minSubject}, max_subject = ${subjectGroup.maxSubject}, updated_on = NOW(), updated_by_id = ${subjectGroup.createdById} 
            WHERE id = ${subjectGroup.id}`;
                
            dbConn.query(sql, (error, result) => 
            {
                if(error)
                {
                    return reject(error);
                }
                return resolve(result);
            });
        }
        catch(e)
        {
            throw e;
        }
    })
};

db.deleteSubjectGroup = (id) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `DELETE FROM admission_subject_group WHERE id = ${id}`;            
            dbConn.query(sql, (error, result) => 
            {
                if(error)
                {
                    return reject(error);
                }

                let sql1 = `DELETE FROM admission_subject_group_allocation WHERE subject_group_id = ${id}`;            
                dbConn.query(sql1, (error1, result1) => 
                {
                    if(error1)
                    {
                        return reject(error1);
                    }
                    return resolve(result);
                });
            });
        }            

        catch(e)
        {
            throw e;
        }
    })
};

db.getSubjectGroupAllocations = (subjectGroupId, action) =>
{
    return new Promise((resolve, reject) =>
    {
        try
        {
            let filters = "";
            let sql = `SELECT asga.id, asga.is_active AS isActive, 'admission_subject_group_allocation' AS tableName,
            asg.id AS subjectGroupId, asg.group_name AS subjectGroupName, asg.min_subject AS minSubject, asg.max_subject AS maxSubject,
            sub.id AS subjectId, sub.name AS subjectName
            FROM admission_subject_group_allocation asga
            JOIN admission_subject_group asg ON asg.id = asga.subject_group_id
            JOIN subject sub ON sub.id = asga.subject_id 
            WHERE asga.subject_group_id = ${subjectGroupId}`;
            
            if(action == 'Active')
            {
                if(filters == "")
                {
                    filters = filters + ` WHERE asga.is_active = 1`;
                }
                else
                {
                    filters = filters + ` AND asga.is_active = 1`;
                }
            }
            
            sql = sql + filters + ` GROUP BY asga.id ORDER BY asga.id`;

            dbConn.query(sql, (error, result) => 
            {
                if(error)
                {
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

db.getSubjectGroupAllocationsBySubjectIds = (subjectGroupId, subjectIds) =>
{
    return new Promise((resolve, reject) =>
    {
        try
        {
            let filters = "";
            let sql = `SELECT GROUP_CONCAT(sub.id) AS subjectId, GROUP_CONCAT(sub.name) AS subjectName
            FROM admission_subject_group_allocation asga
            JOIN subject sub ON sub.id = asga.subject_id 
            WHERE asga.subject_group_id = ${subjectGroupId} 
            AND FIND_IN_SET(asga.subject_id, '${subjectIds}') > 0 
            GROUP BY asga.subject_group_id`;

            dbConn.query(sql, (error, result) => 
            {
                if(error)
                {
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

db.insertSubjectGroupAllocation = (subjectGroupAllocation) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let tempSubjectIds = (subjectGroupAllocation.subjectIds).toString().split(",");
            let sqlValues = '';
            for(let k=0;k<tempSubjectIds.length;k++)
            {
                if(sqlValues == '')
                {
                    sqlValues = `(${subjectGroupAllocation.subjectGroupId}, ${tempSubjectIds[k]}, NOW(), ${subjectGroupAllocation.createdById})`;
                }
                else
                {
                    sqlValues = sqlValues +`, (${subjectGroupAllocation.subjectGroupId}, ${tempSubjectIds[k]}, NOW(), ${subjectGroupAllocation.createdById})`;
                }
            }
            let sql = `INSERT INTO admission_subject_group_allocation (subject_group_id, subject_id, created_on, created_by_id)
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

db.deleteSubjectGroupAllocation = (id, subjectGroupId) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `DELETE FROM admission_subject_group_allocation WHERE id = ${id} AND subject_group_id=${subjectGroupId}`;            
            dbConn.query(sql, (error, result) => 
            {
                if(error)
                {
                    return reject(error);
                }

                return resolve(result);
            });
        }            

        catch(e)
        {
            throw e;
        }
    })
};

db.getFeeStructures = (schoolUUID, schoolingProgramId, academicSessionId, batchYearId, syllabusId, gradeCategoryId, action) =>
{
    return new Promise((resolve, reject) =>
    {
        try
        {
            let filters = "";
            let sql = `SELECT afs.id, afs.uuid, afs.total_installment AS totalInstallment, afs.validity_from AS validityFrom, afs.validity_to AS validityTo, 
            afs.tax_applicable AS taxApplicable, afs.is_active AS isActive, 'admission_fee_structure' AS tableName, 
            sch.uuid AS schoolUUID, sch.name AS schoolName,
            sp.id AS schoolingProgramId, sp.name AS schoolingProgramName,
            bas.id AS batchYearId, bas.batch_year AS batchYear,
            acs.id AS academicSessionId, acs.year AS academicSessionYear,
            s.id AS syllabusId, s.name AS syllabusName,
            gc.id AS gradeCategoryId, gc.name AS gradeCategoryName,
            afc.id AS feeCategoryId, afc.name feeCategoryName,
            acur.id AS currencyId, acur.name currencyName
            FROM admission_fee_structure afs
            JOIN school sch ON sch.id = afs.school_id
            JOIN schooling_program sp ON sp.id = afs.schooling_program_id
            JOIN academic_session bas ON bas.id = afs.batch_year_id
            JOIN academic_session acs ON acs.id = afs.academic_session_id
            JOIN syllabus s ON s.id = afs.syllabus_id
            JOIN grade_category gc ON gc.id = afs.grade_category_id
            JOIN admission_fee_category afc ON afc.id = afs.fee_category_id
            JOIN admission_currency acur ON acur.id = afs.currency_id`;
            
            if(schoolUUID != '')
            {
                if(filters == "")
                {
                    filters = filters + ` WHERE sch.uuid = '${schoolUUID}'`;
                }
                else
                {
                    filters = filters + ` AND sch.uuid = '${schoolUUID}'`;
                }
            }
            if(schoolingProgramId != '')
            {
                if(filters == "")
                {
                    filters = filters + ` WHERE afs.schooling_program_id = ${schoolingProgramId}`;
                }
                else
                {
                    filters = filters + ` AND afs.schooling_program_id = ${schoolingProgramId}`;
                }
            }
            if(academicSessionId != '')
            {
                if(filters == "")
                {
                    filters = filters + ` WHERE afs.academic_session_id = ${academicSessionId}`;
                }
                else
                {
                    filters = filters + ` AND afs.academic_session_id = ${academicSessionId}`;
                }
            }
            if(batchYearId != '')
            {
                if(filters == "")
                {
                    filters = filters + ` WHERE afs.batch_year_id = ${batchYearId}`;
                }
                else
                {
                    filters = filters + ` AND afs.batch_year_id = ${batchYearId}`;
                }
            }
            if(syllabusId != '')
            {
                if(filters == "")
                {
                    filters = filters + ` WHERE afs.syllabus_id = ${syllabusId}`;
                }
                else
                {
                    filters = filters + ` AND afs.syllabus_id = ${syllabusId}`;
                }
            }
            if(gradeCategoryId != '')
            {
                if(filters == "")
                {
                    filters = filters + ` WHERE afs.grade_category_id = ${gradeCategoryId}`;
                }
                else
                {
                    filters = filters + ` AND afs.grade_category_id = ${gradeCategoryId}`;
                }
            }
            if(action == 'Active')
            {
                if(filters == "")
                {
                    filters = filters + ` WHERE afs.is_active = 1`;
                }
                else
                {
                    filters = filters + ` AND afs.is_active = 1`;
                }
            }
            
            sql = sql + filters + ` GROUP BY afs.id
            ORDER BY afc.name`;

            dbConn.query(sql, (error, result) => 
            {
                if(error)
                {
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

db.getFeeStructure = (uuid) =>
{
    return new Promise((resolve, reject) =>
    {
        try
        {
            let sql = `SELECT afs.id, afs.uuid, afs.total_installment AS totalInstallment, afs.validity_from AS validityFrom, afs.validity_to AS validityTo, 
            afs.tax_applicable AS taxApplicable, afs.is_active AS isActive,
            sch.uuid AS schoolUUID, sch.name AS schoolName,
            sp.id AS schoolingProgramId, sp.name AS schoolingProgramName,
            bas.id AS batchYearId, bas.batch_year AS batchYear,
            acs.id AS academicSessionId, acs.year AS academicSessionYear,
            s.id AS syllabusId, s.name AS syllabusName,
            gc.id AS gradeCategoryId, gc.name AS gradeCategoryName,
            afc.id AS feeCategoryId, afc.name feeCategoryName,
            acur.id AS currencyId, acur.name currencyName
            FROM admission_fee_structure afs
            JOIN school sch ON sch.id = afs.school_id
            JOIN schooling_program sp ON sp.id = afs.schooling_program_id
            JOIN academic_session bas ON bas.id = afs.batch_year_id
            JOIN academic_session acs ON acs.id = afs.academic_session_id
            JOIN syllabus s ON s.id = afs.syllabus_id
            JOIN grade_category gc ON gc.id = afs.grade_category_id
            JOIN admission_fee_category afc ON afc.id = afs.fee_category_id
            JOIN admission_currency acur ON acur.id = afs.currency_id
            WHERE afs.uuid = '${uuid}'`;

            dbConn.query(sql, (error, result) => 
            {
                if(error)
                {
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

db.getFeeStructureInstallments = (feeStructureId) =>
{
    return new Promise((resolve, reject) =>
    {
        try
        {
            let sql = `SELECT afsi.id, afsi.name, afsi.installment_rate AS installmentRate, afsi.due_date AS dueDate, afsi.is_active AS isActive
            FROM admission_fee_structure_installment afsi
            WHERE afsi.fee_structure_id = ${feeStructureId}`;

            dbConn.query(sql, (error, result) => 
            {
                if(error)
                {
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

db.getFeeStructureFeeTypes = (feeStructureId) =>
{
    return new Promise((resolve, reject) =>
    {
        try
        {
            let sql = `SELECT afsft.id, afsft.amount, afsft.is_active AS isActive,
            aft.id AS feeTypeId, aft.name AS feeTypeName
            FROM admission_fee_structure_fee_type afsft
            JOIN admission_fee_type aft ON aft.id = afsft.fee_type_id
            WHERE afsft.fee_structure_id = ${feeStructureId}`;

            dbConn.query(sql, (error, result) => 
            {
                if(error)
                {
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

db.getFeeStructureDiscountTypes = (feeStructureId) =>
{
    return new Promise((resolve, reject) =>
    {
        try
        {
            let sql = `SELECT afsdt.id, afsdt.amount, afsdt.is_active AS isActive,
            adt.id AS discountTypeId, adt.name AS discountTypeName
            FROM admission_fee_structure_discount_type afsdt
            JOIN admission_discount_type adt ON adt.id = afsdt.discount_type_id
            WHERE afsdt.fee_structure_id = ${feeStructureId}`;

            dbConn.query(sql, (error, result) => 
            {
                if(error)
                {
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

db.getFeeStructureTaxRates = (feeStructureId) =>
{
    return new Promise((resolve, reject) =>
    {
        try
        {
            let sql = `SELECT afstr.id, afstr.is_active AS isActive,
            att.id AS taxTypeId, att.name AS taxTypeName,
            atr.id AS taxRateId, atr.rate AS taxRate
            FROM admission_fee_structure_tax_rate afstr
            JOIN admission_tax_type att ON att.id = afstr.tax_type_id
            JOIN admission_tax_rate atr ON atr.id = afstr.tax_rate_id
            WHERE afstr.fee_structure_id = ${feeStructureId}`;

            dbConn.query(sql, (error, result) => 
            {
                if(error)
                {
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

db.getFeeStructureTotals = (feeStructureId) =>
{
    return new Promise((resolve, reject) =>
    {
        try
        {
            let sql = `SELECT afst.id, afstr.id AS feeStructureTaxRateId,
            afst.total_amount AS totalAmount, afst.total_discount AS totalDiscount,
            afst.net_amount AS netAmount, afst.tax_amount AS taxAmount, afst.gross_amount AS grossAmount, 
            att.id AS taxTypeId, att.name AS taxTypeName,
            atr.id AS taxRateId, atr.rate AS taxRate
            FROM admission_fee_structure_totals afst
            LEFT JOIN admission_fee_structure_tax_rate afstr ON afstr.id = afst.fee_structure_tax_rate_id
            LEFT JOIN admission_tax_type att ON att.id = afstr.tax_type_id
            LEFT JOIN admission_tax_rate atr ON atr.id = afstr.tax_rate_id
            WHERE afst.fee_structure_id = ${feeStructureId}`;

            dbConn.query(sql, (error, result) => 
            {
                if(error)
                {
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

db.insertfeeStructure = (feeStructure) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `INSERT INTO admission_fee_structure (uuid, school_id, schooling_program_id, batch_year_id, academic_session_id, syllabus_id, grade_category_id, fee_category_id, currency_id, total_installment, validity_from, validity_to, tax_applicable, created_on, created_by_id)
            VALUES ('${feeStructure.uuid}', ${feeStructure.schoolId}, ${feeStructure.schoolingProgramId}, ${feeStructure.batchYearId}, ${feeStructure.academicSessionId}, ${feeStructure.syllabusId}, ${feeStructure.gradeCategoryId}, ${feeStructure.feeCategoryId}, ${feeStructure.currencyId}, ${feeStructure.totalInstallment}, '${feeStructure.validityFrom}', '${feeStructure.validityTo}', ${feeStructure.taxApplicable}, NOW(), ${feeStructure.createdById})`;
            dbConn.query(sql, (error, result) => 
            {
                if(error)
                {
                    return reject(error);
                }
                let feeStructureId = result.insertId;
    /////Fee Installments
                let sqlValues1 = "";
                for(let i=0;i<feeStructure.feeStructureInstallments.length;i++)
                {
                    let installment = feeStructure.feeStructureInstallments[i];
                    if(sqlValues1 == "") 
                    {
                        sqlValues1 = `(${feeStructureId}, '${installment.name}', ${installment.installmentPercent}, '${installment.dueDate}', NOW(), ${feeStructure.createdById})`;
                    }
                    else
                    {
                        sqlValues1 = sqlValues1 + `, (${feeStructureId}, '${installment.name}', ${installment.installmentPercent}, '${installment.dueDate}', NOW(), ${feeStructure.createdById})`;
                    }
                }
                if(sqlValues1 != "")
                {
                    let sql1 = `INSERT INTO admission_fee_structure_installment (fee_structure_id, name, installment_rate, due_date, created_on, created_by_id)
                    VALUES ${sqlValues1}`;
                    dbConn.query(sql1, (error1, result1) => 
                    {
                        if(error1)
                        {
                            return reject(error1);
                        }
                    });
                }
    /////Fee Types
                let sqlValues2 = "";
                for(let i=0;i<feeStructure.feeStructureFeeTypes.length;i++)
                {
                    let tempFeeType = feeStructure.feeStructureFeeTypes[i];
                    if(sqlValues2 == "") 
                    {
                        sqlValues2 = `(${feeStructureId}, ${tempFeeType.feeType.id}, ${tempFeeType.amount}, NOW(), ${feeStructure.createdById})`;
                    }
                    else
                    {
                        sqlValues2 = sqlValues2 + `, (${feeStructureId}, ${tempFeeType.feeType.id}, ${tempFeeType.amount}, NOW(), ${feeStructure.createdById})`;
                    }
                }
                if(sqlValues2 != "")
                {
                    let sql2 = `INSERT INTO admission_fee_structure_fee_type (fee_structure_id, fee_type_id, amount, created_on, created_by_id)
                    VALUES ${sqlValues2}`;
                    dbConn.query(sql2, (error2, result2) => 
                    {
                        if(error2)
                        {
                            return reject(error2);
                        }
                    });
                }
    /////Discount Types
                let sqlValues3 = "";
                for(let i=0;i<feeStructure.feeStructureDiscountTypes.length;i++)
                {
                    let tempDiscountType = feeStructure.feeStructureDiscountTypes[i];
                    if(sqlValues3 == "")
                    {
                        sqlValues3 = `(${feeStructureId}, ${tempDiscountType.discountType.id}, ${tempDiscountType.amount}, NOW(), ${feeStructure.createdById})`;
                    }
                    else
                    {
                        sqlValues3 = sqlValues3 + `, (${feeStructureId}, ${tempDiscountType.discountType.id}, ${tempDiscountType.amount}, NOW(), ${feeStructure.createdById})`; 
                    }
                }
                if(sqlValues3 != "")
                {
                    let sql3 = `INSERT INTO admission_fee_structure_discount_type (fee_structure_id, discount_type_id, amount, created_on, created_by_id)
                    VALUES ${sqlValues3}`;
                    dbConn.query(sql3, (error3, result3) => 
                    {
                        if(error3)
                        {
                            return reject(error3);
                        }
                    });
                }
    /////Tax Rates
                for(let i=0;i<feeStructure.feeStructureTaxRates.length;i++)
                {
                    let tempTaxRate = feeStructure.feeStructureTaxRates[i];
                    let sql4 = `INSERT INTO admission_fee_structure_tax_rate (fee_structure_id, tax_type_id, tax_rate_id, created_on, created_by_id)
                    VALUES (${feeStructureId}, ${tempTaxRate.taxType.id}, ${tempTaxRate.taxRate.id}, NOW(), ${feeStructure.createdById})`;
                    dbConn.query(sql4, (error4, result4) => 
                    {
                        if(error4)
                        {
                            return reject(error4);
                        }
                        feeStructure.feeStructureTotals[i].feeStructureTaxRateId = result4.insertId;

                        let tempTaxRate = feeStructure.feeStructureTotals[i];
                        let sql5 = `INSERT INTO admission_fee_structure_totals (fee_structure_id, fee_structure_tax_rate_id, total_amount, total_discount, net_amount, tax_amount, gross_amount)
                        VALUES (${feeStructureId}, NULLIF('${tempTaxRate.feeStructureTaxRateId}', ''), ${tempTaxRate.totalAmount}, ${tempTaxRate.totalDiscount}, ${tempTaxRate.netAmount}, ${tempTaxRate.taxAmount}, ${tempTaxRate.grossAmount})`;
                    
                        dbConn.query(sql5, (error5, result5) => 
                        {
                            if(error5)
                            {
                                return reject(error5);
                            }
                        });
                    });
                }
    /////Totals
                if(feeStructure.feeStructureTaxRates.length == 0)
                {
                    for(let i=0;i<feeStructure.feeStructureTotals.length;i++)
                    {
                        let tempTaxRate = feeStructure.feeStructureTotals[i];
                        let sql5 = `INSERT INTO admission_fee_structure_totals (fee_structure_id, fee_structure_tax_rate_id, total_amount, total_discount, net_amount, tax_amount, gross_amount)
                        VALUES (${feeStructureId}, NULLIF('${tempTaxRate.feeStructureTaxRateId}', ''), ${tempTaxRate.totalAmount}, ${tempTaxRate.totalDiscount}, ${tempTaxRate.netAmount}, ${tempTaxRate.taxAmount}, ${tempTaxRate.grossAmount})`;
                    
                        dbConn.query(sql5, (error5, result5) => 
                        {
                            if(error5)
                            {
                                return reject(error5);
                            }
                        });
                    }
                }
                return resolve(result);
            });
        }
        catch(e)
        {
            throw e;
        }
    })
};

db.deleteFeeStructure = (id) => 
{
    return new Promise((resolve, reject) => 
    {
        try
        {
            let sql = `DELETE FROM admission_fee_structure_installment WHERE fee_structure_id = ${id};
            DELETE FROM admission_fee_structure_fee_type WHERE fee_structure_id = ${id};
            DELETE FROM admission_fee_structure_discount_type WHERE fee_structure_id = ${id};
            DELETE FROM admission_fee_structure_tax_rate WHERE fee_structure_id = ${id};
            DELETE FROM admission_fee_structure_totals WHERE fee_structure_id = ${id};
            DELETE FROM admission_fee_structure WHERE id = ${id};`;            
            dbConn.query(sql, (error, result) => 
            {
                if(error)
                {
                    return reject(error);
                }
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