const commonFunction = require('../util/commonFunctions.js');
let dbUser = require('../sqlmap/userQuery.js');
let dbCommon = require('../sqlmap/commonQuery.js');
let errorCodes = require('../util/errorCodes.js');
// const currentAcademicSession = require('./current-academic-session.js');
let errorCode = new errorCodes();
//Variables 
let id;
let tableName;
//
let database;
let table;
let currentAcademicSession;

module.exports = require('express').Router().post('/',async(req,res) =>
{
    try
    {
        let reqData = commonFunction.trimSpaces(req.body);
        let authData = reqData.authData;
        if(reqData.id != undefined && reqData.tableName != undefined)
        {
            if(reqData.id != '' && reqData.tableName != '')
            {
                id = reqData.id;
                tableName = reqData.tableName;
                
                // check table exist
                table = await dbCommon.checkTableExist(tableName);
                if(table.length == 1)
                {
                    // check current academic session exist
                    currentAcademicSession = await dbCommon.getCurrentAcademicSession();
                    if(currentAcademicSession.length == 1)
                    {
                        let updateJson = {
                            "id" : id,
                            "tableName" : tableName,
                            "academicYearId" : currentAcademicSession[0].id,
                            "createdById" : authData.id
                        }
                        
                        let updateResult = await dbCommon.updateSubChapTopIsActive(updateJson);
                        if(updateResult.affectedRows > 0)
                        {
                            res.status(200);
                            res.json({
                                "status_code" : 200,
                                "success" : true,
                                "message" : errorCode.getStatus(200)
                            });
                        }
                        else
                        {
                            res.status(500);
                            res.json({
                                "status_code" : 500,
                                "success" : false,
                                "message" : "Update Failed",
                                "error" : errorCode.getStatus(500)
                            });
                        }
                    }
                    else
                    {
                        res.status(500);
                        res.json({
                            "status_code" : 500,
                            "success" : false,
                            "message" : "Current Session Not Exist",
                            "error" : errorCode.getStatus(500)
                        });
                    }
                }
                else
                {
                    res.status(500);
                    res.json({
                        "status_code" : 500,
                        "success" : false,
                        "message" : "Invalid Table Name",
                        "error" : errorCode.getStatus(500)
                    });
                }
            }
            else
            {
                res.status(500);
                res.json({
                    "status_code" : 500,
                    "success" : false,
                    "message" : "Some Values Are Not Filled",
                    "error" : errorCode.getStatus(500)
                });
            }
        }
        else
        {
            res.status(500);
            res.json({
                "status_code" : 500,
                "success" : false,
                "message" : "JSON Error",
                "error" : errorCode.getStatus(500)
            });
        }
    }
    catch(error)
    {
        res.status(500);
        res.json({
            "status_code" : 500,
            "success" : false,
            "message" : "Something Went Wrong",
            "error" : error?.stack
        });
    }    
});
