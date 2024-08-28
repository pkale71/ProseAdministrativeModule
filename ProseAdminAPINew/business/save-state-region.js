const commonFunction = require('../util/commonFunctions.js');
let dbBusiness = require('../sqlmap/businessQuery.js');
let errorCodes = require('../util/errorCodes.js');
let errorCode = new errorCodes();
////////Variables 
let name;
let countryId;
//////
let stateRegion;
let country;

module.exports = require('express').Router().post('/',async(req,res) =>
{
    try
    {
        let reqData = commonFunction.trimSpaces(req.body);
        let authData = reqData.authData;
        
        if(reqData.name != undefined && reqData.country != undefined)
        {
            if(reqData.name != "" && reqData.country.id != "")
            {
                name = reqData.name;
                countryId = commonFunction.validateNumber(reqData.country.id);

                ////Check Country
                country = await dbBusiness.getCountry(countryId);
                if(country.length == 1)
                {
                    ////Check Duplicate State Region
                    stateRegion = await dbBusiness.duplicateStateRegion(name, countryId, "");
                    if(stateRegion.length == 0)
                    {                    
                    ///insert State Region
                        let insertJSON = {
                            "name" : name,
                            "countryId" : countryId,
                            "createdById" : authData.id
                        }
                        let insertStateRegionResult = await dbBusiness.insertStateRegion(insertJSON);
                        let insertStateRegionId = insertStateRegionResult.insertId;
            ///////
                        if(parseInt(insertStateRegionId) > 0)
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
                                "message" : "State/Region Not Saved",
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
                            "message" : "State/Region Already Exist For " + stateRegion[0].countryName,
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
                        "message" : "Country Not Exist",
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
