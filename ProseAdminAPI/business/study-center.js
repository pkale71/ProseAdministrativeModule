const buildJSON = require('./buildBusinessJSONs.js');
const commonFunction = require('../util/commonFunctions.js');
let dbBusiness = require('../sqlmap/businessQuery.js');
let errorCodes = require('../util/errorCodes.js');
let errorCode = new errorCodes();
////////Variables
let uuid;
//////
let studyCenter;

module.exports = require('express').Router().get('/:uuid', async(req,res) =>
{
    try
    {
        uuid = '';
        uuid = req.params.uuid;

        studyCenter = await dbBusiness.getStudyCenter(uuid);
        if(studyCenter.length >= 0)
        {
            res.status(200)
            return res.json({
                "studyCenter" : buildJSON.studyCenters(studyCenter, 0),
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
