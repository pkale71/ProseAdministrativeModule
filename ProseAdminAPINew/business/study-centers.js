const buildJSON = require('./buildBusinessJSONs.js');
const commonFunction = require('../util/commonFunctions.js');
let dbBusiness = require('../sqlmap/businessQuery.js');
let errorCodes = require('../util/errorCodes.js');
let errorCode = new errorCodes();
////////Variables
let studyCenterTypeId;
//////
let studyCenters;

module.exports = require('express').Router().get('/?*', async(req,res) =>
{
    try
    {
        studyCenterTypeId = '';
        if(req.params)
        {
            studyCenterTypeId = commonFunction.validateNumber(req.params[0]);
        }

        studyCenters = await dbBusiness.getStudyCenters(studyCenterTypeId);
        if(studyCenters.length >= 0)
        {
            res.status(200)
            return res.json({
                "studyCenters" : buildJSON.studyCenters(studyCenters),
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
