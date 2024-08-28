const buildJSON = require('./buildBusinessJSONs.js');
const commonFunction = require('../util/commonFunctions');
let dbBusiness = require('../sqlmap/businessQuery.js');
let errorCodes = require('../util/errorCodes.js');
let errorCode = new errorCodes();
////////Variables
let countryId;
let stateRegionId; 
let districtId;
let action;
//////
let cities;

module.exports = require('express').Router().get('/:countryId/:optParam?*', async(req,res) =>
{
    try
    {
        countryId = '';
        stateRegionId = '';
        districtId = '';
        action = '';

        // let tempParams = (req.params?.countryId + "/" + req.params[0]);
        let tempParams = req.params?.countryId;
        req.params[0] = req.params['optParam'] ? '/' + req.params['optParam'] + req.params[0] : req.params[0];
        tempParams = tempParams + (req.params[0].toString().indexOf("/") == -1 ? ("/" + req.params[0]) : req.params[0]);
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
            districtId = commonFunction.validateNumber(tempParams[2]);
        }
        else if(tempParams.length == 4)
        {
            countryId = commonFunction.validateNumber(tempParams[0]);
            stateRegionId = commonFunction.validateNumber(tempParams[1]);
            districtId = commonFunction.validateNumber(tempParams[2]);
            action = tempParams[3];
        }

        cities = await dbBusiness.getCities(countryId, stateRegionId, districtId, action);
        if(cities.length >= 0)
        {
            res.status(200)
            return res.json({
                "cities" : buildJSON.cities(cities),
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
