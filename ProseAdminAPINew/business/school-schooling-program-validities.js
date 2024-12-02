const buildJSON = require('./buildBusinessJSONs.js');
const commonFunction = require('../util/commonFunctions.js');
let dbBusiness = require('../sqlmap/businessQuery.js');
let errorCodes = require('../util/errorCodes.js');
let errorCode = new errorCodes();
////////Variables
let uuid;
let schoolSchoolingProgramId;
let action;
//////
let school;
let schoolSchoolingProgramValidities;

module.exports = require('express').Router().get('/:uuid/:schoolSchoolingProgramId/:optParam?*', async(req,res) =>
{
    try
    {
        let tempParams = req.params?.uuid + '/' + req.params?.schoolSchoolingProgramId;
        req.params[0] = req.params['optParam'] ? '/' + req.params['optParam'] + req.params[0] : req.params[0];
        tempParams = tempParams + (req.params[0].toString().indexOf("/") == -1 ? ("/" + req.params[0]) : req.params[0]);
        
        tempParams = tempParams.toString().split("/");
        
        if(tempParams.length == 1)
        {
            uuid = tempParams[0];
        }
        else if(tempParams.length == 2)
        {
            uuid = tempParams[0];
            schoolSchoolingProgramId = tempParams[1];
        }
        else if(tempParams.length == 3)
        {
            uuid = tempParams[0];
            schoolSchoolingProgramId = tempParams[1];
            action = tempParams[2];
        }
        
        school = await dbBusiness.getSchool(uuid);
        if(school.length == 0)
        {
            res.status(500)
            return res.json({
                "status_code" : 500,
                "message" : "School Not Exist",
                "success" : false,
                "error" : errorCode.getStatus(500)
            })
        }
        schoolSchoolingProgramValidities = await dbBusiness.getSchoolSchoolingProgramValidities(school[0].id, schoolSchoolingProgramId, action);
        if(schoolSchoolingProgramValidities.length >= 0)
        {
            res.status(200)
            return res.json({
                "schoolSchoolingProgramValidities" : buildJSON.schoolSchoolingProgramValidities(schoolSchoolingProgramValidities),
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
