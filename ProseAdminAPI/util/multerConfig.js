const multer = require('multer');
let util = require('../util/commonFunctions.js');
let path = require('path');

///////Multer Config

const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        //console.log(__dirname);
        let filePath = path.join(__dirname, '../', 'uploads/uploadedFiles');
        //console.log(path.resolve(filePath))
        callback(null, path.resolve(filePath));
    },
    filename: function (req, file, callback) {
        //console.log(file)
        if (file !== undefined) 
        {
            //console.log(file.originalname); // User-defined filename is available
            const filename = `${util.ramdomString(6) + "_" + file.originalname}`; // Create custom filename (ramdomString)
            callback(null, filename);
            
        }
        else
        {
            callback(null, null);
        }
    }
})

const uploads = multer({ 
    storage: storage,
    limits: {
    fileSize: 11048576 // Defined in bytes (10 Mb)
    }, 
}).any();

module.exports = uploads;