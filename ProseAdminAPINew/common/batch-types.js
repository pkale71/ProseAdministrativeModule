const commonFunction = require('../util/commonFunctions.js');
const buildJSON = require('./buildCommonJSONs.js');
let dbCommon = require('../sqlmap/commonQuery.js');
let errorCodes = require('../util/errorCodes.js');
let errorCode = new errorCodes();
////////Variables
let academicSessionId;
let action; 
//////
let batchTypes;

module.exports = require('express').Router().get('/?*', async(req,res) =>
{
    try
    {
        academicSessionId = '';
        action = '';
        let tempParams = req.params[0].split("/");
        if(tempParams.length == 1)
        {
            academicSessionId = commonFunction.validateNumber(tempParams[0]);
        }
        else if(tempParams.length == 2)
        {
            academicSessionId = commonFunction.validateNumber(tempParams[0]);
            action = tempParams[1];
        }
        
        batchTypes = await dbCommon.getBatchTypes(academicSessionId, action);
        if(batchTypes.length >= 0)
        {
            res.status(200)
            return res.json({
                "batchTypes" : buildJSON.batchTypes(batchTypes),
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
