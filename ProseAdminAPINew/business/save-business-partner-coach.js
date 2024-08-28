const commonFunction = require('../util/commonFunctions.js');
let dbBusiness = require('../sqlmap/businessQuery.js');
let errorCodes = require('../util/errorCodes.js');
let errorCode = new errorCodes();
let genUUID = require('uuid');
////////Variables 
let businessPartnerUUID;
let coachUUIDs;
//////
let coach;
let businessPartner;
let businessPartnerCoach;

module.exports = require('express').Router().post('/',async(req,res) =>
{
    try
    {
        let reqData = commonFunction.trimSpaces(req.body);
        let authData = reqData.authData;
        
        if(reqData.businessPartner != undefined && reqData.coachUUIDs != undefined)
        {
            if(reqData.businessPartner.uuid != "" && reqData.coachUUIDs != "")
            {
                businessPartnerUUID = reqData.businessPartner.uuid;
                coachUUIDs = reqData.coachUUIDs;
               
                ////Check Business Partner Exist
                businessPartner = await dbBusiness.getBusinessPartner(businessPartnerUUID);
                if(businessPartner.length == 1)
                {  
                    ////Check Coach Exist
                    coach = await dbBusiness.getCoach(coachUUIDs);
                    
                    if(coach.length == coachUUIDs.toString().split(",").length)
                    {
                        let coachIds = '';
                        for(let i=0;i<coach.length;i++)
                        {
                            coachIds = coachIds == '' ? coach[i].id : (coachIds + ',' + coach[i].id);
                        }
                ////Check Duplicate Business Partner Coach
                        businessPartnerCoach = await dbBusiness.duplicateBusinessPartnerCoach(coachIds, businessPartner[0].id);
                        if(businessPartnerCoach.length == 0)
                        {
                            ///insert Coach
                            let insertJSON = {
                                "businessPartnerId" : businessPartner[0].id,
                                "coaches" : coachIds,
                                "createdById" : authData.id
                            }
                            let insertCoachResult = await dbBusiness.insertBusinessPartnerCoach(insertJSON);
                            let insertCoachId = insertCoachResult.insertId;
                ///////
                            if(parseInt(insertCoachId) > 0)
                            {
                                res.status(200)
                                return res.json({
                                    "uuid" : insertJSON.uuid,
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
                                    "message" : "Business Partner Coach Not Saved",
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
                                "message" : "Some Coach Is Already Saved For A Particular Business Partner",
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
                            "message" : "Invalid Coach",
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
                        "message" : "Invalid Business Partner",
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
