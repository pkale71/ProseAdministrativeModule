const commonFunction = require('../util/commonFunctions.js');
const XLSX = require('xlsx');
let dbCommon = require('../sqlmap/commonQuery.js');
let errorCodes = require('../util/errorCodes.js');
let errorCode = new errorCodes();
////////Variables 
let academicSessionId;
let gradeId;
let syllabusId;
let subjectId;
let chapterId;
/////
let academicSession;
let grade;
let syllabus;
let subject;
let chapter;
let topics;


module.exports = require('express').Router().post('/',async(req,res) =>
{
    try
    {
        let reqData = commonFunction.trimSpaces(req.body);
        let authData = reqData.authData;

        if(reqData.academicSession != undefined && reqData.syllabus != undefined && reqData.grade != undefined && reqData.subject != undefined && reqData.chapter != undefined)
        {
            if(JSON.parse(reqData.academicSession)?.id != "" && JSON.parse(reqData.syllabus)?.id != "" && JSON.parse(reqData.grade)?.id != "" && JSON.parse(reqData.subject)?.id != "" && JSON.parse(reqData.chapter)?.id != "")
            {
                academicSessionId = commonFunction.validateNumber(JSON.parse(reqData.academicSession)?.id);
                syllabusId = commonFunction.validateNumber(JSON.parse(reqData.syllabus)?.id);
                gradeId = commonFunction.validateNumber(JSON.parse(reqData.grade)?.id);
                subjectId = commonFunction.validateNumber(JSON.parse(reqData.subject)?.id);
                chapterId = commonFunction.validateNumber(JSON.parse(reqData.chapter)?.id);

                ////check Academic Session
                academicSession = await dbCommon.getAcademicSession(academicSessionId);
                if(academicSession.length == 1)
                {
                    ///check Syllabus Exist
                    syllabus = await dbCommon.checkSyllabusExist(syllabusId);
                    if(syllabus.length == 1)
                    {
                        ///check Grade Exist
                        grade = await dbCommon.getGrade(gradeId);
                        if(grade.length == 1)
                        {
                            ///check Subject Exist
                            subject = await dbCommon.checkSyllabusWiseSubjectExist(subjectId);
                            if(subject.length == 1)
                            {
                                ///check Chapter Exist
                                chapter = await dbCommon.checkSubjectWiseChapterExist(chapterId);
                                if(chapter.length == 1)
                                {    
                                    if(req.files.length == 1)
                                    {
                                        if(req.files[0].mimetype == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
                                        {
                                            /////get Topics
                                            topics = await dbCommon.getChapterWiseTopics(academicSessionId, syllabusId, gradeId, subjectId, chapterId, 'All');                                    
                                            if(topics.length >= 0)
                                            {
                                                let fileData = readFileAndFormatCheck(req.files[0], topics, req, res);
                                                if(fileData != "")
                                                {  
                                                    if(fileData.data.length > 0)
                                                    {                  
                                                        let insertTopicResult = await dbCommon.insertMultipleTopic(fileData.data, academicSessionId, chapterId, authData.id);
                                                        if(insertTopicResult.insertId > 0)
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
                                        "message" : "Chapter Not Exist",
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
                                    "message" : "Subject Not Exist",
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
                                "message" : "Grade Not Exist",
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
                        "message" : "Academic Session Not Exist",
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

function readFileAndFormatCheck(file, topics, req, res)
{
    try 
    {
        let cellDatas = [];
        let rowCount = 0;
        let insertCount = 0;
        let duplicateCount = 0;
        const workbook = XLSX.readFile(file.path);
        const sheetName = workbook.SheetNames[0];

        if(sheetName == "Topic")
        {
            const worksheet = workbook.Sheets[sheetName];
            const range = XLSX.utils.decode_range(worksheet['!ref']);
            const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
            
            if (data.length > 0) 
            {
                const firstRow = data[0];
                if(firstRow[0].toString().trim().toLowerCase() == "topic name")
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
                    ////////check duplicate topic
                                let duplicateTopic = topics.filter(topic => (topic.name).toString().toLowerCase() == cellValue.toString().trim().toLowerCase());
                                if(duplicateTopic.length == 0)
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