const commonFunction = require('../util/commonFunctions.js');
let dbCommon = require('../sqlmap/commonQuery.js');
let errorCodes = require('../util/errorCodes.js');
let errorCode = new errorCodes();
////////Variables 
let name;
let gradeCategoryIds;
//////
let gradeCategory;
let syllabus;

module.exports = require('express').Router().post('/',async(req,res) =>
{
    try
    {
        let reqData = commonFunction.trimSpaces(req.body);
        let authData = reqData.authData;
        
        if(reqData.name != undefined && reqData.gradeCategoryIds != undefined)
        {
            if(reqData.name != "" && reqData.gradeCategoryIds != "")
            {
                name = reqData.name;
                gradeCategoryIds = reqData.gradeCategoryIds;

            ///Check GradeCategory Exist
                gradeCategory = await dbCommon.getGradeCategory(gradeCategoryIds);
                let gradeCategoryArray = gradeCategoryIds.toString().split(",");
                if(gradeCategory.length == gradeCategoryArray.length)
                { 
                ////Check Duplicate Syllabus
                    syllabus = await dbCommon.duplicateSyllabus(name);
                    if(syllabus.length == 0)
                    {                    
                ///insert Syllabus
                        let insertJSON = {
                            "name" : name,
                            "gradeCategoryIds" : gradeCategoryIds,
                            "createdById" : authData.id
                        }
                        let insertSyllabusResult = await dbCommon.insertSyllabus(insertJSON);
                        let insertSyllabusId = insertSyllabusResult.insertId;
            ///////
                        if(parseInt(insertSyllabusId) > 0)
                        {
                            res.status(200)
                            return res.json({
                                "id" : insertSyllabusId,
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
                                "message" : "Syllabus Not Saved",
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
                            "message" : "Syllabus Already Created",
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
                        "message" : "Some Grade Categories Are Invalid",
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
