const commonFunction = require('../util/commonFunctions.js');
let dbUser = require('../sqlmap/userQuery.js');
let errorCodes = require('../util/errorCodes.js');
let errorCode = new errorCodes();
////////Variables 
//////
let user;

module.exports = require('express').Router().get('/',async(req,res) =>
{
    try
    {
        let reqData = commonFunction.trimSpaces(req.body);
        let authData = reqData.authData;
        
    //////get User
        user = await dbUser.checkAuthToken(authData.token);
        if(user.length == 1)
        {
            let signoutResult = await dbUser.signout(authData.id, "Normal");
            if(signoutResult.affectedRows > 0)
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
                "message" : "Signout Failed",
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
            "error" : e,
        });
    }
})
