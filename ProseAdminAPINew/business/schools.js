const buildJSON = require('./buildBusinessJSONs.js');
const commonFunction = require('../util/commonFunctions.js');
let dbBusiness = require('../sqlmap/businessQuery.js');
let errorCodes = require('../util/errorCodes.js');
let errorCode = new errorCodes();
////////Variables
let action;
let date;
//////
let schools;

module.exports = require('express').Router().get('/:optParam?*', async(req,res) =>
{
    try
    {
        action = "";
        date = "";
        if(req.params)
        {
            let tempParams = req.params['optParam'] + req.params[0];
            tempParams = tempParams.toString().split("/");
            if(tempParams.length == 1)
            {
                action = tempParams[0];
            }
            else if(tempParams.length == 2)
            {
                action = tempParams[0];
                date = tempParams[1];
            }
        }

        schools = await dbBusiness.getSchools(date, action);
        if(schools.length >= 0)
        {
            res.status(200)
            return res.json({
                "schools" : buildJSON.schools(schools),
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
