const commonFunction = require('../util/commonFunctions.js');
let dbCommon = require('../sqlmap/commonQuery.js');
let errorCodes = require('../util/errorCodes.js');
let errorCode = new errorCodes();
////////Variables
let id; 
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
        
        if(reqData.id != undefined && reqData.gradeCategoryIds != undefined)
        {
            if(reqData.id != "" && reqData.gradeCategoryIds != "")
            {
                id = commonFunction.validateNumber(reqData.id);
                gradeCategoryIds = reqData.gradeCategoryIds;

            ///Check GradeCategory Exist
                gradeCategory = await dbCommon.getGradeCategory(gradeCategoryIds);
                let gradeCategoryArray = gradeCategoryIds.toString().split(",");
                if(gradeCategory.length == gradeCategoryArray.length)
                { 
                ////Check Syllabus Exist
                    syllabus = await dbCommon.getSyllabus(id);
                    if(syllabus.length == 1)
                    {
                        if(syllabus[0].syllabusId != null)
                        {  
                    //Check Syllabus Grade Category Already Exist
                            let tempGradeCategoryIds = syllabus[0].gradeCategoryIds.toString().split(",");
                            for(let c=0;c<tempGradeCategoryIds.length;c++)
                            {
                                if(gradeCategoryArray.indexOf(tempGradeCategoryIds[c]) > -1)
                                {
                                    res.status(500)
                                    return res.json({
                                        "status_code" : 500,
                                        "message" : "Some Grade Categories Already Mapped With Syllabus",
                                        "success" : false,
                                        "error" : errorCode.getStatus(500)
                                    })
                                }
                            }                
                    ///insert Syllabus
                            let updateJSON = {
                                "id" : id,
                                "gradeCategoryIds" : gradeCategoryIds,
                                "createdById" : authData.id
                            }
                            let updateSyllabusResult = await dbCommon.updateSyllabus(updateJSON);
                ///////
                            if(updateSyllabusResult.affectedRows > 0)
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
                                "message" : "Invalid Syllabus",
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
                            "message" : "Invalid Syllabus",
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
