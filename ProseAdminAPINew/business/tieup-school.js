const buildJSON = require('./buildBusinessJSONs.js');
let dbBusiness = require('../sqlmap/businessQuery.js');
let errorCodes = require('../util/errorCodes.js');
let errorCode = new errorCodes();
////////Variables
let uuid;
//////
let tieUpSchool;

module.exports = require('express').Router().get('/:uuid', async(req,res) =>
{
    try
    {
        uuid = req.params.uuid;
        
        tieUpSchool = await dbBusiness.getTieUpSchool(uuid);
        if(tieUpSchool.length >= 0)
        {
            res.status(200)
            return res.json({
                "tieUpSchool" : buildJSON.tieUpSchools(tieUpSchool, 0),
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
