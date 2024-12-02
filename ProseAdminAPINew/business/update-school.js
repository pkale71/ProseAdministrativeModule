const commonFunction = require('../util/commonFunctions.js');
let dbBusiness = require('../sqlmap/businessQuery.js');
let dbCommon = require('../sqlmap/commonQuery.js');
let errorCodes = require('../util/errorCodes.js');
let errorCode = new errorCodes();
let genUUID = require('uuid');
////////Variables
let uuid; 
let name;
let code;
let email;
let mobile1;
let mobile2;
let landline1;
let landline2;
let website;
let schoolingGroupId;
let schoolSubGroupId;
let schoolingCategoryId;
let address;
let countryId;
let stateRegionId;
let districtId;
let cityId;
let pincode;
let contractFrom;
let contractTo;
let deliveryModeId;
let schoolingProgramIds;
let allowedMimeTypes = [
    'image/png',
    'image/jpeg'
];

//////
let schoolingGroup;
let schoolSubGroup;
let schoolingCategory;
let duplicateEmailMobile;
let country;
let stateRegion;
let district;
let city;
let school;
let oldFileName;
let schoolId;
let deliveryMode;
let schoolingProgram;
let schoolingProgramArray;

module.exports = require('express').Router().post('/',async(req,res) =>
{
    try
    {
        totalSaved = 0;
        let reqData = commonFunction.trimSpaces(req.body);
        let authData = reqData.authData;
        
        if(reqData.uuid != undefined && reqData.name != undefined && reqData.email != undefined && reqData.mobile1 != undefined && reqData.mobile2 != undefined && reqData.landline1 != undefined && reqData.landline2 != undefined && reqData.website != undefined && reqData.address != undefined && reqData.country != undefined && reqData.stateRegion != undefined && reqData.district != undefined && reqData.city != undefined && reqData.pincode != undefined && reqData.schoolingGroup != undefined && reqData.schoolSubGroup != undefined && reqData.schoolingCategory != undefined && reqData.contractFrom != undefined && reqData.contractTo != undefined && reqData.deliveryMode != undefined && reqData.schoolingProgramIds != undefined)
        {
            if(reqData.uuid != "" && reqData.name != "" && reqData.email != "" && reqData.mobile1 != "" && reqData.address != "" && JSON.parse(reqData.country).id != "" && JSON.parse(reqData.stateRegion).id != "" && JSON.parse(reqData.district).id != "" && JSON.parse(reqData.city).id != "" && reqData.pincode != "" && JSON.parse(reqData.schoolingGroup).id != "" && JSON.parse(reqData.schoolSubGroup).id != "" && JSON.parse(reqData.schoolingCategory).id != "" && JSON.parse(reqData.deliveryMode).id != "")
            {
                uuid = reqData.uuid;
                name = reqData.name;
                email = reqData.email;
                mobile1 = reqData.mobile1;
                mobile2 = reqData.mobile2;
                landline1 = reqData.landline1;
                landline2 = reqData.landline2;
                website = reqData.website;
                contractFrom = reqData.contractFrom;
                contractTo = reqData.contractTo;
                pincode = commonFunction.validateNumber(reqData.pincode);
                address = reqData.address;
                countryId = commonFunction.validateNumber(JSON.parse(reqData.country).id);
                stateRegionId = commonFunction.validateNumber(JSON.parse(reqData.stateRegion).id);
                districtId = commonFunction.validateNumber(JSON.parse(reqData.district).id);
                cityId = commonFunction.validateNumber(JSON.parse(reqData.city).id);
                schoolingGroupId = commonFunction.validateNumber(JSON.parse(reqData.schoolingGroup).id);
                schoolSubGroupId = commonFunction.validateNumber(JSON.parse(reqData.schoolSubGroup).id);
                schoolingCategoryId = commonFunction.validateNumber(JSON.parse(reqData.schoolingCategory).id);
                deliveryModeId = commonFunction.validateNumber(JSON.parse(reqData.deliveryMode).id);
                schoolingProgramIds = reqData.schoolingProgramIds;
            
                /////check School UUID
                school = await dbBusiness.getSchool(uuid);
                if(school.length == 0)
                {
                    ///Remove Files
                    commonFunction.deleteFiles(req.files);
                    res.status(500)
                    return res.json({
                        "status_code" : 500,
                        "message" : "Invalid School",
                        "success" : false,
                        "error" : errorCode.getStatus(500)
                    })                    
                }
                else
                {
                    schoolId = school[0].id;
                    oldFileName = school[0].logoFileName;
                    code = school[0].code;
                }
            /////check School Logo Format
                if(req.files.length > 0)
                {
                    if(!allowedMimeTypes.includes(req.files[0].mimetype) || parseFloat(req.files[0].size) == 0)
                    {
                        ///Remove Files
                        commonFunction.deleteFiles(req.files);
                        res.status(500)
                        return res.json({
                            "status_code" : 500,
                            "message" : "Invalid File Format Or Zero Size File, Only (JPG, PNG) File Types Are Allowed",
                            "success" : false,
                            "error" : errorCode.getStatus(500)
                        })
                    }
                }
                /////check Schooling Program
                if(schoolingProgramIds != "")
                {
                    schoolingProgramArray = schoolingProgramIds.toString().split(",");
                    schoolingProgram = await dbCommon.getSchoolingProgram(schoolingProgramIds);
                    if(schoolingProgram.length != schoolingProgramArray.length)
                    { 
                        //Remove Files
                        commonFunction.deleteFiles(req.files);
                        res.status(500)
                        return res.json({
                            "status_code" : 500,
                            "message" : "Some Of The Schooling Program Are Invalid",
                            "success" : false,
                            "error" : errorCode.getStatus(500)
                        })
                    }
                    else
                    {
                        let tempSchoolingProgram = await dbCommon.checkSchoolingProgramExist(schoolingProgramIds, school[0].id);
                        if(tempSchoolingProgram.length > 0)
                        { 
                            //Remove Files
                            commonFunction.deleteFiles(req.files);
                            res.status(500)
                            return res.json({
                                "status_code" : 500,
                                "message" : "Some Of The Schooling Program Are Already Exist",
                                "success" : false,
                                "error" : errorCode.getStatus(500)
                            })
                        }
                    }
                }
            /////check Schooling Group
                schoolingGroup = await dbCommon.getSchoolingGroup(schoolingGroupId);
                if(schoolingGroup.length == 0)
                {
                //Remove Files
                    commonFunction.deleteFiles(req.files);
                    res.status(500)
                    return res.json({
                        "status_code" : 500,
                        "message" : "Invalid Schooling Group",
                        "success" : false,
                        "error" : errorCode.getStatus(500)
                    })
                }
            /////check Delivery Mode
                deliveryMode = await dbBusiness.getDeliveryMode(deliveryModeId);
                if(deliveryMode.length == 0)
                {
                //Remove Files
                    commonFunction.deleteFiles(req.files);
                    res.status(500)
                    return res.json({
                        "status_code" : 500,
                        "message" : "Invalid Delivery Mode",
                        "success" : false,
                        "error" : errorCode.getStatus(500)
                    })
                }
            /////check School SubGroup
                schoolSubGroup = await dbCommon.getSchoolSubGroup(schoolSubGroupId);
                if(schoolSubGroup.length == 0)
                {
                //Remove Files
                    commonFunction.deleteFiles(req.files);
                    res.status(500)
                    return res.json({
                        "status_code" : 500,
                        "message" : "Invalid School Sub-Group",
                        "success" : false,
                        "error" : errorCode.getStatus(500)
                    })
                }
            /////check Schooling Category
                schoolingCategory = await dbCommon.getSchoolingCategory(schoolingCategoryId);
                if(schoolingCategory.length == 0)
                {
                //Remove Files
                    commonFunction.deleteFiles(req.files);
                    res.status(500)
                    return res.json({
                        "status_code" : 500,
                        "message" : "Invalid Schooling Category",
                        "success" : false,
                        "error" : errorCode.getStatus(500)
                    })
                }
                
                ////Check Duplicate Email/Mobile
                duplicateEmailMobile = await dbCommon.checkDuplicateEmailMobile(email, "Email", "school", school[0].id);
                if(duplicateEmailMobile.length == 0)
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
                                ////Check Duplicate School
                                    school = await dbBusiness.duplicateSchool(name, uuid);
                                    if(school.length == 0)
                                    {
                            ///insert School
                                        let updateJSON = {
                                            "uuid" : uuid,
                                            "schoolId" : schoolId,
                                            "name" : name,
                                            "email" : email,
                                            "website" : website,
                                            "mobile1" : mobile1,
                                            "mobile2" : mobile2,
                                            "landline1" : landline1,
                                            "landline2" : landline2,
                                            "schoolingGroupId" : schoolingGroupId,
                                            "schoolSubGroupId" : schoolSubGroupId,
                                            "schoolingCategoryId" : schoolingCategoryId,
                                            "schoolingProgramIds" : schoolingProgramArray || "",
                                            "address" : address,
                                            "countryId" : countryId,
                                            "stateRegionId" : stateRegionId,
                                            "districtId" : districtId,
                                            "cityId" : cityId,
                                            "pincode" : pincode,
                                            "deliveryModeId" : deliveryModeId,
                                            "contractFrom" : contractFrom,
                                            "contractTo" : contractTo,
                                            "updatedById" : authData.id
                                        }
                                        let updateSchoolResult = await dbBusiness.updateSchool(updateJSON);
                            ///////
                                        if(updateSchoolResult.affectedRows > 0)
                                        {       
                                            ///////Save School Docs File
                                            if(req.files.length > 0)
                                            {
                                                totalSaved = await saveSchoolDocs(req.files[0], code, schoolId, oldFileName, updateJSON.updatedById);
                                        ///Remove Files
                                                commonFunction.deleteFiles(req.files);
                                            }
                                            res.status(200)
                                            return res.json({
                                                "uuid" : updateJSON.uuid,
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
                                                "message" : "School Not Saved",
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
                                            "message" : "School Name Already Exist",
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
                                        "message" : "City Not Exist For Country : " + district[0].countryName + ", State/Region : " + district[0].stateRegionName + " And District : " + district[0].name,
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
                                    "message" : "District Not Exist For Country : " + stateRegion[0].countryName + " And State/Region : " + stateRegion[0].name,
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

async function saveSchoolDocs(file, code, schoolId, oldFileName, updatedById) 
{
    let savedFc = 0;    
    try 
    {
        if (parseFloat(file.size) > 0) 
        {            
            // File Upload
            let fileExt = file.originalname.split('.').pop();
            let sourcePath = file.path;
            let destiFileName = `${code}.${fileExt}`;
            let destiPath = commonFunction.getUploadFolder('SchoolDoc') + destiFileName;
        ////Remove Old File
            await commonFunction.deleteFileByPath(commonFunction.getUploadFolder('SchoolDoc') + oldFileName);
        /////Save New File    
            await commonFunction.copyFile(sourcePath, destiPath);

            // Count how many files are saved
            savedFc = 1;

            // Update the file name in the database
            await dbBusiness.updateSchoolLogoFileName(destiFileName, schoolId, updatedById);
        }
    } 
    catch (e) 
    {
        // console.error(`Error processing file ${documentIds[fc].name}:`, e);
        res.status(500)
        return res.json({
        "status_code" : 500,
        "message" : "Something Went Wrong",
        "success" : false,
        "error" : e,
        });
    }

    return savedFc;
}