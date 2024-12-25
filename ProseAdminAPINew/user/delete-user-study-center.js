const commonFunction = require('../util/commonFunctions.js');
let dbUser = require('../sqlmap/userQuery.js');
let dbCommon = require('../sqlmap/commonQuery.js');
let dbBusiness = require('../sqlmap/businessQuery.js');
let errorCodes = require('../util/errorCodes.js');
let errorCode = new errorCodes();
////////Variables 
let moduleId;
let userUUID;
let studyCenterUUID;
//////
let studyCenter;
let user;

module.exports = require('express').Router().post('/',async(req,res) =>
{
    try
    {
        let reqData = commonFunction.trimSpaces(req.body);
        let authData = reqData.authData;
        
        if(reqData.user != undefined && reqData.studyCenter != undefined && reqData.module != undefined)
        {
            if(reqData.user.uuid != "" && reqData.studyCenter.uuid != "" && moduleId != "")
            {
                userUUID = reqData.user.uuid;
                moduleId = commonFunction.validateNumber(reqData.module.id);
                studyCenterUUID = reqData.studyCenter.uuid;

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
            ///Check Study Center
                studyCenter = await dbBusiness.getStudyCenter(studyCenterUUID);
                if(studyCenter.length == 0)
                {    
                    res.status(500)
                    return res.json({
                        "status_code" : 500,
                        "message" : "Invalid Study Center",
                        "success" : false,
                        "error" : errorCode.getStatus(500)
                    }) 
                }
                ///delete User Study Center
                let deleteJSON = {
                    "userId" : user[0].userId,
                    "moduleId" : moduleId,
                    "studyCenterId" : studyCenter[0].id
                }
                let deleteUserSchoolResult = await dbUser.deleteUserStudyCenter(deleteJSON);
    ///////
                if(deleteUserSchoolResult.affectedRows > 0)
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
                        "message" : "Study Center Not Deleted",
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
