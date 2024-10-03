const buildJSON = require('./buildCommonJSONs.js');
let dbCommon = require('../sqlmap/commonQuery.js');
let errorCodes = require('../util/errorCodes.js');
let errorCode = new errorCodes();
////////Variables 
//////
let subjectTypes;

module.exports = require('express').Router().get('/', async(req,res) =>
{
    try
    {
        subjectTypes = await dbCommon.getSubjectTypes();
        if(subjectTypes.length >= 0)
        {
            res.status(200)
            return res.json({
                "subjectTypes" : buildJSON.subjectTypes(subjectTypes),
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
