const buildJSON = require('./buildBusinessJSONs.js');
const commonFunction = require('../util/commonFunctions');
let dbBusiness = require('../sqlmap/businessQuery.js');
let errorCodes = require('../util/errorCodes.js');
let errorCode = new errorCodes();
////////Variables
let countryId;
let stateRegionId; 
let action;
//////
let districts;

module.exports = require('express').Router().get('/:countryId/?*', async(req,res) =>
{
    try
    {
        countryId = '';
        stateRegionId = '';
        action = '';

        let tempParams = req.params?.countryId;
        // tempParams = tempParams + (req.params[0].toString().indexOf("/") == -1 ? ("/" + req.params[0]) : req.params[0]);
        tempParams = tempParams + (req.params[0].toString().indexOf("/") == -1 ? ("/" + req.params[0]) : (req.params[0].toString().indexOf("/") == -1 ? req.params[0] : ("/" + req.params[0])));

        tempParams = tempParams.toString().split("/");
        if(tempParams.length == 1)
        {
            countryId = commonFunction.validateNumber(tempParams[0]);
        }
        else if(tempParams.length == 2)
        {
            countryId = commonFunction.validateNumber(tempParams[0]);
            stateRegionId = commonFunction.validateNumber(tempParams[1]);
        }
        else if(tempParams.length == 3)
        {
            countryId = commonFunction.validateNumber(tempParams[0]);
            stateRegionId = commonFunction.validateNumber(tempParams[1]);
            action = tempParams[2];
        }

        districts = await dbBusiness.getDistricts(countryId, stateRegionId, action);
        if(districts.length >= 0)
        {
            res.status(200)
            return res.json({
                "districts" : buildJSON.districts(districts),
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
