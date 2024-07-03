let app = require('express').Router();
let dbCommon = require('../sqlmap/commonQuery.js');
let errorCodes = require('../util/errorCodes');
let getErrorCode = new errorCodes();
let uploads = require('../util/multerConfig.js');
let accessToken;

async function verifyToken (req, res, next)
{
    try 
    {
        let authToken = req.headers['authorization'];
        if(!authToken)
        {
            res.status(401);
            return res.json({
                "error": "Missing Token",
                "status_name" : getErrorCode.getStatus(401),
                "status_code"   :  401
            })
        }
        if(typeof authToken !== 'undefined')
        {
            tokenArr = authToken.split(" ");
            accessToken = tokenArr[1];
            accessToken = accessToken.toString();
        }
        if(accessToken.length == 0)
        {
            res.status(401);
            return res.json({
                "error": "Invalid Token",
                "status_name" : getErrorCode.getStatus(401),
                "status_code"   :  401
            })
        }
//verify token
        let tokenData = await dbCommon.validateToken(accessToken);
        if(tokenData.length == 1)
        {
            let userGradeJSON = {
                "id" : tokenData[0].staffId,
                "uuid" : tokenData[0].staffUUID
            }
            let userCategoryJSON = "";
            if(tokenData[0].id != null)
            {
                userCategoryJSON = {
                    "id" : tokenData[0].userCategoryId,
                    "name" : tokenData[0].userCategoryName,
                    "code" : tokenData[0].userCategoryCode
                };
            }
            let finalJSON = {
                "id" : tokenData[0].id,
                "uuid" : tokenData[0].uuid,
                "token" : accessToken,
                "userGrade" : userGradeJSON,
                "userCategory" : userCategoryJSON
            };
            req.body['authData'] = finalJSON;
            next();
        }
        else
        {
            res.status(401);
            return res.json({
                "error": "Invalid Token",
                "status_name" : getErrorCode.getStatus(401),
                "status_code"   :  401
            })
        }
    }
    catch (error) 
    {
        res.status(401);
        return res.json({
            'message'       :       error,
            "status_name"   :       getErrorCode.getStatus(401),
            "status_code"   :       401,
            "error"         :       "Invalid Token"
        });
    }
}

module.exports = verifyToken;