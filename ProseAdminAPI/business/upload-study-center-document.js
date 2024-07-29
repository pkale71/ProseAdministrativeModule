const commonFunction = require('../util/commonFunctions.js');
let dbBusiness = require('../sqlmap/businessQuery.js');
let errorCodes = require('../util/errorCodes.js');
let errorCode = new errorCodes();
////////Variables 
let academyEnclosureDocId;
let studyCenterUUID;
//////
let studyCenter;
let studyCenterDocUpload;
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
        
        if(JSON.parse(reqData.studyCenter) != undefined && JSON.parse(reqData.academyEnclosureDocument))
        {
            if(JSON.parse(reqData.academyEnclosureDocument)?.id != "" && JSON.parse(reqData.studyCenter)?.uuid != "" && req.files.length == 1 && parseFloat(req.files[0].size) > 0)
            {
                studyCenterUUID = JSON.parse(reqData.studyCenter).uuid;
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

                ////Check Study Center Exist
                studyCenter = await dbBusiness.getStudyCenter(studyCenterUUID);
                if(studyCenter.length == 1)
                {
                    ///Check Academy Enclosure Document Exist
                    academyEnclosureDocument = await dbBusiness.getAcademyEnclosureDocument(academyEnclosureDocId);
                    if(academyEnclosureDocument.length == 1)
                    {
                ///Get File Source Path
                        let fileExt = req.files[0].originalname.split('.').pop();
                        let sourcePath = req.files[0].path;

                ///Check Academy Enclosure Document Already Upload For Study Center
                        studyCenterDocUpload = await dbBusiness.checkDuplicateStudyCenterDoc(studyCenter[0].id, academyEnclosureDocId);
                        if(studyCenterDocUpload.length == 1)
                        {
                            ////Remove Old File
                            let filePath = commonFunction.getUploadFolder('StudyCenterDoc') + studyCenterDocUpload[0].fileName;
                            commonFunction.deleteFileByPath(filePath);

                    ///update Study Center Document
                            let savedFileName = studyCenterDocUpload[0].fileName.toString().split('.');                            
                            let destiFileName = `${savedFileName[0]}.${fileExt}`;
                    //// Update the file name in the database
                            let updateStudyCenterDocumentResult = await dbBusiness.updateStudyCenterDocFileName(destiFileName, studyCenterDocUpload[0].id, authData.id);
                        ///////
                            if(updateStudyCenterDocumentResult.affectedRows > 0)
                            {
                                let destiPath = commonFunction.getUploadFolder('StudyCenterDoc') + destiFileName;
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
                                    "message" : "Study Center Document Not Uploaded",
                                    "success" : false,
                                    "error" : errorCode.getStatus(500)
                                })
                            }
                        }
                        else
                        {
                            let insertJSON = {
                                studyCenterId: studyCenter[0].id,
                                documentId: academyEnclosureDocId,
                                fileName: "",
                                createdById: authData.id
                            };
                    ///insert Study Center Document
                            let insertStudyCenterDocumentResult = await dbBusiness.insertStudyCenterDocument(insertJSON);
                            let insertStudyCenterDocId = insertStudyCenterDocumentResult.insertId;
                ///////
                            if(parseInt(insertStudyCenterDocId) > 0)
                            {
                                let destiFileName = `${studyCenter[0].code}_${insertStudyCenterDocId}.${fileExt}`;
                                let destiPath = commonFunction.getUploadFolder('StudyCenterDoc') + destiFileName;
                                
                                // Update the file name in the database
                                let updateStudyCenterDocumentResult = await dbBusiness.updateStudyCenterDocFileName(destiFileName, insertStudyCenterDocId);
                            ///////
                                if(updateStudyCenterDocumentResult.affectedRows > 0)
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
                                        "message" : "Study Center Document Not Uploaded",
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
                                    "message" : "Study Center Document Not Uploaded",
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
                        "message" : "Study Center Not Exist",
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
            "error" : e?.stack
        });
    }
})
