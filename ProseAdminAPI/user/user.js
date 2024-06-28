const commonFunction = require('../util/commonFunctions.js');
const buildJSON = require('./buildUserJSONs.js');
let dbUser = require('../sqlmap/userQuery.js');
let errorCodes = require('../util/errorCodes.js');
let errorCode = new errorCodes();
////////Variables 
//////
let user;

module.exports = require('express').Router().get('/:userUUID',async(req,res) =>
{
    try
    {
        let uuid = req.params?.userUUID;
        
    //////get user
        user = await dbUser.getUser(uuid);
        if(user.length == 1)
        {
            res.status(200)
            return res.json({
                "user" : buildJSON.user(user, 0),
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
                "message" : "Invalid User",
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
