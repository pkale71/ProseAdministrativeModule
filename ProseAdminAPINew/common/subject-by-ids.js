const buildJSON = require('./buildCommonJSONs.js');
const commonFunction = require('../util/commonFunctions.js');
let dbCommon = require('../sqlmap/commonQuery.js');
let errorCodes = require('../util/errorCodes.js');
let errorCode = new errorCodes();
//variables
let ids;
//
let subjects;

module.exports = require('express').Router().get('/:ids', async(req,res) =>
{
    try
    {
        ids = req.params?.ids;
        subjects = await dbCommon.getSubjectByIds(ids);
        if(subjects.length >= 0)
        {
            res.status(200)
            return res.json({
                "subjects" : buildJSON.subjects(subjects),
                "status_code" : 200,
                "success" : true,                            
                "message" : errorCode.getStatus(200)
            });
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
});
