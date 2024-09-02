const commonFunction = require('../util/commonFunctions.js');
let dbCommon = require('../sqlmap/commonQuery.js');
let errorCodes = require('../util/errorCodes.js');
let errorCode = new errorCodes();
////////Variables 
let names;
let schoolingCategoryId;
//////
let schoolingProgram;
let schoolingCategory;

module.exports = require('express').Router().post('/',async(req,res) =>
{
    try
    {
        let reqData = commonFunction.trimSpaces(req.body);
        let authData = reqData.authData;
        
        if(reqData.names != undefined && reqData.schoolingCategory != undefined)
        {
            if(reqData.names != "" && reqData.schoolingCategory.id != "")
            {
                names = reqData.names;
                schoolingCategoryId = commonFunction.validateNumber(reqData.schoolingCategory.id);

            ////Check Schooling Category Exist
                schoolingCategory = await dbCommon.getSchoolingCategory(schoolingCategoryId);
                if(schoolingCategory.length == 1)
                {
                    ////Check Duplicate Schooling Program
                    schoolingProgram = await dbCommon.duplicateSchoolingProgram(names, schoolingCategoryId, '');
                    if(schoolingProgram.length == 0)
                    {                    
                ///insert Schooling Program
                        let insertJSON = {
                            "names" : names,
                            "schoolingCategoryId" : schoolingCategoryId,
                            "createdById" : authData.id
                        }
                        let insertSchoolingProgramResult = await dbCommon.insertSchoolingProgram(insertJSON);
                        let insertSchoolingProgramId = insertSchoolingProgramResult.insertId;
            ///////
                        if(parseInt(insertSchoolingProgramId) > 0)
                        {
                            res.status(200)
                            return res.json({
                                "status_code" : 200,
                                "success" : true,                            
                                "message" : errorCode.getStatus(200)
                            })
                        }
                        else
                        {
                            res.status(500)
                            return res.json({
                                "status_code" : 500,
                                "message" : "Schooling Program Not Saved",
                                "success" : false,
                                "error" : errorCode.getStatus(500)
                            })
                        }
                    }
                    else
                    {
                        res.status(500)
                        return res.json({
                            "status_code" : 500,
                            "message" : "Schooling Program Already Exist",
                            "success" : false,
                            "error" : errorCode.getStatus(500)
                        })
                    }
                }
                else
                {
                    res.status(500)
                    return res.json({
                        "status_code" : 500,
                        "message" : "Schooling Category Not Exist",
                        "success" : false,
                        "error" : errorCode.getStatus(500)
                    })
                }
            }
            else
            {
                res.status(500)
                return res.json({
                    "status_code" : 500,
                    "message" : "Some Values Are Not Filled",
                    "success" : false,
                    "error" : errorCode.getStatus(500)
                })
            }
        }
        else
        {
            res.status(500)
            return res.json({
                "status_code" : 500,
                "message" : "JSON Error",
                "success" : false,
                "error" : errorCode.getStatus(500)
            })
        }
    } 
    catch(e)
    {
        res.status(500)
        return res.json({
            "status_code" : 500,
            "message" : "Something Went Wrong",
            "success" : false,
            "error" : e
        });
    }
})
