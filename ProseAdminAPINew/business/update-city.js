const commonFunction = require('../util/commonFunctions.js');
let dbBusiness = require('../sqlmap/businessQuery.js');
let errorCodes = require('../util/errorCodes.js');
let errorCode = new errorCodes();
////////Variables 
let cityId;
let name;
let countryId;
let stateRegionId;
let districtId;
//////
let country;
let stateRegion;
let district;
let city;
let cityExist;

module.exports = require('express').Router().post('/',async(req,res) =>
{
    try
    {
        let reqData = commonFunction.trimSpaces(req.body);
        let authData = reqData.authData;
        
        if(reqData.id != undefined && reqData.name != undefined && reqData.country != undefined && reqData.stateRegion != undefined && reqData.district != undefined)
        {
            if(reqData.id != "" && reqData.name != "" && reqData.country.id != "" && reqData.stateRegion.id != "" && reqData.district.id != "")
            {
                cityId = commonFunction.validateNumber(reqData.id);
                name = reqData.name;
                countryId = commonFunction.validateNumber(reqData.country.id);
                stateRegionId = commonFunction.validateNumber(reqData.stateRegion.id);
                districtId = commonFunction.validateNumber(reqData.district.id);

                ////Check Country
                country = await dbBusiness.getCountry(countryId);
                if(country.length == 1)
                {
                    ////Check State/Region
                    stateRegion = await dbBusiness.getStateRegion(stateRegionId, countryId);
                    if(stateRegion.length == 1)
                    {
                        ////Check District
                        district = await dbBusiness.getDistrict(districtId, countryId, stateRegionId);
                        if(district.length == 1)
                        {
                            ////Check City Exist
                            cityExist = await dbBusiness.checkCityExist(cityId, countryId, stateRegionId, districtId);
                            let isExist = cityExist.length > 0 ? 1 : 0;
                            ////Check Duplicate City
                            city = await dbBusiness.duplicateCity(name, countryId, stateRegionId, districtId, cityId);
                            if(city.length == 0)
                            {                    
                            ///update City
                                let updateJSON = {
                                    "id" : cityId,
                                    "name" : name,
                                    "countryId" : countryId,
                                    "stateRegionId" : stateRegionId,
                                    "districtId" : districtId,
                                    "createdById" : authData.id
                                }
                                let updateCityResult = await dbBusiness.updateCity(updateJSON, isExist);
                    ///////
                                if(updateCityResult.affectedRows > 0)
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
                                        "message" : "City Not Saved",
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
                                    "message" : "City Already Exist For Country : " + city[0].countryName + ", State/Region : " + city[0].stateRegionName+ " And District : " + city[0].districtName,
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
                                "message" : "District Not Exist For Country : " + country[0].name + " And State/Region : " + stateRegion[0].name,
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
