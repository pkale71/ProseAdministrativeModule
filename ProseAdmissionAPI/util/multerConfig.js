const multer = require('multer');
let util = require('../util/commonFunctions.js');
let path = require('path');

///////Multer Config

const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        let filePath = path.join(__dirname, '../', 'uploads/uploadedFiles');
        callback(null, path.resolve(filePath));
    },
    filename: function (req, file, callback) {
        if (file !== undefined) 
        {
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
    // limits: {
    // fileSize: 52048576 // Defined in bytes (50 Mb)
    // }, 
}).any();

module.exports = uploads;