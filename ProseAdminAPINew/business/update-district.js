const commonFunction = require('../util/commonFunctions.js');
let dbBusiness = require('../sqlmap/businessQuery.js');
let errorCodes = require('../util/errorCodes.js');
let errorCode = new errorCodes();
////////Variables 
let districtId;
let name;
let countryId;
let stateRegionId;
//////
let stateRegion;
let district;
let districtExist;
let country;

module.exports = require('express').Router().post('/',async(req,res) =>
{
    try
    {
        let reqData = commonFunction.trimSpaces(req.body);
        let authData = reqData.authData;
        
        if(reqData.id != undefined && reqData.name != undefined && reqData.country != undefined && reqData.stateRegion != undefined)
        {
            if(reqData.id != "" && reqData.name != "" && reqData.country.id != "" && reqData.stateRegion.id != "")
            {
                districtId = commonFunction.validateNumber(reqData.id);
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
                        ////Check District Exist
                        districtExist = await dbBusiness.checkDistrictExist(districtId, countryId, stateRegionId);
                        let isExist = districtExist.length > 0 ? 1 : 0;
                        ////Check Duplicate District
                        district = await dbBusiness.duplicateDistrict(name, countryId, stateRegionId, districtId);
                        if(district.length == 0)
                        {                    
                        ///update State/Region
                            let updateJSON = {
                                "id" : districtId,
                                "name" : name,
                                "countryId" : countryId,
                                "stateRegionId" : stateRegionId,
                                "createdById" : authData.id
                            }
                            let updateDistrictResult = await dbBusiness.updateDistrict(updateJSON, isExist);
                ///////
                            if(updateDistrictResult.affectedRows > 0)
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
