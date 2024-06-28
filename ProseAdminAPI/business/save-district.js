const commonFunction = require('../util/commonFunctions.js');
let dbBusiness = require('../sqlmap/businessQuery.js');
let errorCodes = require('../util/errorCodes.js');
let errorCode = new errorCodes();
////////Variables 
let name;
let countryId;
let stateRegionId;
//////
let stateRegion;
let country;
let district;

module.exports = require('express').Router().post('/',async(req,res) =>
{
    try
    {
        let reqData = commonFunction.trimSpaces(req.body);
        let authData = reqData.authData;
        
        if(reqData.name != undefined && reqData.country != undefined && reqData.stateRegion != undefined)
        {
            if(reqData.name != "" && reqData.country.id != "" && reqData.stateRegion.id != "")
            {
                name = reqData.name;
                countryId = commonFunction.validateNumber(reqData.country.id);
                stateRegionId = commonFunction.validateNumber(reqData.stateRegion.id);

                ////Check Country
                country = await dbBusiness.getCountry(countryId);
                if(country.length == 1)
                {
                    ////Check State/Region
                    stateRegion = await dbBusiness.getStateRegion(stateRegionId, countryId);
                    if(stateRegion.length == 1)
                    {
                        ////Check Duplicate District
                        district = await dbBusiness.duplicateDistrict(name, countryId, stateRegionId, "");
                        if(district.length == 0)
                        {                    
                        ///insert District
                            let insertJSON = {
                                "name" : name,
                                "countryId" : countryId,
                                "stateRegionId" : stateRegionId,
                                "createdById" : authData.id
                            }
                            let insertDistrictResult = await dbBusiness.insertDistrict(insertJSON);
                            let insertDistrictId = insertDistrictResult.insertId;
                ///////
                            if(parseInt(insertDistrictId) > 0)
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
                                    "message" : "District Not Saved",
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
                                "message" : "District Already Exist For Country : " + district[0].countryName + " And State/Region : " + district[0].stateRegionName,
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
                            "message" : "State/Region Not Exist For " + country[0].name,
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
