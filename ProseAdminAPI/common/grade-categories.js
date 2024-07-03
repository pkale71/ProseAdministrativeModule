const buildJSON = require('./buildCommonJSONs.js');
let dbCommon = require('../sqlmap/commonQuery.js');
let errorCodes = require('../util/errorCodes.js');
let errorCode = new errorCodes();
////////Variables
let action; 
//////
let gradeCategories;

module.exports = require('express').Router().get('/?*', async(req,res) =>
{
    try
    {
        action = req.params[0];
        
        gradeCategories = await dbCommon.getGradeCategories(action);
        if(gradeCategories.length >= 0)
        {
            res.status(200)
            return res.json({
                "gradeCategories" : buildJSON.gradeCategories(gradeCategories),
                "status_code" : 200,
                "success" : true,                            
                "message" : errorCode.getStatus(200)
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
            "error" : e,
        });
    }
})
