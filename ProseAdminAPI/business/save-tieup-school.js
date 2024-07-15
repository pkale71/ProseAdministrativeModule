const commonFunction = require('../util/commonFunctions.js');
let dbBusiness = require('../sqlmap/businessQuery.js');
let dbCommon = require('../sqlmap/commonQuery.js');
let errorCodes = require('../util/errorCodes.js');
let errorCode = new errorCodes();
let genUUID = require('uuid');
////////Variables 
let name;
let email;
let mobile;
let website;
let address;
let countryId;
let stateRegionId;
let districtId;
let cityId;
let pincode;
let contactPerson;
let syllabusId;
let contractFrom;
let contractTo;
let panNumber;
let academyEnclosureDocumentIds;
let totalSaved;
//////
let syllabus;
let tieUpSchool;
let duplicateEmailMobile;
let country;
let stateRegion;
let district;
let city;
let academyEnclosureDocument;

module.exports = require('express').Router().post('/',async(req,res) =>
{
    try
    {
        totalSaved = 0;
        let reqData = commonFunction.trimSpaces(req.body);
        let authData = reqData.authData;
        
        if(reqData.name != undefined && reqData.email != undefined && reqData.mobile != undefined && reqData.website != undefined && reqData.contactPerson != undefined && reqData.address != undefined && reqData.country != undefined && reqData.stateRegion != undefined && reqData.district != undefined && reqData.city != undefined && reqData.pincode != undefined && reqData.syllabus != undefined && reqData.panNumber != undefined && reqData.contractFrom != undefined && reqData.contractTo != undefined && reqData.academyEnclosureDocumentIds != undefined)
        {
            if(reqData.name != "" && reqData.email != "" && reqData.mobile != "" && reqData.website != "" && reqData.contactPerson != "" && reqData.address != "" && JSON.parse(reqData.country).id != "" && JSON.parse(reqData.stateRegion).id != "" && JSON.parse(reqData.district).id != "" && JSON.parse(reqData.city).id != "" && reqData.pincode != "" && JSON.parse(reqData.syllabus).id != "" && reqData.panNumber != "" && reqData.contractFrom != "" && reqData.contractTo != "")
            {
                name = reqData.name;
                email = reqData.email;
                mobile = reqData.mobile;
                website = reqData.website;
                contactPerson = reqData.contactPerson;
                pincode = commonFunction.validateNumber(reqData.pincode);
                address = reqData.address;
                countryId = commonFunction.validateNumber(JSON.parse(reqData.country).id);
                stateRegionId = commonFunction.validateNumber(JSON.parse(reqData.stateRegion).id);
                districtId = commonFunction.validateNumber(JSON.parse(reqData.district).id);
                cityId = commonFunction.validateNumber(JSON.parse(reqData.city).id);
                syllabusId = commonFunction.validateNumber(JSON.parse(reqData.syllabus).id);
                contractFrom = reqData.contractFrom;
                contractTo = reqData.contractTo;
                panNumber = reqData.panNumber;
                academyEnclosureDocumentIds = reqData.academyEnclosureDocumentIds;

            /////check Academy Enclosure Documents And Files
                academyEnclosureDocument = await dbBusiness.getAcademyEnclosureDocument(academyEnclosureDocumentIds);
                if(academyEnclosureDocument.length != req.files.length)
                {
                    ///Remove Files
                    commonFunction.deleteFiles(req.files);
                    res.status(500)
                    return res.json({
                        "status_code" : 500,
                        "message" : "Academy Enclosure Documents And Uploading Files Are Not Matched",
                        "success" : false,
                        "error" : errorCode.getStatus(500)
                    })
                }
            
            /////check Valid Website Address
                if(!commonFunction.isValidURL(website))
                {
                    ///Remove Files
                    commonFunction.deleteFiles(req.files);
                    res.status(500)
                    return res.json({
                        "status_code" : 500,
                        "message" : "Invalid Website Address",
                        "success" : false,
                        "error" : errorCode.getStatus(500)
                    })
                }
            /////check contractFrom and contractTo
                if(!commonFunction.isValidDate(contractFrom, "YYYY-MM-DD") || !commonFunction.isValidDate(contractTo, "YYYY-MM-DD"))
                {
                    ///Remove Files
                    commonFunction.deleteFiles(req.files);
                    res.status(500)
                    return res.json({
                        "status_code" : 500,
                        "message" : "Invalid Date Format In ContractFrom or ContractTo",
                        "success" : false,
                        "error" : errorCode.getStatus(500)
                    })
                }
                ////Check Duplicate Email/Mobile
                duplicateEmailMobile = await dbCommon.checkDuplicateEmailMobile(email, "Email", "tie_up_school");
                if(duplicateEmailMobile.length == 0)
                {  
                    ////Check Duplicate Email/Mobile
                    duplicateEmailMobile = await dbCommon.checkDuplicateEmailMobile(mobile, "Mobile", "tie_up_school");
                    if(duplicateEmailMobile.length == 0)
                    {
                        ////Check Syllabus
                        syllabus = await dbCommon.getSyllabus(syllabusId);
                        if(syllabus.length == 1)
                        {
                            ////Check Country
                            country = await dbBusiness.getCountry(countryId);
                            if(country.length == 1)
                            {
                                ////Check State/Region
                                stateRegion = await dbBusiness.getStateRegion(stateRegionId, countryId);
                                if(stateRegion.length == 1)
                                {
                                    ////Check District
                                    district = await dbBusiness.getDistrict(districtId, countryId,stateRegionId);
                                    if(district.length == 1)
                                    {
                                        ////Check City
                                        city = await dbBusiness.getCity(cityId, countryId, stateRegionId,districtId);
                                        if(city.length == 1)
                                        {
                                        ////Check Duplicate TieUp School
                                            tieUpSchool = await dbBusiness.duplicateTieUpSchool(name, "");
                                            if(tieUpSchool.length == 0)
                                            {
                                    ///insert TieUp School
                                                let insertJSON = {
                                                    "uuid" : genUUID.v1(),
                                                    "name" : name,
                                                    "email" : email,
                                                    "mobile" : mobile,
                                                    "website" : website,
                                                    "address" : address,
                                                    "countryId" : countryId,
                                                    "stateRegionId" : stateRegionId,
                                                    "districtId" : districtId,
                                                    "cityId" : cityId,
                                                    "pincode" : pincode,
                                                    "contactPerson" : contactPerson,
                                                    "panNumber" : panNumber,
                                                    "syllabusId" : syllabusId,
                                                    "createdById" : authData.id
                                                }
                                                let insertTieUpSchoolResult = await dbBusiness.insertTieUpSchool(insertJSON);
                                                let insertTieUpSchoolId = insertTieUpSchoolResult.insertId;
                                    ///////
                                                if(parseInt(insertTieUpSchoolId) > 0)
                                                {
                                                ///////Insert TieUp School Contract
                                                    let insertContractJSON = {
                                                        "tieUpSchoolId" : insertTieUpSchoolId,
                                                        "contractFrom" : contractFrom,
                                                        "contractTo" : contractTo,
                                                        "createdById" : authData.id
                                                    }
                                                    let insertTieUpSchoolContractResult = await dbBusiness.insertTieUpSchoolContractHistory(insertContractJSON);

                                                    ///////Save Tie-Up School Docs File
                                                    if(academyEnclosureDocument.length > 0)
                                                    {
                                                        totalSaved = await saveTieUpSchoolDocs(req.files, academyEnclosureDocument, insertTieUpSchoolId, authData.id);
                                                ///Remove Files
                                                        commonFunction.deleteFiles(req.files);
                                                    }
                                            ///Remove Files
                                                    commonFunction.deleteFiles(req.files);
                                                    res.status(200)
                                                    return res.json({
                                                        "uuid" : insertJSON.uuid,
                                                        "savedDocs" : totalSaved > 0 ? `${totalSaved}/${academyEnclosureDocument.length}` : '',
                                                        "status_code" : 200,
                                                        "success" : true,                            
                                                        "message" : errorCode.getStatus(200)
                                                    })
                                                }
                                                else
                                                {
                                                    ///Remove Files
                                                    commonFunction.deleteFiles(req.files);
                                                    res.status(500)
                                                    return res.json({
                                                        "status_code" : 500,
                                                        "message" : "Tie-Up School Not Saved",
                                                        "success" : false,
                                                        "error" : errorCode.getStatus(500)
                                                    })
                                                }
                                            }
                                            else
                                            {
                                                ///Remove Files
                                                commonFunction.deleteFiles(req.files);
                                                res.status(500)
                                                return res.json({
                                                    "status_code" : 500,
                                                    "message" : "Tie-Up School Name Already Exist",
                                                    "success" : false,
                                                    "error" : errorCode.getStatus(500)
                                                })
                                            }
                                        }
                                        else
                                        {
                                            ///Remove Files
                                            commonFunction.deleteFiles(req.files);
                                            res.status(500)
                                            return res.json({
                                                "status_code" : 500,
                                                "message" : "City Not Exist For Country : " + city[0].countryName + ", State/Region : " + city[0].stateRegionName + " And District : " + city[0].districtName,
                                                "success" : false,
                                                "error" : errorCode.getStatus(500)
                                            })
                                        }
                                    }
                                    else
                                    {
                                        ///Remove Files
                                        commonFunction.deleteFiles(req.files);
                                        res.status(500)
                                        return res.json({
                                            "status_code" : 500,
                                            "message" : "District Not Exist For Country : " + district[0].countryName + " And State/Region : " + district[0].stateRegionName,
                                            "success" : false,
                                            "error" : errorCode.getStatus(500)
                                        })
                                    }
                                }
                                else
                                {
                                    ///Remove Files
                                    commonFunction.deleteFiles(req.files);
                                    res.status(500)
                                    return res.json({
                                        "status_code" : 500,
                                        "message" : "State/Region Not Exist For Country : " + country[0].name,
                                        "success" : false,
                                        "error" : errorCode.getStatus(500)
                                    })
                                }
                            }
                            else
                            {
                                ///Remove Files
                                commonFunction.deleteFiles(req.files);
                                res.status(500)
                                return res.json({
                                    "status_code" : 500,
                                    "message" : "Country Not Exist",
                                    "success" : false,
                                    "error" : errorCode.getStatus(500)
                                })
                            }
                        }
                        else
                        {
                            ///Remove Files
                            commonFunction.deleteFiles(req.files);
                            res.status(500)
                            return res.json({
                                "status_code" : 500,
                                "message" : "Syllabus Not Exist",
                                "success" : false,
                                "error" : errorCode.getStatus(500)
                            })
                        }
                    }
                    else
                    {
                        ///Remove Files
                        commonFunction.deleteFiles(req.files);
                        res.status(500)
                        return res.json({
                            "status_code" : 500,
                            "message" : "Duplicate Mobile",
                            "success" : false,
                            "error" : errorCode.getStatus(500)
                        })
                    }
                }
                else
                {
                    ///Remove Files
                    commonFunction.deleteFiles(req.files);
                    res.status(500)
                    return res.json({
                        "status_code" : 500,
                        "message" : "Duplicate Email",
                        "success" : false,
                        "error" : errorCode.getStatus(500)
                    })
                }
            }
            else
            {
                ///Remove Files
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
            ///Remove Files
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
        ///Remove Files
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

async function saveTieUpSchoolDocs(files, documentIds, tieUpSchoolId, createdById) 
{
    let savedFc = 0;

    for (let fc = 0; fc < files.length; fc++) 
    {
        try 
        {
            let file = files[fc];
            if (parseFloat(file.size) > 0) 
            {
                let allowedMimeTypes = [
                    'image/png',
                    'image/jpeg',
                    'application/pdf'
                ];

                if (allowedMimeTypes.includes(file.mimetype)) 
                {
                    let insertTieUpSchoolDocumentJSON = {
                        tieUpSchoolId: tieUpSchoolId,
                        documentId: documentIds[fc].id,
                        fileName: "",
                        createdById: createdById
                    };

                    let insertTieUpSchoolDocumentResult = await dbBusiness.insertTieUpSchoolDocument(insertTieUpSchoolDocumentJSON);
                    let insertTieUpSchoolDocId = insertTieUpSchoolDocumentResult.insertId;

                    // File Upload
                    let fileExt = file.originalname.split('.').pop();
                    let sourcePath = file.path;
                    let destiFileName = `${tieUpSchoolId}_${insertTieUpSchoolDocId}.${fileExt}`;
                    let destiPath = commonFunction.getUploadFolder('TieUpSchoolDoc') + destiFileName;

                    await commonFunction.copyFile(sourcePath, destiPath);

                    // Count how many files are saved
                    savedFc += 1;
                    
                    // Update the file name in the database
                    await dbBusiness.updateTieUpSchoolDocFileName(destiFileName, insertTieUpSchoolDocId);
                }
            }
        } 
        catch (e) 
        {
            console.error(`Error processing file ${documentIds[fc].name}:`, e);
        }
    }

    return savedFc;
}