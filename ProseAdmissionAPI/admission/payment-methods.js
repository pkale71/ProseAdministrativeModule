const buildJSON = require('./buildAdmissionJSONs.js');
const commonFunction = require('../util/commonFunctions.js');
let dbAdmission = require('../sqlmap/admissionQuery.js');
let errorCodes = require('../util/errorCodes.js');
let errorCode = new errorCodes();
//Variables 
//
let paymentMethods;

module.exports = require('express').Router().get('/', async(req,res) =>
{
    try
    {
        paymentMethods = await dbAdmission.getPaymentMethods();
        if(paymentMethods.length >= 0)
        {
            res.status(200)
            return res.json({
                "paymentMethods" : buildJSON.paymentMethod(paymentMethods),
                "status_code" : 200,
                "success" : true,                            
                "message" : errorCode.getStatus(200)
            });
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
});
