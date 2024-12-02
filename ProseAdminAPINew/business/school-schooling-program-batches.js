const buildJSON = require('./buildBusinessJSONs.js');
const commonFunction = require('../util/commonFunctions.js');
let dbBusiness = require('../sqlmap/businessQuery.js');
let errorCodes = require('../util/errorCodes.js');
let errorCode = new errorCodes();
////////Variables
let uuid;
let schoolingProgramId;
let date;
//////
let school;
let schoolSchoolingProgramBatches;

module.exports = require('express').Router().get('/:uuid/:schoolingProgramId/:date', async(req,res) =>
{
    try
    {
        uuid = req.params?.uuid;
        schoolingProgramId = commonFunction.validateNumber(req.params?.schoolingProgramId);
        date = req.params?.date;
        
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
        schoolSchoolingProgramBatches = await dbBusiness.getSchoolSchoolingProgramBatches(school[0].id, schoolingProgramId, date);
        if(schoolSchoolingProgramBatches.length >= 0)
        {
            res.status(200)
            return res.json({
                "schoolSchoolingProgramBatches" : buildJSON.schoolSchoolingProgramBatches(schoolSchoolingProgramBatches),
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
