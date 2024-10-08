const buildJSON = require('./buildCommonJSONs.js');
const commonFunction = require('../util/commonFunctions.js');
let dbCommon = require('../sqlmap/commonQuery.js');
let errorCodes = require('../util/errorCodes.js');
let errorCode = new errorCodes();
//Variables 
let action;
//
let feeTypes;

module.exports = require('express').Router().get('/?*', async(req,res) =>
{
    try
    {
        action = '';

        let tempParams = req.params[0].split("/");
        action = tempParams[0];
        
        feeTypes = await dbCommon.getFeeTypes(action);
        if(feeTypes.length >= 0)
        {
            res.status(200)
            return res.json({
                "feeTypes" : buildJSON.feeTypes(feeTypes),
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
