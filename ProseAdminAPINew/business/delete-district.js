const commonFunction = require('../util/commonFunctions.js');
let dbBusiness = require('../sqlmap/businessQuery.js');
let errorCodes = require('../util/errorCodes.js');
let errorCode = new errorCodes();
////////Variables 
let id;
let countryId;
let stateRegionId;
//////
let district;
let district1;

module.exports = require('express').Router().post('/',async(req,res) =>
{
    try
    {
        let reqData = commonFunction.trimSpaces(req.body);
        let authData = reqData.authData;
        
        if(reqData.id != undefined && reqData.country != undefined && reqData.stateRegion != undefined)
        {
            if(reqData.id != "" && reqData.country.id != "" && reqData.stateRegion.id != "")
            {
                id = commonFunction.validateNumber(reqData.id);
                countryId = commonFunction.validateNumber(reqData.country.id);
                stateRegionId = commonFunction.validateNumber(reqData.stateRegion.id);

                district1 = await dbBusiness.getDistrict(id, countryId, stateRegionId);
                if(district1.length > 0)
                {
                    ////Check District Exist
                    district = await dbBusiness.checkDistrictExist(id, countryId, stateRegionId);
                    if(district.length == 0)
                    {                    
                    ///delete District
                        let deleteDistrictResult = await dbBusiness.deleteDistrict(id, countryId, stateRegionId);
            ///////
                        if(deleteDistrictResult.affectedRows > 0)
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
                                "message" : "District Already Deleted",
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
                            "message" : "District Currently In Use",
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
                        "message" : "District Not Belongs To Country Or State/Region",
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
