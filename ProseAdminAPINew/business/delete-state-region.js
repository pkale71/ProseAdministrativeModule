const commonFunction = require('../util/commonFunctions.js');
let dbBusiness = require('../sqlmap/businessQuery.js');
let errorCodes = require('../util/errorCodes.js');
let errorCode = new errorCodes();
////////Variables 
let id;
let countryId;
//////
let stateRegion;
let stateRegion1;

module.exports = require('express').Router().post('/',async(req,res) =>
{
    try
    {
        let reqData = commonFunction.trimSpaces(req.body);
        let authData = reqData.authData;
        
        if(reqData.id != undefined && reqData.country != undefined)
        {
            if(reqData.id != "" && reqData.country.id != "")
            {
                id = commonFunction.validateNumber(reqData.id);
                countryId = commonFunction.validateNumber(reqData.country.id);
                
                stateRegion1 = await dbBusiness.getStateRegion(id, countryId);
                if(stateRegion1.length > 0)
                {
                    ////Check State/Region Exist
                    stateRegion = await dbBusiness.checkStateRegionExist(id, countryId);
                    if(stateRegion.length == 0)
                    {                    
                    ///delete State/Region
                        let deleteStateRegionResult = await dbBusiness.deleteStateRegion(id, countryId);
            ///////
                        if(deleteStateRegionResult.affectedRows > 0)
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
                                "message" : "State/Region Already Deleted",
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
                            "message" : "State/Region Currently In Use",
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
                        "message" : "State/Region Not Belongs To Country",
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
                    "message" : "Some Values Are Not Filled",
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
                "message" : "JSON Error",
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
            "error" : e
        });
    }
})
