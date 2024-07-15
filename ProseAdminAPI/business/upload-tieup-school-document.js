const commonFunction = require('../util/commonFunctions.js');
let dbBusiness = require('../sqlmap/businessQuery.js');
let errorCodes = require('../util/errorCodes.js');
let errorCode = new errorCodes();
////////Variables 
let academyEnclosureDocId;
let tieUpSchoolUUID;
//////
let tieUpSchool;
let tieUpSchoolDocUpload;
let academyEnclosureDocument;
let allowedMimeTypes = [
    'image/png',
    'image/jpeg',
    'application/pdf'
];

module.exports = require('express').Router().post('/',async(req,res) =>
{
    try
    {
        let reqData = commonFunction.trimSpaces(req.body);
        let authData = reqData.authData;
        
        if(JSON.parse(reqData.tieUpSchool) != undefined && JSON.parse(reqData.academyEnclosureDocument))
        {
            if(JSON.parse(reqData.academyEnclosureDocument)?.id != "" && JSON.parse(reqData.tieUpSchool)?.uuid != "" && req.files.length == 1 && parseFloat(req.files[0].size) > 0)
            {
                tieUpSchoolUUID = JSON.parse(reqData.tieUpSchool).uuid;
                academyEnclosureDocId = commonFunction.validateNumber(JSON.parse(reqData.academyEnclosureDocument).id);

                if (!allowedMimeTypes.includes(req.files[0].mimetype)) 
                {
                    commonFunction.deleteFiles(req.files);
                    res.status(500)
                    return res.json({
                        "status_code" : 500,
                        "message" : "Invalid File Format",
                        "success" : false,
                        "error" : errorCode.getStatus(500)
                    })
                }

                ////Check Tie-Up School Exist
                tieUpSchool = await dbBusiness.getTieUpSchool(tieUpSchoolUUID);
                if(tieUpSchool.length == 1)
                {
                    ///Check Academy Enclosure Document Exist
                    academyEnclosureDocument = await dbBusiness.getAcademyEnclosureDocument(academyEnclosureDocId);
                    if(academyEnclosureDocument.length == 1)
                    {
                ///Get File Source Path
                        let fileExt = req.files[0].originalname.split('.').pop();
                        let sourcePath = req.files[0].path;

                ///Check Academy Enclosure Document Already Upload For Tie-Up School
                        tieUpSchoolDocUpload = await dbBusiness.checkDuplicateTieUpSchoolDoc(tieUpSchool[0].id, academyEnclosureDocId);
                        if(tieUpSchoolDocUpload.length == 1)
                        {
                            ////Remove Old File
                            let filePath = commonFunction.getUploadFolder('TieUpSchoolDoc') + tieUpSchoolDocUpload[0].fileName;
                            commonFunction.deleteFileByPath(filePath);

                    ///update Tie-Up School Document
                            let savedFileName = tieUpSchoolDocUpload[0].fileName.toString().split('.');                            
                            let destiFileName = `${savedFileName[0]}.${fileExt}`;
                    //// Update the file name in the database
                            let updateTieUpSchoolDocumentResult = await dbBusiness.updateTieUpSchoolDocFileName(destiFileName, tieUpSchoolDocUpload[0].id, authData.id);
                        ///////
                            if(updateTieUpSchoolDocumentResult.affectedRows > 0)
                            {
                                let destiPath = commonFunction.getUploadFolder('TieUpSchoolDoc') + destiFileName;
                                await commonFunction.copyFile(sourcePath, destiPath);

                                commonFunction.deleteFiles(req.files);
                                res.status(200)
                                return res.json({
                                    "status_code" : 200,
                                    "success" : true,                            
                                    "message" : errorCode.getStatus(200)
                                })
                            }
                            else
                            {
                                commonFunction.deleteFiles(req.files);
                                res.status(500)
                                return res.json({
                                    "status_code" : 500,
                                    "message" : "Tie-Up School Document Not Uploaded",
                                    "success" : false,
                                    "error" : errorCode.getStatus(500)
                                })
                            }
                        }
                        else
                        {
                            let insertJSON = {
                                tieUpSchoolId: tieUpSchool[0].id,
                                documentId: academyEnclosureDocId,
                                fileName: "",
                                createdById: authData.id
                            };
                    ///insert Tie-Up School Document
                            let insertTieUpSchoolDocumentResult = await dbBusiness.insertTieUpSchoolDocument(insertJSON);
                            let insertTieUpSchoolDocId = insertTieUpSchoolDocumentResult.insertId;
                ///////
                            if(parseInt(insertTieUpSchoolDocId) > 0)
                            {
                                let destiFileName = `${tieUpSchool[0].id}_${insertTieUpSchoolDocId}.${fileExt}`;
                                let destiPath = commonFunction.getUploadFolder('TieUpSchoolDoc') + destiFileName;
                                
                                // Update the file name in the database
                                let updateTieUpSchoolDocumentResult = await dbBusiness.updateTieUpSchoolDocFileName(destiFileName, insertTieUpSchoolDocId);
                            ///////
                                if(updateTieUpSchoolDocumentResult.affectedRows > 0)
                                {
                                    await commonFunction.copyFile(sourcePath, destiPath);
                                    
                                    commonFunction.deleteFiles(req.files);
                                    res.status(200)
                                    return res.json({
                                        "status_code" : 200,
                                        "success" : true,                            
                                        "message" : errorCode.getStatus(200)
                                    })
                                }
                                else
                                {
                                    commonFunction.deleteFiles(req.files);
                                    res.status(500)
                                    return res.json({
                                        "status_code" : 500,
                                        "message" : "Tie-Up School Document Not Uploaded",
                                        "success" : false,
                                        "error" : errorCode.getStatus(500)
                                    })
                                }
                            }
                            else
                            {
                                commonFunction.deleteFiles(req.files);
                                res.status(500)
                                return res.json({
                                    "status_code" : 500,
                                    "message" : "Tie-Up School Document Not Uploaded",
                                    "success" : false,
                                    "error" : errorCode.getStatus(500)
                                })
                            }
                        }
                    }
                    else 
                    {
                        commonFunction.deleteFiles(req.files);
                        res.status(500)
                        return res.json({
                            "status_code" : 500,
                            "message" : "Invalid Academy Enclosure Document",
                            "success" : false,
                            "error" : errorCode.getStatus(500)
                        })
                    }
                }
                else
                {
                    commonFunction.deleteFiles(req.files);
                    res.status(500)
                    return res.json({
                        "status_code" : 500,
                        "message" : "Tie-Up School Not Exist",
                        "success" : false,
                        "error" : errorCode.getStatus(500)
                    })
                }
            }
            else
            {
                commonFunction.deleteFiles(req.files);
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
            commonFunction.deleteFiles(req.files);
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
        commonFunction.deleteFiles(req.files);
        res.status(500)
        return res.json({
            "status_code" : 500,
            "message" : "Something Went Wrong",
            "success" : false,
            "error" : e
        });
    }
})
