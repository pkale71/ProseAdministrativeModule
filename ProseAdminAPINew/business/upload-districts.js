const buildJSON = require('./buildBusinessJSONs.js');
const commonFunction = require('../util/commonFunctions.js');
const XLSX = require('xlsx');
let dbBusiness = require('../sqlmap/businessQuery.js');
let errorCodes = require('../util/errorCodes.js');
let errorCode = new errorCodes();
////////Variables 
let countryId;
let stateRegionId;
//////
let districts;
let country;
let stateRegion;

module.exports = require('express').Router().post('/', async(req,res) =>
{
    try
    {
        let reqData = commonFunction.trimSpaces(req.body);
        let authData = reqData.authData;

        if(reqData.country != undefined && reqData.stateRegion != undefined)
        {
            if(JSON.parse(reqData.country)?.id != "" && JSON.parse(reqData.stateRegion)?.id != "")
            {
                countryId = commonFunction.validateNumber(JSON.parse(reqData.country)?.id);
                stateRegionId = commonFunction.validateNumber(JSON.parse(reqData.stateRegion)?.id);

                ////Check Country
                country = await dbBusiness.getCountry(countryId);
                if(country.length == 1)
                {
                     ////Check State/Region
                    stateRegion = await dbBusiness.getStateRegion(stateRegionId, countryId);
                    if(stateRegion.length == 1)
                    {
                        if(req.files.length == 1)
                        {
                            if(req.files[0].mimetype == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
                            {
                                /////get districts
                                districts = await dbBusiness.getDistricts(countryId, stateRegionId, 'All');
                                if(districts.length >= 0)
                                {
                                    let fileData = readFileAndFormatCheck(req.files[0], districts, req, res);
                                    if(fileData != "")
                                    {  
                                        if(fileData.data.length > 0)
                                        {                  
                                            let insertDistrictResult = await dbBusiness.insertMultipleDistrict(fileData.data, countryId, stateRegionId, authData.id);
                                            if(insertDistrictResult.insertId > 0)
                                            {
                                                ///Remove Files
                                                commonFunction.deleteFiles(req.files);
                                                res.status(200)
                                                return res.json({
                                                    "totalCount" : fileData.totalRows,
                                                    "insertCount" : fileData.insertRows,
                                                    "duplicateCount" : fileData.duplicateRows,
                                                    "status_code" : 200,
                                                    "success" : true,                            
                                                    "message" : errorCode.getStatus(200)
                                                })
                                            }
                                        }
                                        else
                                        {
                                        ///Remove Files
                                            commonFunction.deleteFiles(req.files);
                                            res.status(200)
                                            return res.json({
                                                "totalCount" : fileData.totalRows,
                                                "insertCount" : fileData.insertRows,
                                                "duplicateCount" : fileData.duplicateRows,
                                                "status_code" : 200,
                                                "success" : true,                            
                                                "message" : errorCode.getStatus(200)
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
                                            "message" : "Worksheet Is Empty",
                                            "success" : false,
                                            "error" : errorCode.getStatus(500),
                                        });
                                    }  
                                }
                            }
                            else
                            {
                                ///Remove Files
                                commonFunction.deleteFiles(req.files);
                                res.status(500)
                                    return res.json({
                                        "status_code" : 500,
                                        "message" : "Invalid File Format",
                                        "success" : false,
                                        "error" : errorCode.getStatus(500),
                                    });
                            }
                        }
                        else
                        {
                            ///Remove Files
                            commonFunction.deleteFiles(req.files);
                            res.status(500)
                            return res.json({
                                "status_code" : 500,
                                "message" : "Missing File",
                                "success" : false,
                                "error" : errorCode.getStatus(500),
                            });
                        }
                    }
                    else
                    {
                        ///Remove Files
                        commonFunction.deleteFiles(req.files);
                        res.status(500)
                        return res.json({
                            "status_code" : 500,
                            "message" : "State/Region Not Exist",
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
        if (!res.headersSent) 
        {
            ///Remove Files
            commonFunction.deleteFiles(req.files);
            res.status(500)
            return res.json({
                "status_code" : 500,
                "message" : "Something Went Wrong",
                "success" : false,
                "error" : e,
            });
        }
    }
})

function readFileAndFormatCheck(file, districts, req, res)
{
    try 
    {
        let cellDatas = [];
        let rowCount = 0;
        let insertCount = 0;
        let duplicateCount = 0;
        const workbook = XLSX.readFile(file.path);
        const sheetName = workbook.SheetNames[0];

        if(sheetName == "District")
        {
            const worksheet = workbook.Sheets[sheetName];
            const range = XLSX.utils.decode_range(worksheet['!ref']);
            const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
            
            if (data.length > 0) 
            {
                const firstRow = data[0];
                if(firstRow[0].toString().trim().toLowerCase() == "district name")
                {
                    for (let R = range.s.r + 1; R <= range.e.r; R++) 
                    {
                        let cellAddress = { c: 0, r: R };
                        const cellRef = XLSX.utils.encode_cell(cellAddress);
                        // Check if the cell exists 
                        if (worksheet[cellRef]) 
                        {
                            let cellValue = worksheet[cellRef].v;
                            if(cellValue != null && cellValue != "" && cellValue != undefined)
                            {
                    ////////check duplicate district
                                let duplicateDistrict = districts.filter(district => (district.name).toString().toLowerCase() == cellValue.toString().trim().toLowerCase());
                                if(duplicateDistrict.length == 0)
                                {
                                    cellDatas.push({"name" : cellValue.toString().trim()});
                                    insertCount++;
                                }
                                else
                                {
                                    duplicateCount++;
                                }
                                rowCount++;
                            }
                            else
                            {
                                break;
                            }
                        } 
                        else 
                        {
                            break; // Exit loop if encounter empty row
                        }
                    }
                    return {
                        "data" : cellDatas,
                        "totalRows" : rowCount,
                        "insertRows" : insertCount,
                        "duplicateRows" : duplicateCount
                    };
                }
                else
                {
                    res.status(500);
                    return res.json({
                        "status_code" : 500,
                        "message" : "Column Name Mismatch",
                        "success" : false,
                        "error" : errorCode.getStatus(500),
                    });
                }
            } 
            else 
            {
                ///Remove Files
                commonFunction.deleteFiles(req.files);
                res.status(500);
                return res.json({
                    "status_code" : 500,
                    "message" : "Worksheet is Empty",
                    "success" : false,
                    "error" : errorCode.getStatus(500),
                });
            }
        }
        else
        {
            ///Remove Files
            commonFunction.deleteFiles(req.files);
            res.status(500)
            return res.json({
                "status_code" : 500,
                "message" : "Invalid Sheet Name",
                "success" : false,
                "error" : errorCode.getStatus(500),
            });
        }
    } 
    catch (e) 
    {
        throw {
            status_code: 500,
            message: "Error Reading File",
            success: false,
            error: e
        };
    }
}
