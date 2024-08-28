const buildJSON = require('./buildBusinessJSONs.js');
let dbBusiness = require('../sqlmap/businessQuery.js');
let errorCodes = require('../util/errorCodes.js');
let errorCode = new errorCodes();
////////Variables
let tieUpSchoolUUID; 
//////
let tieUpSchool;
let tieUpSchoolDocuments;

module.exports = require('express').Router().get('/:tieUpSchoolUUID', async(req,res) =>
{
    try
    {
        tieUpSchoolUUID = req.params.tieUpSchoolUUID;

        tieUpSchool = await dbBusiness.getTieUpSchool(tieUpSchoolUUID);
        if(tieUpSchool.length == 1)
        {
            tieUpSchoolDocuments = await dbBusiness.getTieUpSchoolDocuments(tieUpSchool[0].id);
            if(tieUpSchoolDocuments.length >= 0)
            {
                res.status(200)
                return res.json({
                    "tieUpSchoolDocuments" : buildJSON.tieUpSchoolDocuments(tieUpSchoolDocuments),
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
                "message" : "Invalid Tie-Up School",
                "success" : false,
                "error" : errorCode.getStatus(500),
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
            "error" : e,
        });
    }
})
