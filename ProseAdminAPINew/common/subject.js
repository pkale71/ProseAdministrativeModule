const buildJSON = require('./buildCommonJSONs');
const commonFunction = require('../util/commonFunctions');
let dbCommon = require('../sqlmap/commonQuery.js');
let errorCodes = require('../util/errorCodes.js');
let errorCode = new errorCodes();
//variables
let id;
//
let subject;

module.exports = require('express').Router().get('/:id', async(req,res) =>
{
    try
    {
        id = commonFunction.validateNumber(req.params?.id);
        subject = await dbCommon.getSubject(id);
        if(subject.length >= 0)
        {
            res.status(200)
            return res.json({
                "subject" : buildJSON.subjects(subject, 0),
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
