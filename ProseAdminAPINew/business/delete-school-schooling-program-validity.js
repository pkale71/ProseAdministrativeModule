const buildJSON = require('./buildBusinessJSONs.js');
const commonFunction = require('../util/commonFunctions.js');
let dbBusiness = require('../sqlmap/businessQuery.js');
let errorCodes = require('../util/errorCodes.js');
let errorCode = new errorCodes();
////////Variables
let id; 
//////
let schoolSchoolingProgramValidity;

module.exports = require('express').Router().post('/', async(req,res) =>
{
    try
    {
        let reqData = commonFunction.trimSpaces(req.body);
        id = reqData.id;
        let authData = reqData.authData;
       
        schoolSchoolingProgramValidity = await dbBusiness.getSchoolSchoolingProgramValidity(id);
        if(schoolSchoolingProgramValidity.length == 1)
        {
            ///delete School Schooling program validity
            let deleteResult = await dbBusiness.deleteSchoolSchoolingProgramValidity(id);
            ///////
            if(deleteResult.affectedRows > 0)
            {
                res.status(200)
                return res.json({
                    "status_code" : 200,
                    "success" : true,                            
                    "message" : errorCode.getStatus(200)
                })
            }
            else
            {
                res.status(500)
                return res.json({
                    "status_code" : 500,
                    "message" : "Schooling Program Validity Already Deleted",
                    "success" : false,
                    "error" : errorCode.getStatus(500)
                })
            }
        }  
        else
        {
            res.status(500)
            return res.json({
                "status_code" : 500,
                "message" : "School Schooling Program Validity Not Exist",
                "success" : false,
                "error" : errorCode.getStatus(500)
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
