const commonFunction = require('../util/commonFunctions.js');
let dbCommon = require('../sqlmap/commonQuery.js');
let errorCodes = require('../util/errorCodes.js');
let errorCode = new errorCodes();
////////Variables 
let id;
let gradeCategoryId;
//////
let syllabus;
let syllabusGradeCategory;

module.exports = require('express').Router().post('/',async(req,res) =>
{
    try
    {
        let reqData = commonFunction.trimSpaces(req.body);
        let authData = reqData.authData;
        if(reqData.id != undefined && reqData.gradeCategory != undefined)
        {
            if(reqData.id != "" && reqData.gradeCategory.id != "")
            {
                id = commonFunction.validateNumber(reqData.id);
                gradeCategoryId = commonFunction.validateNumber(reqData.gradeCategory.id);
                
                syllabusGradeCategory = await dbCommon.getSyllabusGradeCategory(id, gradeCategoryId);
                if(syllabusGradeCategory.length == 0)
                {
                    res.status(500)
                    return res.json({
                        "status_code" : 500,
                        "message" : "Grade Category Not Mapped With Syllabus",
                        "success" : false,
                        "error" : errorCode.getStatus(500),
                    })
                }
                syllabus = await dbCommon.getSyllabus(id);
                if(syllabus.length == 1)
                {
                    if(syllabus[0].syllabusId != null)
                    {
                        let updateResult = await dbCommon.deleteSyllabusGradeCategory(id, gradeCategoryId);
                        if(updateResult.affectedRows > 0)
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
                                "message" : "Grade Category Already Deleted",
                                "success" : false,
                                "error" : errorCode.getStatus(500),
                            })
                        }
                    }
                    else
                    {
                        res.status(500)
                        return res.json({
                            "status_code" : 500,
                            "message" : "Invalid Syllabus",
                            "success" : false,
                            "error" : errorCode.getStatus(500),
                        })
                    }
                }
                else
                {
                    res.status(500)
                    return res.json({
                        "status_code" : 500,
                        "message" : "Invalid Syllabus",
                        "success" : false,
                        "error" : errorCode.getStatus(500),
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
                    "error" : errorCode.getStatus(500),
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
