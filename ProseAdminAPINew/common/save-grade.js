const commonFunction = require('../util/commonFunctions.js');
let dbCommon = require('../sqlmap/commonQuery.js');
let errorCodes = require('../util/errorCodes.js');
let errorCode = new errorCodes();
////////Variables 
let names;
let gradeCategoryId;
//////
let grade;
let gradeCategory;

module.exports = require('express').Router().post('/',async(req,res) =>
{
    try
    {
        let reqData = commonFunction.trimSpaces(req.body);
        let authData = reqData.authData;
        
        if(reqData.names != undefined && reqData.gradeCategory != undefined)
        {
            if(reqData.names != "" && reqData.gradeCategory.id != "")
            {
                names = reqData.names;
                gradeCategoryId = commonFunction.validateNumber(reqData.gradeCategory.id);

                ////Check Grade Category Exist
                gradeCategory = await dbCommon.getGradeCategory(gradeCategoryId);
                if(gradeCategory.length == 1)
                {
                    ////Check Duplicate Grade
                    grade = await dbCommon.duplicateGrade(names, gradeCategoryId);
                    if(grade.length == 0)
                    {                    
                ///insert Grade
                        let insertJSON = {
                            "names" : names,
                            "gradeCategoryId" : gradeCategoryId,
                            "createdById" : authData.id
                        }
                        let insertGradeResult = await dbCommon.insertGrade(insertJSON);
                        let insertGradeId = insertGradeResult.insertId;
            ///////
                        if(parseInt(insertGradeId) > 0)
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
                                "message" : "Grade Not Saved",
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
                            "message" : "Some Grades Already Exist For Grade Category " + grade[0].name,
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
                        "message" : "Grade Category Not Exist",
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
