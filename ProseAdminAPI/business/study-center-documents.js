const buildJSON = require('./buildBusinessJSONs.js');
let dbBusiness = require('../sqlmap/businessQuery.js');
let errorCodes = require('../util/errorCodes.js');
let errorCode = new errorCodes();
////////Variables
let studyCenterUUID; 
//////
let studyCenter;
let studyCenterDocuments;

module.exports = require('express').Router().get('/:studyCenterUUID', async(req,res) =>
{
    try
    {
        studyCenterUUID = req.params.studyCenterUUID;

        studyCenter = await dbBusiness.getStudyCenter(studyCenterUUID);
        if(studyCenter.length == 1)
        {
            studyCenterDocuments = await dbBusiness.getStudyCenterDocuments(studyCenter[0].id);
            if(studyCenterDocuments.length >= 0)
            {
                res.status(200)
                return res.json({
                    "studyCenterDocuments" : buildJSON.studyCenterDocuments(studyCenterDocuments),
                    "status_code" : 200,
                    "success" : true,                            
                    "message" : errorCode.getStatus(200)
                })
            } 
        }
        else
        {
            res.status(500)
            return res.json({
                "status_code" : 500,
                "message" : "Invalid Study Center",
                "success" : false,
                "error" : errorCode.getStatus(500),
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
})
