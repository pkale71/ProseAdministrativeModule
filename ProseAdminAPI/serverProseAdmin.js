let host = "localhost";
let port = "3000";
const apiBaseUrl = `http://${host}:${port}`;
let express = require('express');
let bodyParser = require('body-parser');
let cors = require('cors');
let commonFunction = require('./util/commonFunctions.js');
let uploads = require('./util/multerConfig.js');
let dbConn = require('./util/dbConnection.js');
// let https = require('https');

////////Create Server
let app = express();
app.use(cors());
app.use(bodyParser.json({limit: '100mb', "uploads" : uploads}));
app.use(bodyParser.urlencoded({limit: '100mb',extended : true}));

/////////Routings
app.use('/api/common', require('./common/commonRoute.js'));
app.use('/api/user', require('./user/userRoute.js'));
app.use('/api/business', require('./business/businessRoute.js'));

app.use('/api/',(req,res,next) =>
{
    return res.status(400).json({
        "status_code" : 400,
        "message" : "Something went wrong",
        "status_name" : getCode.getStatus(400),
        "error"     : "Wrong method or api"
    }) 
})

if(dbConn)
{
///////Check Database Connection 
    try
    {
        let sql = `SELECT DATE_FORMAT(NOW(), '%Y-%m-%d %H:%m:%s') AS startedOn FROM DUAL`
        dbConn.query(sql,(error, result) => 
        {
            if(error)
            {
                let failedOn = (new Date().toISOString().split('T').join(" ")).split(".")[0];
                console.log("Database Connection Failed, Failed On : " + failedOn);
                return;
            }  
    ///////Start Server        
            app.listen(port, host, () => {
                commonFunction.createRequiredDir(process.cwd());
                console.log(`Server is running on ${apiBaseUrl}, Started On : ` + result[0].startedOn);
            });
        });
    }
    catch(e)
    {
        throw e
    }
}