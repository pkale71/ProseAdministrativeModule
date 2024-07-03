const commonFunction = require('../util/commonFunctions.js');
let dbUser = require('../sqlmap/userQuery.js');
let genUUID = require('uuid');
let errorCodes = require('../util/errorCodes.js');
let errorCode = new errorCodes();
let fs = require('fs');
////////Variables 
let firstName;
let lastName;
let gender;
let email;
let mobile;
let userGradeId;
let userCategoryId;
let password;
let userOnBoardingCode;
//////
let user;
let userOnBoarding;

module.exports = require('express').Router().post('/',async(req,res) =>
{
    try
    {
        let reqData = commonFunction.trimSpaces(req.body);
        let authData = reqData.authData;
        
        if(reqData.firstName != undefined && reqData.lastName != undefined && reqData.email != undefined && reqData.mobile != undefined && reqData.gender != undefined && reqData.userGrade != undefined && JSON.parse(reqData.userGrade).id != undefined && reqData.userCategory != undefined && JSON.parse(reqData.userCategory).id != undefined && reqData.password != undefined && reqData.userOnBoarding != undefined)
        {
            if(reqData.firstName != "" && reqData.email != "" && reqData.mobile != "" && reqData.gender != "" && JSON.parse(reqData.userGrade)?.id != "" && reqData.password != "" && reqData.userOnBoarding.code != "")
            {
                firstName = reqData.firstName;
                lastName = reqData.lastName;
                email = reqData.email;
                mobile = reqData.mobile;
                gender = reqData.gender;
                userGradeId = commonFunction.validateNumber(JSON.parse(reqData.userGrade).id);
                userCategoryId = commonFunction.validateNumber(JSON.parse(reqData.userCategory)?.id);
                password = reqData.password;
                userOnBoardingCode = JSON.parse(reqData.userOnBoarding)?.code;

            /////Check Valid User On-Boarding Code
                userOnBoarding = await dbUser.getUserOnBoardingLink(userOnBoardingCode);
                if(userOnBoarding.length == 1)
                {
                ////Check Duplicate Email/Mobile
                    user = await dbUser.checkDuplicateEmailMobile(email, mobile);
                    if(user.length == 0)
                    {       
                ///insert User
                        let insertJSON = {
                            "uuid" : genUUID.v1(),
                            "firstName" : firstName,
                            "lastName" : lastName,
                            "email" : email,
                            "mobile" : mobile,
                            "gender" : gender,
                            "userGradeId" : userGradeId,
                            "userCategoryId" : userCategoryId,
                            "password" : password,
                            "createdById" : userOnBoarding[0].createdById
                        }
                        let insertUserResult = await dbUser.insertUser(insertJSON);
            /////SaveProfilePic
                        let insertUserId = insertUserResult.insertId;
                        if(req.files != "")
                        {
                            if(parseFloat(req.files[0].size) > 0)
                            {
                                if(req.files[0].mimetype == 'image/png' || req.files[0].mimetype == 'image/jpeg')
                                {
                                //File Upload
                                    let fileExt = req.files[0].originalname.split('.').pop();
                                    let sourcePath = req.files[0].path;
                                    let destiFileName = `${insertJSON.uuid}_Pic.${fileExt}`;
                                    let destiPath = commonFunction.getUploadFolder('UserDoc') + destiFileName;
                                    commonFunction.copyFile(sourcePath, destiPath);
                                    commonFunction.deleteFiles(req.files);
                                //////
                                    let saveProfilePicResult = await dbUser.updateUserProfilePic(destiFileName, insertUserId);
                                }
                            }
                        }
            ///////
                        if(parseInt(insertUserId) > 0)
                        {
                            /////update user on-boarding JSON
                            let updateJSON = {
                                "code" : userOnBoardingCode,
                                "userId" : insertUserId
                            }
                            let updateUserOnBoardingResult = await dbUser.updateUserOnBoardingCompleted(updateJSON);

                            res.status(200)
                            return res.json({
                                "uuid" : insertJSON.uuid,
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
                                "message" : "User Not Saved",
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
                            "message" : "Duplicate Email OR Mobile",
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
                        "message" : "Invalid On-Boarding Link OR User Already Created With Same Email Or Mobile",
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
