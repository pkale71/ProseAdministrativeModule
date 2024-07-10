const buildJSON = require('./buildBusinessJSONs.js');
const commonFunction = require('../util/commonFunctions.js');
let dbBusiness = require('../sqlmap/businessQuery.js');
let errorCodes = require('../util/errorCodes.js');
const tieupSchool = require('./tieup-school.js');
let errorCode = new errorCodes();
////////Variables
let tieUpSchoolUUID; 
//////
let tieUpSchool;
let tieUpSchoolContractHistories;

module.exports = require('express').Router().get('/:tieUpSchoolUUID', async(req,res) =>
{
    try
    {
        tieUpSchoolUUID = '';
        tieUpSchoolUUID = req.params.tieUpSchoolUUID;
    ////Check TieUp School Exist
        tieUpSchool = await dbBusiness.getTieUpSchool(tieUpSchoolUUID);
        if(tieUpSchool.length == 1)
        {
            tieUpSchoolContractHistories = await dbBusiness.getBusinessPartnerContractHistories(tieUpSchool[0].id);
            if(tieUpSchoolContractHistories.length >= 0)
            {
                res.status(200)
                return res.json({
                    "tieUpSchoolContractHistories" : buildJSON.tieUpSchoolContractHistories(tieUpSchoolContractHistories),
                    "status_code" : 200,
                    "success" : true,                            
                    "message" : errorCode.getStatus(200)
                })
            }      
        }
        else
        {
            res.status(500)
            return res.json({
                "status_code" : 500,
                "message" : "Tie-Up School Not Exist",
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
