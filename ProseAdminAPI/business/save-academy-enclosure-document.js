const commonFunction = require('../util/commonFunctions.js');
let dbBusiness = require('../sqlmap/businessQuery.js');
let errorCodes = require('../util/errorCodes.js');
let errorCode = new errorCodes();
////////Variables 
let name;
let isCompulsory;
//////
let academyEnclosureDocument;

module.exports = require('express').Router().post('/',async(req,res) =>
{
    try
    {
        let reqData = commonFunction.trimSpaces(req.body);
        let authData = reqData.authData;
        
        if(reqData.name != undefined && reqData.isCompulsory != undefined)
        {
            if(reqData.name != "" && commonFunction.validateNumber(reqData.isCompulsory, 'Yes') <= 1)
            {
                name = reqData.name;
                isCompulsory = commonFunction.validateNumber(reqData.isCompulsory, 'Yes');

                ////Check Duplicate Academy Enclosure Document
                academyEnclosureDocument = await dbBusiness.duplicateAcademyEnclosureDocument(name, "");
                if(academyEnclosureDocument.length == 0)
                {                    
                ///insert Academy Enclosure Document
                    let insertJSON = {
                        "name" : name,
                        "isCompulsory" : isCompulsory,
                        "createdById" : authData.id
                    }
                    let insertAcademyEnclosureDocumentResult = await dbBusiness.insertAcademyEnclosureDocument(insertJSON);
                    let insertAcademyEnclosureDocumentId = insertAcademyEnclosureDocumentResult.insertId;
        ///////
                    if(parseInt(insertAcademyEnclosureDocumentId) > 0)
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
                            "message" : "Academy Enclosure Document Not Saved",
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
                        "message" : "Academy Enclosure Document Already Exist",
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
