const commonFunction = require('../util/commonFunctions.js');
const dbCommon = require('../sqlmap/commonQuery.js');
const errorCodes = require('../util/errorCodes.js');
let errorCode = new errorCodes();
// variable
let id;
//
let chapter;

module.exports = require('express').Router().post('/', async(req, res) => 
{
    try 
    {
        reqData = commonFunction.trimSpaces(req.body);
        authData = reqData.authData;
        if(reqData != undefined)
        {
            if(reqData.id != '')
            {
                id = commonFunction.validateNumber(reqData.id);

                chapter = await dbCommon.checkInUseSubjectExist(id);
                if(chapter.length == 0)
                {
                    let updateSubjectResult = await dbCommon.deleteSubject(id);
                    if(updateSubjectResult.affectedRows > 0)
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
                            "message" : "Subject Already Deleted.",
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
                        "message" : "Subject Currently In Use",
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
            res.status(500)
            res.json({
                "status_code" : 500,
                "success" : false,
                "message" : "JSON Error",
                "error" : errorCode.getStatus(500)
            });
        }        
    } 
    catch (error) 
    {        
        res.status(500);
        res.json({
            "status_code" : 500,
            "success" : false,
            "message" : "Something Went Wrong",
            "error" : error
        });
    }
});