const buildJSON = require('./buildAdmissionJSONs.js');
const commonFunction = require('../util/commonFunctions.js');
let dbCommon = require('../sqlmap/commonQuery.js');
let dbAdmission = require('../sqlmap/admissionQuery.js');
let errorCodes = require('../util/errorCodes.js');
let errorCode = new errorCodes();
//Variables 
let uuid;
//
let sportEngagment;

module.exports = require('express').Router().get('/:uuid', async(req,res) =>
{
    try
    {
        uuid = req.params?.uuid;
        
        sportEngagment = await dbAdmission.getApplicationSportEngagement(uuid);
        if(sportEngagment.length >= 0)
        {
            res.status(200)
            return res.json({
                "sportEngagment" : buildJSON.applicationSportEngagement(sportEngagment),
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
            "error" : e
        });
    }
});