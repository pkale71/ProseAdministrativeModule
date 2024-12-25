const commonFunction = require('../util/commonFunctions.js');
let dbUser = require('../sqlmap/userQuery.js');
let dbCommon = require('../sqlmap/commonQuery.js');
let dbBusiness = require('../sqlmap/businessQuery.js');
let errorCodes = require('../util/errorCodes.js');
let errorCode = new errorCodes();
////////Variables 
let moduleId;
let userUUID;
let studyCenterUUIDs;
//////
let user;
let studyCenters;

module.exports = require('express').Router().post('/',async(req,res) =>
{
    try
    {
        let reqData = commonFunction.trimSpaces(req.body);
        let authData = reqData.authData;
        
        if(reqData.user != undefined && reqData.studyCenterUUIDs != undefined && reqData.module != undefined)
        {
            if(reqData.user.uuid != "" && reqData.studyCenterUUIDs != "" && moduleId != "")
            {
                userUUID = reqData.user.uuid;
                moduleId = commonFunction.validateNumber(reqData.module.id);
                studyCenterUUIDs = reqData.studyCenterUUIDs;
                studyCenters = [];

                ///Check User
                user = await dbUser.getUser(userUUID);
                if(user.length == 0)
                {    
                    res.status(500)
                    return res.json({
                        "status_code" : 500,
                        "message" : "Invalid User",
                        "success" : false,
                        "error" : errorCode.getStatus(500)
                    }) 
                }

                if(studyCenterUUIDs != "0")
                {
                    let studyCenterUUIDArray = studyCenterUUIDs.toString().split(",");                
                ///Check Study Center
                    studyCenters = await dbBusiness.getStudyCenter(studyCenterUUIDs);
                    if(studyCenters.length != studyCenterUUIDArray.length)
                    {    
                        res.status(500)
                        return res.json({
                            "status_code" : 500,
                            "message" : "All Study Centers Not Matched",
                            "success" : false,
                            "error" : errorCode.getStatus(500)
                        }) 
                    }
                }
                ///Check Study Centers Exist
                if(studyCenterUUIDs != "0")
                {
                    let userStudyCenters = await dbUser.userStudyCentersExist(user[0].userId, moduleId, studyCenters);
                    if(userStudyCenters.length > 0)
                    {    
                        res.status(500)
                        return res.json({
                            "status_code" : 500,
                            "message" : "Study Centers Already Exist",
                            "success" : false,
                            "error" : errorCode.getStatus(500)
                        }) 
                    }
                }
                ///insert User Study Center
                let insertJSON = {
                    "userId" : user[0].userId,
                    "moduleId" : moduleId,
                    "studyCenters" : studyCenters,
                    "createdById" : authData.id
                }
                let insertUserStudyCenterResult = await dbUser.insertUserStudyCenters(insertJSON);
    ///////
                if(insertUserStudyCenterResult.affectedRows > 0)
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
                        "message" : "Study Centers Not Saved",
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
            "error" : e?.stack
        });
    }
})
