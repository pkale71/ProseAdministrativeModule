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

commonFunction.generateCodeByName = function(name) 
{
    // Remove spaces and convert the name to uppercase
    let cleanedName = name.replace(/\s+/g, '').toUpperCase();  
    // Take the first two letters and last two letters (if name length is sufficient)
    let code = '';    
    if (cleanedName.length >= 4) 
    {
      code = cleanedName.slice(0, 2) + cleanedName.slice(-2);
    } 
    else 
    {
      // If name is shorter, fill with numbers or characters derived from the name
      code = cleanedName.padEnd(4, 'X'); // 'X' used as filler, can replace with any logic
    }
  
    return code;
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
    if(!fs.existsSync(basePath + "/uploads/application-docs"))
    {
        fs.mkdirSync(basePath + "/uploads/application-docs");
    }
    if(!fs.existsSync(basePath + "/uploads/enrollment-docs"))
    {
        fs.mkdirSync(basePath + "/uploads/enrollment-docs");
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
    if(uploadIn == 'ApplicationDoc')
    {       
        folderPath = baseDir + "/uploads/application-docs/";
    }
    else if(uploadIn == 'EnrollmentDoc')
    {       
        folderPath = baseDir + "/uploads/enrollment-docs/";
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

commonFunction.getOrdinal = function(num, suffixWord)
{
    let suffix = 'th';
    if (num % 100 >= 11 && num % 100 <= 13) 
    {
        suffix = 'th';
    } 
    else 
    {
        switch (num % 10) 
        {
            case 1:
                suffix = 'st';
                break;
            case 2:
                suffix = 'nd';
                break;
            case 3:
                suffix = 'rd';
                break;
        }
    }
    return num + suffix + " " + suffixWord;
}

commonFunction.handleDynamicData = function(data) 
{
    let resData = "";
    if (typeof data === 'object' && data !== null && Object.keys(data).length > 0) 
    {
        // Handle object
        for(let i=0;i<Object.keys(data).length;i++)
        {
            resData = data[Object.keys(data)[0]];
            break;
        }
    }
    return resData;
}
  

commonFunction.getExternalAPI = function(url)
{
    try 
    {
        return new Promise((resolve, reject) => 
        {
            axios.get(url, {
                headers: {
                  Authorization: `Bearer ${global.bearerToken}`,
                },
            })
            .then(async response1 => {
                if (response1?.data?.status_code == 200) 
                {
                    let resultData = await commonFunction.handleDynamicData(response1.data);
                    if(resultData != "")
                    {
                        resolve(resultData);
                    }
                    else
                    {
                        resolve(false);
                    }
                }
                else 
                {
                    return resolve(false);
                }
            })
            .catch(error => 
            {
                return resolve(false);
            });
        });
    }
    catch (e) {
        return(false);
    }
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

commonFunction.generateShortDescription = function(sentence) 
{
    const excludeWords = ['of', 'by', 'a', 'the', 'and', 'for', 'to', 'in', 'on', 'with'];
    
    const meaningfulWords = sentence
    .split(' ') // Split into words
    .map(word => word.replace(/[^a-zA-Z0-9]/g, '')) // Remove non-alphanumeric characters
    .filter(word => word.length > 0 && !excludeWords.includes(word.toLowerCase())) // Exclude filler words
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .splice(0,5); // Capitalize first letter of each word

    return `${meaningfulWords.join('_')}`;  
}

commonFunction.convertNumberToWords = function(amount) 
{
    const ones = [
        "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
        "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen",
        "Seventeen", "Eighteen", "Nineteen"
    ];
    const tens = [
        "", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"
    ];
    const places = ["", "Thousand", "Lakh", "Crore"];

    if (amount === 0) return "Zero";
    if (amount < 0) return `Negative ${commonFunction.convertNumberToWords(-amount)}`;

    let result = '';
    let place = 0;

    while (amount > 0) {
        let chunk;
        if (place === 1 || place === 2) {
            // Thousand and Lakh place groups 2 digits
            chunk = amount % 100;
            amount = Math.floor(amount / 100);
        } else {
            // Units and Crore place groups 3 digits
            chunk = amount % 1000;
            amount = Math.floor(amount / 1000);
        }

        if (chunk > 0) {
            result = commonFunction.convertBelowThousand(chunk) +
                (places[place] ? ' ' + places[place] : '') + ' ' + result;
        }

        place++;
    }

    return result.trim();
};

commonFunction.convertBelowThousand = function(amount) 
{
    const ones = [
        "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
        "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen",
        "Seventeen", "Eighteen", "Nineteen"
    ];
    const tens = [
        "", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"
    ];

    let result = '';
    if (amount >= 100) {
        result += ones[Math.floor(amount / 100)] + ' Hundred ';
        amount %= 100;
    }
    if (amount >= 20) {
        result += tens[Math.floor(amount / 10)] + ' ';
        amount %= 10;
    }
    result += ones[amount];

    return result.trim();
};

module.exports = commonFunction;