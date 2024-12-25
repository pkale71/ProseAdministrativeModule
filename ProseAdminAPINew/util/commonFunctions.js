const commonFunction = {};
const axios = require('axios');
const moment = require('moment');
let fs = require('fs');

commonFunction.getUserNameFromEmail = function(email) 
{
    // Extract the part before the @ symbol
    let userName = email.split('@')[0];
    // Replace any dots or underscores with spaces
    userName = userName.replace(/[._]/g, ' ');
    // Capitalize the first letter of each word
    userName = userName.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    return(userName);
}

commonFunction.isValidURL = function(url) 
{
    const regex = /^(https?:\/\/)?([a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z]{2,})(\/[a-zA-Z0-9@:%._\+~#=\/-]*)?$/;
    return regex.test(url);
}

commonFunction.isJsonArray = function(jsonString) 
{
    try 
    {
      const parsedData = jsonString;
      return Array.isArray(parsedData);
    } 
    catch (e) 
    {
      return false;
    }
}

commonFunction.generateCode = function(length, prefix, id)
{
    let res = '';
    let end = parseInt(length) - parseInt(id.toString().length);
    for(let i=1;i<=end;i++)
    {
        res = res + '0';
    }
    res = prefix + res + id;
    return (res);
}

commonFunction.isValidDate = function(dateString, format) 
{
    return moment(dateString, format, true).isValid();
}

commonFunction.isValidTime = function(timeString) 
{
    return moment(timeString, ["HH:mm", "HH:mm:ss"], true).isValid();
}

commonFunction.validateNumber = function(data, zeroRequired = 'No')
{
    let val = '';
    if(zeroRequired == 'Yes')
    {
        val = !Number.isNaN(Number(data)) ? data : '';
    }
    else
    {
        val = !Number.isNaN(Number(data)) ? (parseFloat(data) > 0 ? data : '') : '';
    }
    return (val);
}

commonFunction.databaseName = function()
{
    return "prose_administrative";
}

commonFunction.trimSpaces = function(data)
{
    let resData = JSON.parse(JSON.stringify(data).replace(/"\s+|\s+"/g,'"'));
    resData = JSON.parse(JSON.stringify(resData).replace("'","''"));
    return resData;
}

commonFunction.deleteFiles = async function(files) 
{
    try 
    {
        for(let i=0;i<files.length;i++)
        {
            let filePath = files[i].path;
            if(fs.existsSync(filePath))
            {
                fs.unlinkSync(filePath);
            }
        }
    } catch (err) {
        console.error(err);
    }
}

commonFunction.deleteFileByPath = async function(filePath) 
{
    try 
    {
        if(fs.existsSync(filePath))
        {
            fs.unlinkSync(filePath);
        }
    } catch (err) {
        console.error(err);
    }
}

commonFunction.copyFile = async function(sourcePath, destiPath) 
{
    try 
    {
        if(fs.existsSync(sourcePath))
        {
            fs.copyFileSync(sourcePath, destiPath);
        }
    } catch (err) {
        console.error(err);
    }
}

commonFunction.createRequiredDir = function(basePath)
{
    if(!fs.existsSync(basePath + "/uploads"))
    {
        fs.mkdirSync(basePath + "/uploads");
    }
    if(!fs.existsSync(basePath + "/uploads/user-docs"))
    {
        fs.mkdirSync(basePath + "/uploads/user-docs");
    }
    if(!fs.existsSync(basePath + "/uploads/business-partner-docs"))
    {
        fs.mkdirSync(basePath + "/uploads/business-partner-docs");
    }
    if(!fs.existsSync(basePath + "/uploads/tie-up-school-docs"))
    {
        fs.mkdirSync(basePath + "/uploads/tie-up-school-docs");
    }
    if(!fs.existsSync(basePath + "/uploads/study-center-docs"))
    {
        fs.mkdirSync(basePath + "/uploads/study-center-docs");
    }
    if(!fs.existsSync(basePath + "/uploads/school-docs"))
    {
        fs.mkdirSync(basePath + "/uploads/school-docs");
    }
    /////////////
    if(!fs.existsSync(basePath + "/uploads/uploadedFiles")) // For Multer Files
    {
        fs.mkdirSync(basePath + "/uploads/uploadedFiles");
    }
}

commonFunction.getUploadFolder = function(uploadIn)
{
    //After uploads Folder
    let folderPath = '';
    let baseDir = global.baseDir;
    if(uploadIn == 'UserDoc')
    {       
        folderPath = baseDir + "/uploads/user-docs/";
    }
    else if(uploadIn == 'BusinessPartnerDoc')
    {       
        folderPath = baseDir + "/uploads/business-partner-docs/";
    }
    else if(uploadIn == 'TieUpSchoolDoc')
    {       
        folderPath = baseDir + "/uploads/tie-up-school-docs/";
    }
    else if(uploadIn == 'StudyCenterDoc')
    {       
        folderPath = baseDir + "/uploads/study-center-docs/";
    }
    else if(uploadIn == 'SchoolDoc')
    {       
        folderPath = baseDir + "/uploads/school-docs/";
    }

    return folderPath;
}

commonFunction.ramdomString = function(length)
{
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
    }
    return result;
}

commonFunction.generateToken = function(length)
{
    let keys = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890".split("");
    let resData = [];  
    for (let i=0; i<length; i++) 
    {
        let j = (Math.random() * (keys.length-1)).toFixed(0);
        resData[i] = keys[j];
    }
    return resData.join("");
}

commonFunction.sendMail = function (toEmail, fullName, emailBody) 
{
    try 
    {
        const headers = 
        {
            'Content-Type': 'application/json',
            'API-key' : ''
        };
        let data = JSON.stringify(
        {  
            "sender":{  
               "name":"Admin",
               "email":"admin@proseedu.com"
            },
            "to":[  
               {  
                  "email":toEmail,
                  "name":fullName
               }
            ],
            "subject":"Welcome to PROSE EDU",
            "htmlContent":`<html><head></head><body>${emailBody}</body></html>`
        });

        return new Promise((resolve, reject) => 
        {
            let url = 'https://api.brevo.com/v3/smtp/email';
            axios.post(url, data, 
            {
                headers: headers
            })
            .then(response1 => {
                if (response1?.status == 201) 
                {
                    resolve(true);
                }
                else 
                {
                    resolve(false);
                }
            })
            .catch(error => 
            {
                resolve(false);
            });
        });
    }
    catch (e) {
        return(false);
    }
}

commonFunction.getSecretKey = function()
{
    return ("prose@admin~2024");
    //////DECRYPT
    //CONVERT(AES_DECRYPT(UNHEX(password), 'prose@admin~2024'), CHAR)
    /////ENCRYPT
    //HEX(AES_ENCRYPT(password, 'prose@admin~2024'))
}

commonFunction.removeCommaSeparatedString = function(inputString, removeString) 
{
    // Convert the input string into an array by splitting at commas
    let items = inputString.toString().split(',');

    // Remove all instances of the removeString from the array
    items = items.filter(item => item.trim() !== removeString.trim());

    // Join the array back into a string with commas and trim any extra spaces
    let result = items.join(',').trim();

    // If the result is empty or only contains commas, return an empty string
    if (result === '' || result === ',') {
        result = '';
    }

    return result;
}

commonFunction.getFormattedDate = function(myDate, dateFormat)
{
    let resultDate = "";
    if(myDate != null)
    {
        let tempDate = new Date(myDate);
        let month = (parseInt(tempDate.getMonth())+1) < 10 ? "0"+(parseInt(tempDate.getMonth())+1) : (parseInt(tempDate.getMonth())+1);
        let date = (tempDate.getDate() < 10 ? ("0" + tempDate.getDate()) : tempDate.getDate());
        if(dateFormat == 'yyyy-mm-dd')
        {
            resultDate = tempDate.getFullYear()+"-"+month+"-"+date;
        }
    }
    return(resultDate);
}

commonFunction.onBoardingEmailBody = function(linkUrl, email)
{
    let userName = commonFunction.getUserNameFromEmail(email);

    let emailBody = `<p>Dear ${userName},</p><br><p>Welcome to PROSE EDU! We’re thrilled to have you join our community.</p><br><p>Personalize your profile by adding a profile picture and filling out your details. <a href = ${linkUrl}>Complete Your Profile</a>.</p><br><p></p><p>Best regards,</p><p>Prose Edu Team</p>`;
    return(emailBody);
}

module.exports = commonFunction;