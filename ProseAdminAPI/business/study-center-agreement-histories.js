const buildJSON = require('./buildBusinessJSONs.js');
const commonFunction = require('../util/commonFunctions.js');
let dbBusiness = require('../sqlmap/businessQuery.js');
let errorCodes = require('../util/errorCodes.js');
const tieupSchool = require('./tieup-school.js');
let errorCode = new errorCodes();
////////Variables
let studyCenterUUID; 
//////
let studyCenter;
let studyCenterAgreementHistories;

module.exports = require('express').Router().get('/:studyCenterUUID', async(req,res) =>
{
    try
    {
        studyCenterUUID = '';
        studyCenterUUID = req.params.studyCenterUUID;
    ////Check Study Center Exist
        studyCenter = await dbBusiness.getStudyCenter(studyCenterUUID);
        if(studyCenter.length == 1)
        {
            studyCenterAgreementHistories = await dbBusiness.getStudyCenterAgreementHistories(studyCenter[0].id);
            if(studyCenterAgreementHistories.length >= 0)
            {
                res.status(200)
                return res.json({
                    "studyCenterAgreementHistories" : buildJSON.studyCenterAgreementHistories(studyCenterAgreementHistories),
                    "status_code" : 200,
                    "success" : true,                            
                    "message" : errorCode.getStatus(200)
                })
            }      
        }
        else
        {
            res.status(500)
            return res.json({
                "status_code" : 500,
                "message" : "Study Center Not Exist",
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
