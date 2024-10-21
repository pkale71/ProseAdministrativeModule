const buildJSON = require('./buildCommonJSONs.js');
const commonFunction = require('../util/commonFunctions.js');
let dbCommon = require('../sqlmap/commonQuery.js');
let errorCodes = require('../util/errorCodes.js');
let errorCode = new errorCodes();
////////Variables 
let id;
//////
let schoolingProgram;

module.exports = require('express').Router().get('/:id', async(req,res) =>
{
    try
    {
        id = req.params?.id;
        
        schoolingProgram = await dbCommon.getSchoolingProgram(id);
        if(schoolingProgram.length >= 0)
        {
            res.status(200)
            return res.json({
                "schoolingProgram" : buildJSON.schoolingProgrmas(schoolingProgram, 0),
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
