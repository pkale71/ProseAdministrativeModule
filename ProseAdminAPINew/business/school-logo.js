const buildJSON = require('./buildBusinessJSONs.js');
const commonFunction = require('../util/commonFunctions.js');
let dbBusiness = require('../sqlmap/businessQuery.js');
const fs = require('fs');
const mime = require('mime-types');
let errorCodes = require('../util/errorCodes.js');
let errorCode = new errorCodes();
////////Variables
let uuid;
//////
let school;

module.exports = require('express').Router().get('/:uuid', async(req,res) =>
{
    try
    {
        uuid = req.params.uuid;
        school = await dbBusiness.getSchool(uuid);
        if(school.length == 1)
        {
            let filePath = commonFunction.getUploadFolder('SchoolDoc') + school[0].logoFileName;
            const mimeType = mime.lookup(filePath);
            fs.readFile(filePath, (err, data) => 
            {
                if (err) 
                {
                    res.status(500)
                    return res.json({
                        "status_code" : 500,
                        "message" : "Error Reading File",
                        "success" : false,
                        "error" : errorCode.getStatus(500)
                    })
                }                    
                // Convert file data to base64
                const base64Data = `data:${mimeType};base64,` + data.toString('base64');
                
                res.status(200)
                return res.json({
                    "mimeType" : mimeType,
                    "fileData" : base64Data,
                    "status_code" : 200,
                    "success" : true,                            
                    "message" : errorCode.getStatus(200)
                })
            });
        }
        else 
        {
            res.status(500)
            return res.json({
                "status_code" : 500,
                "message" : "School Not Exist",
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
            "error" : e?.stack,
        });
    }
})
