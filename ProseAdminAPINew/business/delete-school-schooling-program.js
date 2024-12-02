const buildJSON = require('./buildBusinessJSONs.js');
const commonFunction = require('../util/commonFunctions.js');
let dbBusiness = require('../sqlmap/businessQuery.js');
let errorCodes = require('../util/errorCodes.js');
let errorCode = new errorCodes();
////////Variables
let id; 
//////
let schoolSchoolingProgram;

module.exports = require('express').Router().post('/', async(req,res) =>
{
    try
    {
        let reqData = commonFunction.trimSpaces(req.body);
        id = reqData.id;
        let authData = reqData.authData;
       
        schoolSchoolingProgram = await dbBusiness.getSchoolSchoolingProgram(id);
        if(schoolSchoolingProgram.length == 1)
        {
            let schoolSchoolingProgramValidity = await dbBusiness.checkSchoolSchoolingProgramExist(id);
            if(schoolSchoolingProgramValidity.length > 0)
            {
                res.status(500)
                return res.json({
                    "status_code" : 500,
                    "message" : "Schooling Program Currently In Use",
                    "success" : false,
                    "error" : errorCode.getStatus(500)
                })
            }
            ///delete School Schooling program
            let deleteResult = await dbBusiness.deleteSchoolSchoolingProgram(id);
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
                    "message" : "Schooling Program Already Deleted",
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
                "message" : "School Schooling Program Not Exist",
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
