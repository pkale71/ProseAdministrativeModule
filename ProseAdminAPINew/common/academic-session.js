const buildJSON = require('./buildCommonJSONs.js');
let dbCommon = require('../sqlmap/commonQuery.js');
const commonFunction = require('../util/commonFunctions');
let errorCodes = require('../util/errorCodes.js');
let errorCode = new errorCodes();
////////Variables 
let id;
//////
let academicSession;

module.exports = require('express').Router().get('/:id', async(req,res) =>
{
    try
    {
        id = commonFunction.validateNumber(req.params?.id);
        academicSession = await dbCommon.getAcademicSession(id);
        if(academicSession.length >= 0)
        {
            res.status(200)
            return res.json({
                "academicSession" : buildJSON.academicSessions(academicSession, 0),
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
