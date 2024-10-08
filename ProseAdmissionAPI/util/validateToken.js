let app = require('express').Router();
let errorCodes = require('../util/errorCodes.js');
let getErrorCode = new errorCodes();
let verifyToken = require('../util/verifyToken.js');

app.get('/:id?*',async (req,res,next) => 
{
    let params = (req.params[0]).split("/");
    let paramCount = 0;
    for(i=0;i<params?.length;i++)
    {
        if(params[i] != "")
        {
            paramCount = parseInt(paramCount) + 1;
        }
    }
    if(paramCount <= 7)
    {
        verifyToken(req,res,next);
    }
    else
    {
        res.status(406).json({
            "status_code" : 406,
            "message" : "Params Length Exceeded",
            "status_name" : getErrorCode.getStatus(406),
            "error"     : "Wrong method or api"
        })
    }
})

app.post('/:id?*',async (req,res,next) => 
{
    let params = (req.params[0]).split("/");
    if(params?.length <= 6)
    {
        verifyToken(req,res,next);
    }
    else
    {
        res.status(406).json({
            "status_code" : 406,
            "message" : "Params Length Exceeded",
            "status_name" : getErrorCode.getStatus(406),
            "error"     : "Wrong method or api"
        })
    }
})

module.exports = app;