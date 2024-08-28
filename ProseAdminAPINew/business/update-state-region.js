const commonFunction = require('../util/commonFunctions.js');
let dbBusiness = require('../sqlmap/businessQuery.js');
let errorCodes = require('../util/errorCodes.js');
let errorCode = new errorCodes();
////////Variables 
let stateRegionId;
let name;
let countryId;
//////
let stateRegion;
let stateRegionExist;
let country;

module.exports = require('express').Router().post('/',async(req,res) =>
{
    try
    {
        let reqData = commonFunction.trimSpaces(req.body);
        let authData = reqData.authData;
        
        if(reqData.id != undefined && reqData.name != undefined && reqData.country != undefined)
        {
            if(reqData.id != "" && reqData.name != "" && reqData.country.id != "")
            {
                stateRegionId = commonFunction.validateNumber(reqData.id);
                name = reqData.name;
                countryId = commonFunction.validateNumber(reqData.country.id);

                ////Check Country
                country = await dbBusiness.getCountry(countryId);
                if(country.length == 1)
                {
                    ////Check State/Region Exist
                    stateRegionExist = await dbBusiness.checkStateRegionExist(stateRegionId, countryId);
                    let isExist = stateRegionExist.length > 0 ? 1 : 0;
                    ////Check Duplicate State/Region
                    stateRegion = await dbBusiness.duplicateStateRegion(name, countryId, stateRegionId);
                    if(stateRegion.length == 0)
                    {                    
                    ///update State/Region
                        let updateJSON = {
                            "id" : stateRegionId,
                            "name" : name,
                            "countryId" : countryId,
                            "createdById" : authData.id
                        }
                        let updateStateRegionResult = await dbBusiness.updateStateRegion(updateJSON, isExist);
            ///////
                        if(updateStateRegionResult.affectedRows > 0)
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
