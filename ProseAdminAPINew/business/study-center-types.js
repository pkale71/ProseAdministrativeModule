const buildJSON = require('./buildBusinessJSONs.js');
let dbBusiness = require('../sqlmap/businessQuery.js');
let errorCodes = require('../util/errorCodes.js');
let errorCode = new errorCodes();
////////Variables
//////
let studyCenterTypes;

module.exports = require('express').Router().get('/', async(req,res) =>
{
    try
    {
        studyCenterTypes = await dbBusiness.getStudyCenterTypes();
        if(studyCenterTypes.length >= 0)
        {
            res.status(200)
            return res.json({
                "studyCenterTypes" : buildJSON.studyCenterTypes(studyCenterTypes),
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
